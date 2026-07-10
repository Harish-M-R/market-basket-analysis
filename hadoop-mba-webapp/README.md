# Market Basket Analysis - Hadoop Web Application

## 🌐 Complete Web Interface for Hadoop MapReduce

A production-ready web application that provides a beautiful interface to run Market Basket Analysis on your Hadoop cluster.

---

## 📋 Prerequisites

Before running the web application, ensure you have:

1. ✅ **Hadoop installed and configured** (from your previous setup)
2. ✅ **HADOOP_HOME environment variable set**
3. ✅ **Python 3.7 or higher installed**
4. ✅ **Compiled JAR file** from the Market Basket Analysis MapReduce project

---

## 🚀 Quick Start (Command Prompt Only)

### Step 1: Navigate to the Project Directory

```cmd
cd path\to\hadoop-mba-webapp
```

### Step 2: Run the Setup Script

```cmd
run.bat
```

**That's it!** The script will:
- ✅ Check Python installation
- ✅ Verify HADOOP_HOME is set
- ✅ Install Python dependencies
- ✅ Create necessary directories
- ✅ Start the Flask web server

### Step 3: Open Your Browser

Open: **http://localhost:5000**

---

## 📝 Manual Setup (If run.bat Fails)

### 1. Install Python Dependencies

```cmd
pip install -r requirements.txt
```

### 2. Set HADOOP_HOME (if not already set)

```cmd
set HADOOP_HOME=C:\hadoop-3.4.2\hadoop-3.4.2
```

Make this permanent:
- Right-click "This PC" → Properties
- Advanced system settings → Environment Variables
- Add new System Variable:
  - Variable name: `HADOOP_HOME`
  - Variable value: `C:\hadoop-3.4.2\hadoop-3.4.2` (your Hadoop path)

### 3. Create Directories

```cmd
mkdir uploads
mkdir templates
mkdir static
```

### 4. Start the Server

```cmd
python app.py
```

---

## 🎯 Using the Web Application

### Interface Overview

The web app has **4 main steps**:

1. **📤 Upload Data** - Upload your transaction file to HDFS
2. **⚙️ Configure** - Set minimum support and confidence
3. **🚀 Run Analysis** - Execute MapReduce job on Hadoop
4. **📊 View Results** - See association rules with metrics

### Step-by-Step Workflow

#### Before You Start: Start Hadoop Services

1. Click the **"▶ Start Hadoop"** button in the header
2. Wait ~15 seconds for services to initialize
3. Status badge should show **"Hadoop: Running"** in green

#### Step 1: Upload Transaction Data

1. Click the file upload area or drag & drop your file
2. Supported formats:
   ```
   T001 Bread,Milk,Butter
   T002 Coffee,Cream,Sugar
   T003 Bread,Eggs
   ```
3. File will be automatically uploaded to HDFS
4. You'll see a success message with transaction count

#### Step 2: Configure Parameters

1. Set **Minimum Support Count**: 
   - How many transactions must contain an itemset
   - Example: 50 means items must appear in ≥50 transactions
   - Lower = more rules, higher = fewer but stronger rules

2. Set **Minimum Confidence** (0.0 - 1.0):
   - How reliable a rule must be
   - Example: 0.5 = 50% confidence threshold
   - Higher = stronger rules, lower = more rules

#### Step 3: Run MapReduce Analysis

1. Click **"🚀 Run MapReduce Analysis"**
2. The system will:
   - Submit job to Hadoop cluster
   - Run 3 MapReduce passes (Items → Pairs → Rules)
   - Display progress in real-time
3. This may take 1-5 minutes depending on data size

#### Step 4: View Results

1. Results automatically appear when analysis completes
2. You'll see:
   - **4 Metric Cards**: Transactions, Frequent Items, Pairs, Rules
   - **Association Rules List**: Sorted by Lift (strongest first)
   - **Download Button**: Save results as text file

### Understanding the Results

Each association rule shows:

```
{Bread} => {Butter}
Support: 2.80%      ← How common this pattern is
Confidence: 72.34%  ← How reliable this rule is
Lift: 1.46          ← How much more likely together vs independent
```

**Lift Interpretation:**
- **Lift > 1.5**: Strong positive correlation (highly recommended)
- **Lift 1.2-1.5**: Moderate correlation (worth considering)
- **Lift < 1.2**: Weak correlation (not very meaningful)

---

## 🛠️ Troubleshooting

### Problem: "Python is not installed or not in PATH"

**Solution:**
1. Download Python from https://www.python.org/downloads/
2. **Important**: Check "Add Python to PATH" during installation
3. Restart your terminal/VS Code

### Problem: "HADOOP_HOME is not set"

**Solution:**
```cmd
set HADOOP_HOME=C:\hadoop-3.4.2\hadoop-3.4.2
```

To make permanent: Add as System Environment Variable (see Manual Setup above)

### Problem: "JAR file not found"

**Solution:** Compile the MapReduce project first:

```cmd
cd ..\market-basket-analysis\src

javac -classpath "%HADOOP_HOME%\share\hadoop\common\*;%HADOOP_HOME%\share\hadoop\mapreduce\*;%HADOOP_HOME%\share\hadoop\common\lib\*" -d ..\output *.java

cd ..\output

jar -cvf marketbasket.jar *.class
```

### Problem: "Hadoop services won't start"

**Solution:**
1. Check if services are already running: `jps`
2. If NameNode/ResourceManager shown, they're running
3. If not, manually start:
   ```cmd
   cd %HADOOP_HOME%\sbin
   start-dfs.cmd
   start-yarn.cmd
   ```

### Problem: "Upload failed" or "HDFS error"

**Solution:**
1. Ensure Hadoop services are running (green status badge)
2. Check HDFS is accessible:
   ```cmd
   hdfs dfs -ls /
   ```
3. Try manually creating directory:
   ```cmd
   hdfs dfs -mkdir -p /mba/input
   ```

### Problem: "Analysis failed" or "Job not completing"

**Solution:**
1. Check YARN is running: `jps` (look for ResourceManager)
2. View YARN web UI: http://localhost:8088
3. Check application logs for errors
4. Try with smaller dataset first

### Problem: Port 5000 already in use

**Solution:** Edit `app.py` and change the port:

```python
# Change this line at the bottom:
app.run(debug=True, host='0.0.0.0', port=5001)  # Use 5001 instead
```

Then access: http://localhost:5001

---

## 📁 Project Structure

```
hadoop-mba-webapp/
├── app.py                  # Flask backend server
├── requirements.txt        # Python dependencies
├── run.bat                 # Automated setup & run script
├── templates/
│   └── index.html         # Frontend web interface
├── uploads/               # Temporary upload storage
└── README.md              # This file
```

---

## 🔧 Configuration

### Change Hadoop Paths

Edit `app.py` if your paths are different:

```python
# Line 15-17
HADOOP_HOME = os.environ.get('HADOOP_HOME', 'C:\\hadoop-3.4.2\\hadoop-3.4.2')
HDFS_INPUT = '/mba/input'      # HDFS input directory
HDFS_OUTPUT = '/mba/output'    # HDFS output directory
JAR_PATH = '../market-basket-analysis/output/marketbasket.jar'
```

### Change Server Port

Edit `app.py`, last line:

```python
app.run(debug=True, host='0.0.0.0', port=5000)  # Change 5000 to desired port
```

### Adjust Upload Limits

Edit `app.py`, line 13:

```python
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB (change as needed)
```

---

## 🎨 Features

### Backend (Flask)
- ✅ Start/Stop Hadoop services from web interface
- ✅ Upload files directly to HDFS
- ✅ Submit and monitor MapReduce jobs
- ✅ Fetch results from HDFS
- ✅ Download results as files
- ✅ Real-time status checking

### Frontend (HTML/JavaScript)
- ✅ Modern, dark-themed UI
- ✅ Real-time status indicators
- ✅ Progress tracking
- ✅ Drag & drop file upload
- ✅ Interactive configuration
- ✅ Beautiful results visualization
- ✅ Responsive design (works on all devices)

---

## 📊 API Endpoints

The backend provides these REST API endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Serve main web page |
| `/api/status` | GET | Check Hadoop service status |
| `/api/services/start` | POST | Start Hadoop services |
| `/api/services/stop` | POST | Stop Hadoop services |
| `/api/upload` | POST | Upload file to HDFS |
| `/api/analyze` | POST | Run MapReduce job |
| `/api/results/<job_id>` | GET | Fetch analysis results |
| `/api/download/<job_id>` | GET | Download results file |

---

## 🔐 Security Notes

**For Production Deployment:**

1. **Remove debug mode**: Change `debug=True` to `debug=False` in `app.py`
2. **Add authentication**: Implement user login
3. **Use HTTPS**: Set up SSL certificates
4. **Limit file uploads**: Add file type and size validation
5. **Sanitize inputs**: Validate all user inputs
6. **Use environment variables**: Store sensitive config in .env files

---

## 🎓 Educational Value

This project demonstrates:

1. **Full-Stack Development**: Backend (Flask) + Frontend (HTML/JS)
2. **System Integration**: Python ↔ Hadoop via subprocess
3. **REST API Design**: Clean API endpoints
4. **Asynchronous Operations**: Job submission and monitoring
5. **File Handling**: Upload → HDFS → Processing → Download
6. **Real-time Updates**: Status checking and progress tracking

---

## 🚀 Next Steps

After mastering this web app:

1. **Add User Authentication**: Multi-user support with login
2. **Job Queue**: Handle multiple concurrent analyses
3. **Historical Results**: Store and view past analyses
4. **Advanced Visualizations**: Add charts and graphs
5. **Scheduled Jobs**: Run analysis automatically
6. **Email Notifications**: Alert when jobs complete
7. **Database Integration**: Store results in PostgreSQL/MongoDB

---

## 📚 Learning Resources

- **Flask Documentation**: https://flask.palletsprojects.com/
- **Hadoop Commands**: https://hadoop.apache.org/docs/current/
- **HDFS Guide**: https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsUserGuide.html
- **YARN REST API**: https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/ResourceManagerRest.html

---

## ⚡ Performance Tips

### For Large Datasets (100K+ transactions):

1. **Increase Memory**:
   ```cmd
   set HADOOP_OPTS="-Xmx4g"
   ```

2. **Adjust MapReduce Settings** in `hadoop-mapred-site.xml`:
   ```xml
   <property>
     <name>mapreduce.map.memory.mb</name>
     <value>2048</value>
   </property>
   ```

3. **Use Higher Support Threshold**: Start with support=100+

4. **Monitor YARN**: Watch http://localhost:8088 for resource usage

---

## 🆘 Getting Help

1. **Check Logs**: 
   - Flask logs in terminal
   - Hadoop logs in `%HADOOP_HOME%\logs`

2. **YARN Web UI**: http://localhost:8088
   - View running applications
   - Check job status and logs

3. **HDFS Web UI**: http://localhost:9870
   - Browse HDFS files
   - Check storage usage

---

## ✅ Checklist Before First Run

- [ ] Python 3.7+ installed and in PATH
- [ ] HADOOP_HOME environment variable set
- [ ] Hadoop installed and accessible
- [ ] JAR file compiled in `../market-basket-analysis/output/`
- [ ] Opened terminal/command prompt in `hadoop-mba-webapp` directory
- [ ] Ready to run `run.bat`

---

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ Browser opens to http://localhost:5000
2. ✅ "Start Hadoop" button successfully starts services
3. ✅ Status badge shows "Hadoop: Running" in green
4. ✅ File upload succeeds and shows transaction count
5. ✅ Analysis completes and shows results

---

**Built with ❤️ for Big Data Education**

Version: 1.0.0  
Last Updated: February 2025

---

## 🎯 Quick Command Reference

```cmd
# Start the web app
run.bat

# Or manually:
pip install -r requirements.txt
python app.py

# Check Hadoop status
jps

# Start Hadoop manually
cd %HADOOP_HOME%\sbin
start-dfs.cmd
start-yarn.cmd

# Stop Hadoop manually
stop-yarn.cmd
stop-dfs.cmd

# View HDFS files
hdfs dfs -ls /mba

# Check YARN applications
yarn application -list
```

---

**Ready? Let's go! Run `run.bat` and open http://localhost:5000** 🚀
