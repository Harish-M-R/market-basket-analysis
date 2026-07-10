import os
import sys
import threading
import subprocess
import time
import uuid

# ADD HADOOP TO PATH
os.environ['HADOOP_HOME'] = r'C:\hadoop-3.4.2\hadoop-3.4.2'
os.environ['JAVA_HOME'] = r'C:\Program Files\Amazon Corretto\jdk1.8.0_482'
os.environ['PATH'] = r'C:\hadoop-3.4.2\hadoop-3.4.2\bin;C:\Program Files\Amazon Corretto\jdk1.8.0_482\bin;' + os.environ.get('PATH', '')

from flask import Flask, render_template, request, jsonify, send_file

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

JAR_PATH = r"C:\Users\Harish\OneDrive\Desktop\Big Boys\market-basket-analysis\output\marketbasket.jar"

# In-memory job tracking: { job_id: { status, logs, error, elapsed } }
jobs = {}


# ─── Helpers ────────────────────────────────────────────────────────────────

def log(job_id, msg):
    timestamp = time.strftime('%H:%M:%S')
    jobs[job_id]['logs'].append(f"[{timestamp}] {msg}")
    print(f"[{job_id[:8]}] {msg}")


def run_cmd(cmd):
    env = os.environ.copy()
    env['HADOOP_HOME'] = r'C:\hadoop-3.4.2\hadoop-3.4.2'
    env['JAVA_HOME']   = r'C:\Program Files\Amazon Corretto\jdk1.8.0_482'
    env['PATH']        = r'C:\hadoop-3.4.2\hadoop-3.4.2\bin;C:\Program Files\Amazon Corretto\jdk1.8.0_482\bin;' + env.get('PATH', '')
    return subprocess.run(cmd, shell=True, capture_output=True, text=True, env=env)


# ─── Background worker ───────────────────────────────────────────────────────

def run_mapreduce(job_id, local_path, filename, min_support, min_confidence, total_transactions):
    jobs[job_id]['status'] = 'running'
    jobs[job_id]['start_time'] = time.time()

    try:
        hdfs_input  = f"/mba/input/{filename}"
        hdfs_output = f"/mba/output/{job_id}"

        # Step 1 – upload to HDFS
        log(job_id, f"Uploading file to HDFS: {hdfs_input}")
        r = run_cmd(f'hdfs dfs -put -f "{local_path}" {hdfs_input}')
        if r.returncode != 0:
            raise RuntimeError(f"HDFS upload failed: {r.stderr.strip()}")
        log(job_id, "✅ File uploaded to HDFS successfully")

        # Step 2 – run MapReduce
        log(job_id, f"Starting MapReduce job (support={min_support}, confidence={min_confidence})")
        log(job_id, "⏳ This usually takes 1–3 minutes, please wait...")
        cmd = (
            f'hadoop jar "{JAR_PATH}" MarketBasketDriver '
            f'{hdfs_input} {hdfs_output} {min_support} {min_confidence} {total_transactions}'
        )
        r = run_cmd(cmd)
        jobs[job_id]['elapsed'] = round(time.time() - jobs[job_id]['start_time'])

        # Log what the jar printed so we can see its parameter summary
        jar_out = (r.stdout or "").strip()
        jar_err = (r.stderr or "").strip()
        for line in jar_out.splitlines()[:8]:
            if line.strip():
                log(job_id, f"[JAR] {line.strip()}")

        if r.returncode != 0:
            raise RuntimeError(jar_err[:400] or "MapReduce job failed (no stderr)")

        log(job_id, f"✅ MapReduce completed in {jobs[job_id]['elapsed']}s")

        # Step 3 – verify output exists AND is non-empty
        ls_out = run_cmd(f"hdfs dfs -ls {hdfs_output}/pass1_frequent_items/part-r-00000")
        log(job_id, f"[HDFS] pass1 file: {ls_out.stdout.strip()}")

        # Check file size from ls output (field index 4)
        ls_parts = ls_out.stdout.strip().split()
        file_size = int(ls_parts[4]) if len(ls_parts) >= 5 else 0
        if file_size == 0:
            raise RuntimeError(
                f"MapReduce produced empty output (0 bytes). "
                f"The job ran but nothing passed the thresholds. "
                f"Try lowering min_support below {min_support} or check total_transactions={total_transactions}."
            )

        log(job_id, f"✅ Output verified ({file_size} bytes) — results ready!")
        jobs[job_id]['status'] = 'done'

    except Exception as e:
        log(job_id, f"❌ ERROR: {str(e)}")
        jobs[job_id]['status'] = 'error'
        jobs[job_id]['error']  = str(e)


# ─── Routes ─────────────────────────────────────────────────────────────────

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file'}), 400

    file = request.files['file']
    job_id   = str(uuid.uuid4())
    filename = f"{job_id}_{file.filename}"
    local_path = os.path.abspath(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    file.save(local_path)

    # ── Normalise to the format the jar expects: "T000001 item1,item2,item3" ──
    # Input CSV format:  TransactionID,"item1,item2,item3"   (quoted items)
    # Required format:   TransactionID item1,item2,item3    (space-separated, no quotes)
    import csv, io
    converted_lines = []
    with open(local_path, encoding='utf-8', errors='replace', newline='') as f:
        reader = csv.reader(f)
        rows = list(reader)

    # Detect and skip header row
    has_header = False
    if rows and rows[0]:
        first_field = rows[0][0].strip()
        try:
            int(first_field)
        except ValueError:
            has_header = True

    data_rows = rows[1:] if has_header else rows

    for row in data_rows:
        if not row:
            continue
        if len(row) == 2:
            # Standard CSV: TransactionID, "item1,item2,..."
            tid   = row[0].strip()
            items = row[1].strip()
        elif len(row) > 2:
            # CSV where items were not quoted: T000001,item1,item2,item3
            tid   = row[0].strip()
            items = ','.join(c.strip() for c in row[1:])
        else:
            continue
        converted_lines.append(f"{tid} {items}")

    # Check if already in correct format (space-separated, no header)
    if not converted_lines and data_rows:
        # File might already be in correct format "T000001 item1,item2"
        with open(local_path, encoding='utf-8', errors='replace') as f:
            converted_lines = [l.rstrip() for l in f if l.strip()]
        if has_header:
            converted_lines = converted_lines[1:]

    # Write normalised file back in-place
    with open(local_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(converted_lines) + '\n')

    total_transactions = len(converted_lines)
    print(f"[UPLOAD] has_header={has_header} total_transactions={total_transactions}")
    print(f"[UPLOAD] Sample line: {converted_lines[0] if converted_lines else 'EMPTY'}")

    return jsonify({
        'success': True,
        'job_id': job_id,
        'filename': filename,
        'total_transactions': total_transactions
    })


@app.route('/api/analyze', methods=['POST'])
def analyze():
    data               = request.json
    filename           = data['filename']
    job_id             = data['job_id']
    min_support        = int(data.get('min_support', 50))
    min_confidence     = float(data.get('min_confidence', 0.5))
    total_transactions = int(data['total_transactions'])

    local_path = os.path.abspath(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    # Initialise job state
    jobs[job_id] = {
        'status':     'queued',
        'logs':       [],
        'error':      None,
        'elapsed':    0,
        'start_time': time.time()
    }

    # Kick off background thread — returns immediately to the browser
    t = threading.Thread(
        target=run_mapreduce,
        args=(job_id, local_path, filename, min_support, min_confidence, total_transactions),
        daemon=True
    )
    t.start()

    return jsonify({'success': True, 'job_id': job_id})


@app.route('/api/job_status/<job_id>')
def job_status(job_id):
    """Polled every 3 seconds by the frontend."""
    if job_id not in jobs:
        return jsonify({'status': 'unknown'}), 404

    job = jobs[job_id]
    elapsed = round(time.time() - job.get('start_time', time.time())) if job['status'] == 'running' else job.get('elapsed', 0)

    return jsonify({
        'status':  job['status'],   # queued | running | done | error
        'logs':    job['logs'],
        'error':   job['error'],
        'elapsed': elapsed
    })


@app.route('/api/results/<job_id>')
def get_results(job_id):
    output_path = f"/mba/output/{job_id}"

    # Debug: list what's actually in the output folder
    ls = run_cmd(f'hdfs dfs -ls {output_path}')
    print(f"[DEBUG] hdfs ls {output_path}:\n{ls.stdout}\n{ls.stderr}")

    def read_hdfs_dir(hdfs_dir):
        """Read all part files from an HDFS directory, return raw lines."""
        lines = []
        # Try part-r-00000 first
        r = run_cmd(f'hdfs dfs -cat {hdfs_dir}/part-r-00000')
        print(f"[DEBUG] cat {hdfs_dir}/part-r-00000 rc={r.returncode} raw={repr(r.stdout[:200])}")
        if r.returncode == 0 and r.stdout.strip():
            lines = r.stdout.strip().splitlines()
        else:
            # Fallback: cat all part files in the dir
            r2 = run_cmd(f'hdfs dfs -cat {hdfs_dir}/part-*')
            print(f"[DEBUG] cat {hdfs_dir}/part-* rc={r2.returncode} raw={repr(r2.stdout[:200])}")
            if r2.returncode == 0 and r2.stdout.strip():
                lines = r2.stdout.strip().splitlines()
        return lines

    def split_line(line):
        """Split on tab, or fallback to multiple spaces."""
        line = line.strip()
        if '\t' in line:
            return line.split('\t', 1)
        # fallback: split on 2+ spaces
        import re
        parts = re.split(r'  +', line, maxsplit=1)
        return parts if len(parts) == 2 else []

    # Pass 1 – frequent items
    frequent_items = []
    for line in read_hdfs_dir(f'{output_path}/pass1_frequent_items'):
        parts = split_line(line)
        if len(parts) == 2:
            try:
                frequent_items.append({'item': parts[0].strip(), 'count': int(parts[1].strip())})
            except ValueError:
                pass
    print(f"[DEBUG] frequent_items parsed: {len(frequent_items)}")

    # Pass 2 – frequent pairs
    frequent_pairs = []
    for line in read_hdfs_dir(f'{output_path}/pass2_frequent_pairs'):
        parts = split_line(line)
        if len(parts) == 2:
            try:
                frequent_pairs.append({'pair': parts[0].strip(), 'count': int(parts[1].strip())})
            except ValueError:
                pass
    print(f"[DEBUG] frequent_pairs parsed: {len(frequent_pairs)}")

    # Pass 3 – association rules
    rules = []
    for line in read_hdfs_dir(f'{output_path}/pass3_association_rules'):
        parts = split_line(line)
        if len(parts) == 2:
            rule_text, metrics_str = parts[0].strip(), parts[1].strip()
            try:
                support    = float(metrics_str.split('Support:')[1].split(',')[0].strip())
                confidence = float(metrics_str.split('Confidence:')[1].split(',')[0].strip())
                lift       = float(metrics_str.split('Lift:')[1].strip())
            except Exception:
                support = confidence = lift = 0.0
            rules.append({
                'rule':       rule_text,
                'support':    support,
                'confidence': confidence,
                'lift':       lift
            })
    print(f"[DEBUG] rules parsed: {len(rules)}")

    if frequent_items or frequent_pairs or rules:
        return jsonify({
            'success': True,
            'results': {
                'frequent_items': frequent_items,
                'frequent_pairs': frequent_pairs,
                'rules':          rules
            }
        })

    return jsonify({
        'success': False,
        'error': f'Output files are empty for job {job_id}. The MapReduce job ran but produced no results — try lowering min_support.'
    }), 404


@app.route('/api/status', methods=['GET'])
def check_status():
    return jsonify({'namenode': True, 'resourcemanager': True, 'running': True})


@app.route('/api/download/<job_id>', methods=['GET'])
def download_results(job_id):
    output_path = f"/mba/output/{job_id}"
    rules_path  = f"{output_path}/pass3_association_rules/part-r-00000"
    local_temp  = f"temp_{job_id}_results.txt"
    run_cmd(f'hdfs dfs -get {rules_path} {local_temp}')
    if os.path.exists(local_temp):
        return send_file(local_temp, as_attachment=True, download_name=f'association_rules_{job_id}.txt')
    return jsonify({'success': False, 'message': 'Results not found'}), 404


if __name__ == '__main__':
    print("=" * 60)
    print("Starting Market Basket Analysis Web App")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=5000)
