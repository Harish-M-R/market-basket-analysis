# Market Basket Analysis - Manual Execution Steps

## Prerequisites
- Hadoop installed and configured (similar to your previous setup)
- Java JDK installed
- HADOOP_HOME environment variable set

## Step-by-Step Execution

### 1. Generate Sample Data
```bash
cd data
python generate_transactions.py
```
This creates `transactions.txt` with 5000 sample transactions.

### 2. Start Hadoop Services
```bash
cd %HADOOP_HOME%\sbin
start-dfs.cmd
start-yarn.cmd
```

### 3. Prepare HDFS
```bash
# Create directories
hdfs dfs -mkdir -p /mba/input
hdfs dfs -mkdir -p /mba/output

# Upload data
hdfs dfs -put data\transactions.txt /mba/input/

# Verify upload
hdfs dfs -ls /mba/input
```

### 4. Compile Java Code
```bash
cd src

javac -classpath "%HADOOP_HOME%\share\hadoop\common\*;%HADOOP_HOME%\share\hadoop\mapreduce\*;%HADOOP_HOME%\share\hadoop\common\lib\*" -d ..\output Pass1Mapper.java Pass1Reducer.java Pass2Mapper.java Pass2Reducer.java AssociationRuleMapper.java AssociationRuleReducer.java MarketBasketDriver.java
```

### 5. Create JAR
```bash
cd ..\output
jar -cvf marketbasket.jar *.class
```

### 6. Run MapReduce Job
```bash
hadoop jar marketbasket.jar MarketBasketDriver /mba/input /mba/output 50 0.5 5000
```

Parameters:
- `/mba/input` - Input path in HDFS
- `/mba/output` - Output base path in HDFS
- `50` - Minimum support count (item must appear in at least 50 transactions)
- `0.5` - Minimum confidence (50% - for association rules)
- `5000` - Total number of transactions

### 7. View Results

**Frequent Items (Pass 1):**
```bash
hdfs dfs -cat /mba/output/pass1_frequent_items/part-r-00000
```

**Frequent Pairs (Pass 2):**
```bash
hdfs dfs -cat /mba/output/pass2_frequent_pairs/part-r-00000
```

**Association Rules (Pass 3):**
```bash
hdfs dfs -cat /mba/output/pass3_association_rules/part-r-00000
```

### 8. Download Results (Optional)
```bash
hdfs dfs -get /mba/output/pass3_association_rules/part-r-00000 association_rules.txt
```

### 9. Clean Up for Next Run
```bash
hdfs dfs -rm -r /mba/output
```

### 10. Stop Hadoop Services
```bash
cd %HADOOP_HOME%\sbin
stop-yarn.cmd
stop-dfs.cmd
```

## Troubleshooting

### If compilation fails:
- Check HADOOP_HOME is set correctly
- Verify Java is in PATH
- Ensure all Hadoop JAR files are accessible

### If HDFS commands fail:
- Verify Hadoop services are running
- Check namenode logs: `%HADOOP_HOME%\logs`

### If MapReduce job fails:
- Check job logs in YARN web UI: http://localhost:8088
- Review application logs for specific errors

## Adjusting Parameters

### Minimum Support
- Lower value (e.g., 30) = more frequent itemsets, longer execution
- Higher value (e.g., 100) = fewer frequent itemsets, faster execution

### Minimum Confidence
- Range: 0.0 to 1.0
- 0.5 = 50% confidence
- Higher values produce stronger (but fewer) rules

## Expected Output Format

**Frequent Items:**
```
Bread    450
Milk     523
Coffee   387
```

**Frequent Pairs:**
```
Bread,Butter    125
Bread,Milk      156
Coffee,Cream    98
```

**Association Rules:**
```
{Bread} => {Butter}    Support: 0.0250, Confidence: 0.6789, Lift: 1.2345
{Butter} => {Bread}    Support: 0.0250, Confidence: 0.5432, Lift: 1.2345
```

## Understanding the Metrics

**Support**: Percentage of transactions containing the itemset
- Support({Bread, Butter}) = (# transactions with both) / (total transactions)

**Confidence**: How often rule is true
- Confidence({Bread} => {Butter}) = Support({Bread, Butter}) / Support({Bread})

**Lift**: How much more likely items occur together vs. independently
- Lift > 1: Items positively correlated
- Lift = 1: Items independent
- Lift < 1: Items negatively correlated
