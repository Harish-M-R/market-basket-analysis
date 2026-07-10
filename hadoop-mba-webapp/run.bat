@echo off
REM ========================================================================
REM Market Basket Analysis - Hadoop Web Application Setup & Run Script
REM ========================================================================

echo.
echo ========================================================================
echo   Market Basket Analysis - Hadoop Web Application
echo ========================================================================
echo.

REM Step 1: Check Python
echo [1/6] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7+ and try again
    pause
    exit /b 1
)
python --version
echo.

REM Step 2: Check HADOOP_HOME
echo [2/6] Checking HADOOP_HOME environment variable...
if not defined HADOOP_HOME (
    echo ERROR: HADOOP_HOME is not set
    echo Please set HADOOP_HOME to your Hadoop installation directory
    echo Example: set HADOOP_HOME=C:\hadoop-3.4.2\hadoop-3.4.2
    pause
    exit /b 1
)
echo HADOOP_HOME: %HADOOP_HOME%
echo.

REM Step 3: Install Python dependencies
echo [3/6] Installing Python dependencies...
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully
echo.

REM Step 4: Create necessary directories
echo [4/6] Creating directories...
if not exist "uploads" mkdir uploads
if not exist "templates" mkdir templates
if not exist "static" mkdir static
echo Directories created
echo.

REM Step 5: Check if JAR file exists
echo [5/6] Checking for compiled JAR file...
set JAR_PATH=..\market-basket-analysis\output\marketbasket.jar
if not exist "%JAR_PATH%" (
    echo WARNING: JAR file not found at %JAR_PATH%
    echo You need to compile the Hadoop MapReduce project first
    echo.
    echo Run these commands in the market-basket-analysis directory:
    echo   1. cd src
    echo   2. javac -classpath "%%HADOOP_HOME%%\share\hadoop\common\*;..." -d ..\output *.java
    echo   3. cd ..\output
    echo   4. jar -cvf marketbasket.jar *.class
    echo.
    set /p CONTINUE="Continue anyway? (Y/N): "
    if /i not "%CONTINUE%"=="Y" exit /b 1
) else (
    echo JAR file found: %JAR_PATH%
)
echo.

REM Step 6: Start Flask server
echo [6/6] Starting Flask web server...
echo.
echo ========================================================================
echo   Web Application Starting
echo ========================================================================
echo.
echo   URL: http://localhost:5000
echo.
echo   Instructions:
echo   1. Open http://localhost:5000 in your web browser
echo   2. Click "Start Hadoop" to start Hadoop services
echo   3. Upload your transaction data file
echo   4. Configure analysis parameters
echo   5. Run the analysis and view results
echo.
echo   Press Ctrl+C to stop the server
echo.
echo ========================================================================
echo.

python app.py

REM If server stopped
echo.
echo Server stopped.
pause
