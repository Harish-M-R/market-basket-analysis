# Market Basket Analysis using Hadoop MapReduce
## Advanced Apriori Algorithm Implementation

### Project Overview

This project implements an **Advanced Market Basket Analysis** system using the **Apriori algorithm** with Hadoop MapReduce. It discovers association rules from transactional data to identify products frequently purchased together.

### Real-World Applications

- **Retail**: Product placement and shelf organization
- **E-commerce**: Product recommendations ("Customers who bought X also bought Y")
- **Marketing**: Cross-selling and promotional bundling strategies
- **Inventory Management**: Stock optimization based on purchase patterns

### Algorithm: Apriori with MapReduce

The Apriori algorithm uses a "bottom-up" approach:
1. Find frequent individual items (1-itemsets)
2. Use frequent k-itemsets to generate candidate (k+1)-itemsets
3. Continue until no more frequent itemsets found
4. Generate association rules from frequent itemsets

**Key Principle**: Any subset of a frequent itemset must also be frequent (Apriori property)

### Implementation Architecture

```
Pass 1: Find Frequent 1-Itemsets
  Input: Transactions → Map: Emit (Item, 1) → Reduce: Sum & Filter by MinSupport
  Output: Frequent individual items

Pass 2: Find Frequent 2-Itemsets  
  Input: Transactions → Map: Generate pairs from frequent items → Reduce: Sum & Filter
  Output: Frequent item pairs

Pass 3: Generate Association Rules
  Input: Frequent pairs → Map: Calculate confidence & lift → Reduce: Output rules
  Output: Association rules with metrics
```

### Project Structure

```
market-basket-analysis/
├── src/
│   ├── Pass1Mapper.java              # Count individual items
│   ├── Pass1Reducer.java             # Filter by minimum support
│   ├── Pass2Mapper.java              # Generate candidate pairs
│   ├── Pass2Reducer.java             # Filter frequent pairs
│   ├── AssociationRuleMapper.java    # Generate rules with metrics
│   ├── AssociationRuleReducer.java   # Output final rules
│   └── MarketBasketDriver.java       # Main driver (orchestrates all passes)
├── data/
│   ├── generate_transactions.py      # Dataset generator
│   ├── transactions.txt              # Sample transaction data
│   └── transactions.csv              # CSV format (for analysis)
├── output/                           # Compiled classes and JAR
├── run_analysis.bat                  # Windows execution script
├── EXECUTION_STEPS.md                # Detailed manual instructions
└── README.md                         # This file
```

### Key Features

✅ **Multi-pass MapReduce** implementation of Apriori algorithm
✅ **Configurable parameters**: minimum support and confidence thresholds
✅ **Comprehensive metrics**: Support, Confidence, and Lift for each rule
✅ **Realistic dataset generator** with correlated item patterns
✅ **Scalable architecture** handles large transaction datasets
✅ **Detailed logging** shows progress through each pass

### Dataset Format

**Input Format (transactions.txt):**
```
T000001 Bread,Milk,Butter
T000002 Coffee,Cream,Sugar
T000003 Bread,Butter
```

Each line: `TransactionID Item1,Item2,Item3,...`

### Configuration Parameters

| Parameter | Description | Default | Recommended Range |
|-----------|-------------|---------|-------------------|
| Minimum Support | Min transactions containing itemset | 50 | 30-100 (depends on dataset size) |
| Minimum Confidence | Min confidence for rules (0-1) | 0.5 | 0.4-0.8 |
| Total Transactions | Total count in dataset | 5000 | Actual count |

### Output Interpretation

**Example Association Rule:**
```
{Bread} => {Butter}    Support: 0.0280, Confidence: 0.7234, Lift: 1.4567
```

**Interpretation:**
- **Support (2.8%)**: 2.8% of all transactions contain both Bread and Butter
- **Confidence (72.34%)**: When customers buy Bread, 72.34% also buy Butter
- **Lift (1.46)**: Customers are 1.46x more likely to buy Butter when buying Bread

**Lift Interpretation:**
- Lift > 1: Positive correlation (items bought together more than chance)
- Lift = 1: No correlation (independent)
- Lift < 1: Negative correlation (items bought together less than chance)

### Technical Implementation Details

#### Pass 1: Frequent 1-Itemsets
- **Mapper**: Tokenizes transactions, emits (item, 1) for each item
- **Reducer**: Sums counts, filters items with count ≥ minSupport
- **Output**: List of frequent individual items with counts

#### Pass 2: Frequent 2-Itemsets
- **Setup**: Loads frequent items from Pass 1 into memory
- **Mapper**: Filters transaction items to only frequent ones, generates all pairs
- **Reducer**: Sums pair counts, filters pairs with count ≥ minSupport
- **Output**: List of frequent item pairs with counts

#### Pass 3: Association Rules
- **Setup**: Loads item counts (Pass 1) into memory
- **Mapper**: For each frequent pair {A,B}, generates two rules:
  - A → B with confidence and lift
  - B → A with confidence and lift
- **Reducer**: Pass-through (rules already complete from mapper)
- **Output**: Association rules with support, confidence, and lift

### Performance Considerations

**Dataset Size Impact:**
- 1K transactions: ~30 seconds
- 10K transactions: ~2 minutes
- 100K transactions: ~10 minutes
- 1M+ transactions: Consider cluster setup

**Optimization Tips:**
1. Increase minSupport to reduce candidate itemsets
2. Use combiner classes to reduce shuffle data
3. Tune Hadoop memory settings for large datasets
4. Consider distributed caching for frequent itemsets

### Extension Opportunities

1. **3-Itemsets and Beyond**: Extend to Pass 4 for triplets
2. **Negative Rules**: Find items rarely bought together
3. **Temporal Analysis**: Analyze patterns over time periods
4. **Customer Segmentation**: Cluster customers by purchase patterns
5. **Visualization**: Create network graphs of item associations

### Requirements

- Hadoop 3.x or later
- Java JDK 8 or later
- Python 3.x (for dataset generation)
- Minimum 4GB RAM (for local testing)

### Quick Start

1. Generate dataset: `python data/generate_transactions.py`
2. Run the batch script: `run_analysis.bat`
3. View results in HDFS or download locally

For detailed step-by-step instructions, see `EXECUTION_STEPS.md`

### Troubleshooting

**Common Issues:**
- **OutOfMemoryError**: Increase Hadoop heap size or reduce dataset
- **File not found**: Verify HDFS paths and uploaded data
- **No output**: Check minSupport isn't too high for dataset

### Learning Objectives

This project demonstrates:
- Multi-stage MapReduce workflows
- Inter-job communication and data passing
- Distributed caching in Hadoop
- Algorithm implementation in distributed systems
- Big Data analytics on transactional data

### References

- Agrawal, R., & Srikant, R. (1994). "Fast Algorithms for Mining Association Rules"
- Apache Hadoop Documentation: https://hadoop.apache.org/docs/
- Market Basket Analysis Theory: https://en.wikipedia.org/wiki/Affinity_analysis

### License

This project is created for educational purposes.

---
**Author**: Big Data Analytics Lab
**Date**: 2025
**Version**: 1.0
