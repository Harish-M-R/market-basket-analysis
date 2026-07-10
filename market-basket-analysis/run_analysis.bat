@echo off
REM ============================================================
REM Market Basket Analysis - Execution Script for Windows
REM ============================================================

echo ================================================
echo Market Basket Analysis - Apriori Algorithm
echo ================================================
echo.

REM Configuration
set MIN_SUPPORT=50
set MIN_CONFIDENCE=0.5
set TOTAL_TRANSACTIONS=5000

echo Step 1: Starting Hadoop Services...
cd %HADOOP_HOME%\sbin
call start-dfs.cmd
call start-yarn.cmd
echo Hadoop services started!
echo.

echo Step 2: Creating HDFS directories...
hdfs dfs -mkdir -p /mba/input
hdfs dfs -mkdir -p /mba/output
echo HDFS directories created!
echo.

echo Step 3: Uploading transaction data to HDFS...
hdfs dfs -put data\transactions.txt /mba/input/
echo Data uploaded!
echo.

echo Step 4: Compiling Java classes...
cd src
javac -classpath "%HADOOP_HOME%\share\hadoop\common\*;%HADOOP_HOME%\share\hadoop\mapreduce\*;%HADOOP_HOME%\share\hadoop\common\lib\*" -d ..\output *.java
echo Compilation complete!
echo.

echo Step 5: Creating JAR file...
cd ..\output
jar -cvf marketbasket.jar *.class
echo JAR created!
echo.

echo Step 6: Running Market Basket Analysis...
echo This will run 3 MapReduce passes:
echo   Pass 1: Find frequent individual items
echo   Pass 2: Find frequent item pairs
echo   Pass 3: Generate association rules
echo.

hadoop jar marketbasket.jar MarketBasketDriver /mba/input /mba/output %MIN_SUPPORT% %MIN_CONFIDENCE% %TOTAL_TRANSACTIONS%

echo.
echo Step 7: Displaying Results...
echo.
echo === FREQUENT ITEMS (Pass 1) ===
hdfs dfs -cat /mba/output/pass1_frequent_items/part-r-00000
echo.
echo === FREQUENT PAIRS (Pass 2) ===
hdfs dfs -cat /mba/output/pass2_frequent_pairs/part-r-00000
echo.
echo === ASSOCIATION RULES (Pass 3) ===
hdfs dfs -cat /mba/output/pass3_association_rules/part-r-00000
echo.

echo ================================================
echo Market Basket Analysis Complete!
echo ================================================

pause
