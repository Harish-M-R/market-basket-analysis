# 🚀 COMPLETE SETUP GUIDE - Market Basket Analysis with Hadoop

## Full System Installation & Execution from Command Prompt

This guide will help you set up and run the **complete Market Basket Analysis system** with:
1. Hadoop MapReduce backend (for big data processing)
2. Web application interface (for easy interaction)

**ALL STEPS ARE COMMAND PROMPT EXECUTABLE** - No manual editing required!

---

## 📦 What You Have

You have received **2 complete projects**:

### 1. `market-basket-analysis/` - Core MapReduce Implementation
- Hadoop MapReduce jobs (Java)
- Sample transaction generator (Python)
- Batch execution scripts

### 2. `hadoop-mba-webapp/` - Web Interface
- Flask backend server
- Beautiful web UI
- Full Hadoop integration
- Real-time job monitoring

---

## 🎯 OPTION 1: Run Web Application (RECOMMENDED)

This is the easiest way - beautiful web interface + full Hadoop power!

### Prerequisites Check

Open **Command Prompt** or **VS Code Terminal** and verify:

```cmd
REM Check Python
python --version
REM Should show Python 3.7 or higher

REM Check HADOOP_HOME
echo %HADOOP_HOME%
REM Should show your Hadoop path like C:\hadoop-3.4.2\hadoop-3.4.2

REM Check Hadoop
hadoop version
REM Should show Hadoop version

REM Check Java
java -version
REM Should show Java 8 or higher
```

### Step 1: Navigate to Web App Directory

```cmd
cd path\to\hadoop-mba-webapp
```

Example:
```cmd
cd C:\Users\YourName\Downloads\hadoop-mba-webapp
```

### Step 2: Run the Automated Setup Script

```cmd
run.bat
```

**What this does:**
1. ✅ Checks Python installation
2. ✅ Verifies HADOOP_HOME is set
3. ✅ Installs Python dependencies (Flask)
4. ✅ Creates necessary directories
5. ✅ Checks for compiled JAR file
6. ✅ Starts the web server

### Step 3: Open Your Browser

The script will automatically start the server. Open:

```
http://localhost:5000
```

### Step 4: Use the Web Interface

1. **Click "▶ Start Hadoop"** button (wait ~15 seconds)
2. **Upload your data file** (or use the sample from market-basket-analysis/data/)
3. **Configure parameters** (min support, min confidence)
4. **Click "🚀 Run MapReduce Analysis"**
5. **View beautiful results** with metrics and association rules!

---

## 🎯 OPTION 2: Run MapReduce Directly (Advanced)

If you want to run the MapReduce jobs without the web interface:

### Step 1: Navigate to MapReduce Project

```cmd
cd path\to\market-basket-analysis
```

### Step 2: Generate Sample Data (if needed)

```cmd
cd data
python generate_transactions.py
cd ..
```

### Step 3: Compile Java Code (if not already done)

```cmd
cd src

javac -classpath "%HADOOP_HOME%\share\hadoop\common\*;%HADOOP_HOME%\share\hadoop\mapreduce\*;%HADOOP_HOME%\share\hadoop\common\lib\*" -d ..\output Pass1Mapper.java Pass1Reducer.java Pass2Mapper.java Pass2Reducer.java AssociationRuleMapper.java AssociationRuleReducer.java MarketBasketDriver.java

cd ..\output

jar -cvf marketbasket.jar *.class

cd ..
```

### Step 4: Run the Batch Script

```cmd
run_analysis.bat
```

**Or manually execute:**

```cmd
REM Start Hadoop
cd %HADOOP_HOME%\sbin
start-dfs.cmd
start-yarn.cmd

REM Create HDFS directories
hdfs dfs -mkdir -p /mba/input

REM Upload data
hdfs dfs -put data\transactions.txt /mba/input/

REM Run analysis
hadoop jar output\marketbasket.jar MarketBasketDriver /mba/input /mba/output 50 0.5 5000

REM View results
hdfs dfs -cat /mba/output/pass3_association_rules/part-r-00000
```

---

## 🛠️ First-Time Setup Instructions

### If HADOOP_HOME is Not Set

**Temporary (current session only):**
```cmd
set HADOOP_HOME=C:\hadoop-3.4.2\hadoop-3.4.2
```

**Permanent (Windows 10/11):**
1. Press `Win + X` → System
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System Variables", click "New"
5. Variable name: `HADOOP_HOME`
6. Variable value: `C:\hadoop-3.4.2\hadoop-3.4.2` (your actual path)
7. Click OK on all windows
8. **Restart your terminal/VS Code**

### If Python is Not Installed

1. Download from: https://www.python.org/downloads/
2. **IMPORTANT**: Check "Add Python to PATH" during installation
3. Install
4. Restart terminal/VS Code
5. Verify: `python --version`

### If Hadoop is Not Installed

You mentioned you already configured Hadoop, but if needed:
1. Download Hadoop 3.x from Apache
2. Extract to `C:\hadoop-3.4.2\hadoop-3.4.2`
3. Set HADOOP_HOME (see above)
4. Configure `core-site.xml`, `hdfs-site.xml`, etc.
5. Format namenode: `hdfs namenode -format`

---

## 🎮 Quick Start Commands (Copy-Paste Ready)

### For Web Application:

```cmd
cd hadoop-mba-webapp
run.bat
```

Then open browser to: http://localhost:5000

### For Direct MapReduce:

```cmd
cd market-basket-analysis
run_analysis.bat
```

---

## 📊 Sample Data

Both projects include sample transaction data. You can also create custom data:

**Format:**
```
T001 Bread,Milk,Butter
T002 Coffee,Cream,Sugar
T003 Bread,Eggs,Cheese
```

**Generate more:**
```cmd
cd market-basket-analysis\data
python generate_transactions.py
```

---

## 🔍 Troubleshooting

### Web App Won't Start

**Error: "Python is not installed"**
```cmd
REM Install Python 3.7+
REM Download from python.org
REM Make sure to check "Add to PATH"
```

**Error: "HADOOP_HOME is not set"**
```cmd
set HADOOP_HOME=C:\hadoop-3.4.2\hadoop-3.4.2
```

**Error: "pip not found"**
```cmd
python -m pip install --upgrade pip
```

### Hadoop Services Won't Start

**Check if already running:**
```cmd
jps
REM Look for: NameNode, DataNode, ResourceManager, NodeManager
```

**Manually start:**
```cmd
cd %HADOOP_HOME%\sbin
start-dfs.cmd
start-yarn.cmd
```

**Wait 10-15 seconds, then check again:**
```cmd
jps
```

### MapReduce Job Fails

**Check YARN is running:**
```cmd
jps
REM Must see: ResourceManager, NodeManager
```

**View YARN web UI:**
```
http://localhost:8088
```

**Check logs:**
```cmd
cd %HADOOP_HOME%\logs
dir
REM Look at recent .log files
```

### Upload Fails in Web App

**Ensure Hadoop is running:**
```cmd
jps
REM Must see NameNode and ResourceManager
```

**Check HDFS:**
```cmd
hdfs dfs -ls /
hdfs dfs -mkdir -p /mba/input
```

**Test HDFS:**
```cmd
echo test > test.txt
hdfs dfs -put test.txt /test.txt
hdfs dfs -cat /test.txt
hdfs dfs -rm /test.txt
del test.txt
```

---

## 📁 Complete Directory Structure

```
Your-Project-Folder/
├── market-basket-analysis/          # Core MapReduce project
│   ├── src/                         # Java source files
│   ├── data/                        # Sample data & generator
│   ├── output/                      # Compiled classes & JAR
│   ├── run_analysis.bat            # Automated execution script
│   ├── README.md                   # MapReduce documentation
│   └── EXECUTION_STEPS.md          # Detailed manual steps
│
└── hadoop-mba-webapp/              # Web application
    ├── app.py                      # Flask backend
    ├── templates/
    │   └── index.html             # Web interface
    ├── uploads/                   # Temp file storage
    ├── run.bat                    # Automated setup & run
    ├── requirements.txt           # Python dependencies
    └── README.md                  # Web app documentation
```

---

## ✅ Verification Checklist

Before running, ensure:

- [ ] Python 3.7+ installed (`python --version`)
- [ ] HADOOP_HOME set (`echo %HADOOP_HOME%`)
- [ ] Hadoop accessible (`hadoop version`)
- [ ] Java installed (`java -version`)
- [ ] JAR file exists at `market-basket-analysis\output\marketbasket.jar`
- [ ] You're in correct directory
- [ ] Terminal/VS Code has admin rights (if needed)

---

## 🎯 Recommended Workflow

**For Learning/Testing:**
1. Start with Web Application (easier, visual feedback)
2. Upload small dataset (100-1000 transactions)
3. Experiment with different parameters
4. Understand the algorithm output

**For Production/Big Data:**
1. Use direct MapReduce (better for automation)
2. Process large datasets (100K+ transactions)
3. Integrate with data pipelines
4. Schedule periodic runs

---

## 🚀 What to Do Next

### Immediate Next Steps:
1. Run `hadoop-mba-webapp/run.bat`
2. Open http://localhost:5000
3. Upload sample data from `market-basket-analysis/data/transactions.txt`
4. Run analysis and explore results!

### Learning Path:
1. ✅ Run the web app successfully
2. ✅ Understand the algorithm (Read README files)
3. ✅ Try different datasets and parameters
4. ✅ Run direct MapReduce jobs
5. ✅ Modify the code for custom analysis
6. ✅ Deploy on multi-node Hadoop cluster

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `hadoop-mba-webapp/README.md` | Complete web app guide |
| `market-basket-analysis/README.md` | MapReduce implementation details |
| `market-basket-analysis/EXECUTION_STEPS.md` | Step-by-step MapReduce execution |
| `Market_Basket_Analysis_Project_Report.docx` | Professional project report |
| `WEB_APP_README.md` | Standalone web app (no Hadoop) docs |

---

## 🎓 Educational Value

This complete system teaches:

1. **Big Data Processing**: Real Hadoop MapReduce
2. **Algorithm Implementation**: Apriori from scratch
3. **Full-Stack Development**: Backend + Frontend
4. **System Integration**: Python ↔ Hadoop ↔ Web
5. **Data Mining**: Association rule learning
6. **DevOps**: Deployment and monitoring

---

## 💡 Pro Tips

1. **Start Simple**: Use web app with small dataset first
2. **Check Logs**: Always look at error messages
3. **Monitor YARN**: Use http://localhost:8088 to watch jobs
4. **Adjust Parameters**: Lower support/confidence if no results
5. **Save Results**: Download results from web interface
6. **Backup Data**: Keep original transaction files

---

## 🎉 Success Criteria

You'll know everything is working when:

1. ✅ `run.bat` starts without errors
2. ✅ Browser shows the web interface
3. ✅ Hadoop status shows "Running" (green)
4. ✅ File upload succeeds
5. ✅ Analysis completes successfully
6. ✅ Results display with association rules
7. ✅ Metrics show reasonable values

---

## 📞 Need Help?

**Check in order:**
1. This SETUP_GUIDE.md
2. `hadoop-mba-webapp/README.md` (detailed troubleshooting)
3. Hadoop logs in `%HADOOP_HOME%\logs`
4. YARN web UI at http://localhost:8088
5. Terminal output for error messages

---

## 🏆 You're Ready!

**Quick Start Command:**

```cmd
cd hadoop-mba-webapp
run.bat
```

**Then open:** http://localhost:5000

**That's it!** 🎉

---

**Built for Big Data Education**  
Version: 1.0.0  
Last Updated: February 2025

---

## Command Cheat Sheet

```cmd
# Navigate to web app
cd hadoop-mba-webapp

# Run web application
run.bat

# Check Hadoop status
jps

# Start Hadoop manually
cd %HADOOP_HOME%\sbin
start-dfs.cmd
start-yarn.cmd

# Stop Hadoop
stop-yarn.cmd
stop-dfs.cmd

# HDFS commands
hdfs dfs -ls /mba
hdfs dfs -mkdir -p /mba/input
hdfs dfs -put file.txt /mba/input/
hdfs dfs -cat /mba/output/results/part-r-00000

# YARN commands
yarn application -list
yarn application -status <app_id>

# Check ports
netstat -an | findstr "5000 8088 9870"
```

**READY TO START? Run `cd hadoop-mba-webapp` then `run.bat`** 🚀
