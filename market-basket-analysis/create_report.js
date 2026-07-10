const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

const doc = new Document({
  styles: {
    default: { 
      document: { 
        run: { font: "Arial", size: 24 } 
      } 
    },
    paragraphStyles: [
      { 
        id: "Heading1", 
        name: "Heading 1", 
        basedOn: "Normal", 
        next: "Normal", 
        quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 480, after: 240 }, outlineLevel: 0 } 
      },
      { 
        id: "Heading2", 
        name: "Heading 2", 
        basedOn: "Normal", 
        next: "Normal", 
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 1 } 
      },
      { 
        id: "Heading3", 
        name: "Heading 3", 
        basedOn: "Normal", 
        next: "Normal", 
        quickFormat: true,
        run: { size: 26, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } 
      },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      // Title Page
      new Paragraph({
        children: [new TextRun({ text: "Market Basket Analysis", bold: true, size: 48, color: "2E75B6" })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 2880, after: 480 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Advanced Apriori Algorithm Implementation", size: 32 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Using Hadoop MapReduce", size: 28, italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 1440 }
      }),

      // Project Info Table
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3000, 6360],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 3000, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Course", bold: true })] })]
              }),
              new TableCell({
                borders, width: { size: 6360, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Big Data Analytics Lab")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 3000, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Project Type", bold: true })] })]
              }),
              new TableCell({
                borders, width: { size: 6360, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Advanced MapReduce Implementation")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 3000, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Algorithm", bold: true })] })]
              }),
              new TableCell({
                borders, width: { size: 6360, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Apriori Algorithm (Multi-Pass)")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 3000, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Technology Stack", bold: true })] })]
              }),
              new TableCell({
                borders, width: { size: 6360, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Hadoop 3.x, Java 8+, Python 3.x")] })]
              })
            ]
          })
        ]
      }),

      new Paragraph({ text: "", spacing: { after: 960 } }),

      // 1. Project Overview
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("1. Project Overview")]
      }),
      new Paragraph({
        children: [new TextRun("This project implements an advanced Market Basket Analysis system using the Apriori algorithm with Hadoop MapReduce. Market Basket Analysis is a data mining technique used to discover associations between items in large transactional datasets, commonly applied in retail and e-commerce for product recommendations and strategic decision-making.")]
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [new TextRun("The implementation demonstrates a multi-stage MapReduce workflow where each pass builds upon the results of the previous one, showcasing advanced distributed computing concepts including inter-job communication, distributed caching, and iterative algorithms in Hadoop.")]
      }),

      new Paragraph({ text: "", spacing: { after: 480 } }),

      // 2. Problem Statement
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("2. Problem Statement")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Objective: ", bold: true }), 
                   new TextRun("Discover frequent itemsets and generate association rules from large-scale transactional data to identify patterns in customer purchasing behavior.")]
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [new TextRun({ text: "Input: ", bold: true }), 
                   new TextRun("A dataset of transactions where each transaction contains a set of items purchased together.")]
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [new TextRun({ text: "Output: ", bold: true }), 
                   new TextRun("Association rules in the form {A} → {B} with metrics including support, confidence, and lift.")]
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [new TextRun({ text: "Challenges:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("• Processing large datasets efficiently in a distributed environment")]
      }),
      new Paragraph({
        children: [new TextRun("• Implementing multi-pass algorithms with inter-job dependencies")]
      }),
      new Paragraph({
        children: [new TextRun("• Filtering candidates using minimum support and confidence thresholds")]
      }),
      new Paragraph({
        children: [new TextRun("• Calculating complex metrics (support, confidence, lift) in a distributed manner")]
      }),

      new Paragraph({ text: "", spacing: { after: 480 } }),

      // 3. Algorithm Design
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("3. Algorithm Design: Apriori with MapReduce")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("3.1 Apriori Algorithm Overview")]
      }),
      new Paragraph({
        children: [new TextRun("The Apriori algorithm is based on the principle that any subset of a frequent itemset must also be frequent. It uses a bottom-up approach:")]
      }),
      new Paragraph({
        children: [new TextRun("1. Find all frequent 1-itemsets (individual items)")]
      }),
      new Paragraph({
        children: [new TextRun("2. Use frequent k-itemsets to generate candidate (k+1)-itemsets")]
      }),
      new Paragraph({
        children: [new TextRun("3. Scan database to find support of candidates")]
      }),
      new Paragraph({
        children: [new TextRun("4. Eliminate candidates below minimum support")]
      }),
      new Paragraph({
        children: [new TextRun("5. Repeat until no more frequent itemsets are found")]
      }),
      new Paragraph({
        children: [new TextRun("6. Generate association rules from frequent itemsets")]
      }),

      new Paragraph({ text: "" }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("3.2 MapReduce Implementation")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Pass 1: Find Frequent 1-Itemsets")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Mapper:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("• Input: <TransactionID, Items>")]
      }),
      new Paragraph({
        children: [new TextRun("• Process: Tokenize items from each transaction")]
      }),
      new Paragraph({
        children: [new TextRun("• Output: <Item, 1> for each item")]
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [new TextRun({ text: "Reducer:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("• Input: <Item, [1, 1, 1, ...]>")]
      }),
      new Paragraph({
        children: [new TextRun("• Process: Sum all counts for each item")]
      }),
      new Paragraph({
        children: [new TextRun("• Filter: Keep only items with count ≥ minimum support")]
      }),
      new Paragraph({
        children: [new TextRun("• Output: <Item, Count>")]
      }),

      new Paragraph({ text: "" }),

      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Pass 2: Find Frequent 2-Itemsets")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Setup Phase:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("• Load frequent 1-itemsets from Pass 1 into distributed cache")]
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [new TextRun({ text: "Mapper:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("• Input: <TransactionID, Items>")]
      }),
      new Paragraph({
        children: [new TextRun("• Process: Filter transaction items to only frequent ones")]
      }),
      new Paragraph({
        children: [new TextRun("• Generate all pairs from filtered items (lexicographically sorted)")]
      }),
      new Paragraph({
        children: [new TextRun("• Output: <ItemPair, 1>")]
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [new TextRun({ text: "Reducer:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("• Input: <ItemPair, [1, 1, 1, ...]>")]
      }),
      new Paragraph({
        children: [new TextRun("• Process: Sum counts")]
      }),
      new Paragraph({
        children: [new TextRun("• Filter: Keep pairs with count ≥ minimum support")]
      }),
      new Paragraph({
        children: [new TextRun("• Output: <ItemPair, Count>")]
      }),

      new Paragraph({ text: "" }),

      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Pass 3: Generate Association Rules")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Setup Phase:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("• Load item counts from Pass 1 into memory")]
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [new TextRun({ text: "Mapper:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("• Input: <ItemPair, Count> from Pass 2")]
      }),
      new Paragraph({
        children: [new TextRun("• Process: For each pair {A, B}, generate two rules:")]
      }),
      new Paragraph({
        children: [new TextRun("  - Rule 1: {A} → {B}")]
      }),
      new Paragraph({
        children: [new TextRun("  - Rule 2: {B} → {A}")]
      }),
      new Paragraph({
        children: [new TextRun("• Calculate metrics:")]
      }),
      new Paragraph({
        children: [new TextRun("  - Support = P(A ∩ B) = count(A,B) / total_transactions")]
      }),
      new Paragraph({
        children: [new TextRun("  - Confidence(A→B) = P(B|A) = count(A,B) / count(A)")]
      }),
      new Paragraph({
        children: [new TextRun("  - Lift(A→B) = Confidence(A→B) / P(B)")]
      }),
      new Paragraph({
        children: [new TextRun("• Filter: Keep rules with confidence ≥ minimum confidence")]
      }),
      new Paragraph({
        children: [new TextRun("• Output: <Rule, Metrics>")]
      }),

      new Paragraph({ text: "", spacing: { after: 480 } }),

      // 4. Implementation Details
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("4. Implementation Details")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("4.1 Project Structure")]
      }),
      new Paragraph({
        children: [new TextRun("The project is organized into the following components:")]
      }),
      new Paragraph({ text: "" }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3500, 5860],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 3500, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Component", bold: true })] })]
              }),
              new TableCell({
                borders, width: { size: 5860, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 3500, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Pass1Mapper.java")] })]
              }),
              new TableCell({
                borders, width: { size: 5860, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Emits individual items from transactions")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 3500, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Pass1Reducer.java")] })]
              }),
              new TableCell({
                borders, width: { size: 5860, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Aggregates and filters by minimum support")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 3500, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Pass2Mapper.java")] })]
              }),
              new TableCell({
                borders, width: { size: 5860, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Generates candidate item pairs")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 3500, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Pass2Reducer.java")] })]
              }),
              new TableCell({
                borders, width: { size: 5860, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Filters frequent pairs by support")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 3500, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("AssociationRuleMapper.java")] })]
              }),
              new TableCell({
                borders, width: { size: 5860, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Generates rules with confidence & lift")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 3500, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("AssociationRuleReducer.java")] })]
              }),
              new TableCell({
                borders, width: { size: 5860, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Pass-through for final output")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 3500, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("MarketBasketDriver.java")] })]
              }),
              new TableCell({
                borders, width: { size: 5860, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Main driver orchestrating all passes")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 3500, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("generate_transactions.py")] })]
              }),
              new TableCell({
                borders, width: { size: 5860, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Dataset generator with realistic patterns")] })]
              })
            ]
          })
        ]
      }),

      new Paragraph({ text: "" }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("4.2 Configuration Parameters")]
      }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2800, 3560, 3000],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 2800, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Parameter", bold: true })] })]
              }),
              new TableCell({
                borders, width: { size: 3560, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true })] })]
              }),
              new TableCell({
                borders, width: { size: 3000, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Default Value", bold: true })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 2800, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("min.support")] })]
              }),
              new TableCell({
                borders, width: { size: 3560, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Minimum support count threshold")] })]
              }),
              new TableCell({
                borders, width: { size: 3000, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("50")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 2800, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("min.confidence")] })]
              }),
              new TableCell({
                borders, width: { size: 3560, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Minimum confidence for rules (0-1)")] })]
              }),
              new TableCell({
                borders, width: { size: 3000, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("0.5 (50%)")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 2800, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("total.transactions")] })]
              }),
              new TableCell({
                borders, width: { size: 3560, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Total transaction count in dataset")] })]
              }),
              new TableCell({
                borders, width: { size: 3000, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("5000")] })]
              })
            ]
          })
        ]
      }),

      new Paragraph({ text: "", spacing: { after: 480 } }),

      // 5. Execution Steps
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("5. Execution Steps")]
      }),

      new Paragraph({
        children: [new TextRun({ text: "Step 1: Generate Dataset", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("python data/generate_transactions.py")]
      }),
      new Paragraph({ text: "" }),

      new Paragraph({
        children: [new TextRun({ text: "Step 2: Start Hadoop Services", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("cd %HADOOP_HOME%\\sbin")]
      }),
      new Paragraph({
        children: [new TextRun("start-dfs.cmd")]
      }),
      new Paragraph({
        children: [new TextRun("start-yarn.cmd")]
      }),
      new Paragraph({ text: "" }),

      new Paragraph({
        children: [new TextRun({ text: "Step 3: Prepare HDFS", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("hdfs dfs -mkdir -p /mba/input")]
      }),
      new Paragraph({
        children: [new TextRun("hdfs dfs -put data\\transactions.txt /mba/input/")]
      }),
      new Paragraph({ text: "" }),

      new Paragraph({
        children: [new TextRun({ text: "Step 4: Compile and Package", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun('javac -classpath "%HADOOP_HOME%\\share\\hadoop\\..." -d output *.java')]
      }),
      new Paragraph({
        children: [new TextRun("jar -cvf marketbasket.jar *.class")]
      }),
      new Paragraph({ text: "" }),

      new Paragraph({
        children: [new TextRun({ text: "Step 5: Run Analysis", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("hadoop jar marketbasket.jar MarketBasketDriver /mba/input /mba/output 50 0.5 5000")]
      }),

      new Paragraph({ text: "", spacing: { after: 480 } }),

      // 6. Results and Interpretation
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("6. Results and Interpretation")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("6.1 Output Metrics Explained")]
      }),

      new Paragraph({
        children: [new TextRun({ text: "Support:", bold: true }), 
                   new TextRun(" Indicates how frequently an itemset appears in the dataset.")]
      }),
      new Paragraph({
        children: [new TextRun("Formula: Support(A,B) = count(A ∩ B) / total_transactions")]
      }),
      new Paragraph({
        children: [new TextRun("Example: Support = 0.0280 means 2.8% of transactions contain the itemset.")]
      }),
      new Paragraph({ text: "" }),

      new Paragraph({
        children: [new TextRun({ text: "Confidence:", bold: true }), 
                   new TextRun(" Measures the reliability of the rule.")]
      }),
      new Paragraph({
        children: [new TextRun("Formula: Confidence(A→B) = Support(A,B) / Support(A)")]
      }),
      new Paragraph({
        children: [new TextRun("Example: Confidence = 0.7234 means 72.34% of customers who buy A also buy B.")]
      }),
      new Paragraph({ text: "" }),

      new Paragraph({
        children: [new TextRun({ text: "Lift:", bold: true }), 
                   new TextRun(" Indicates correlation strength between items.")]
      }),
      new Paragraph({
        children: [new TextRun("Formula: Lift(A→B) = Confidence(A→B) / Support(B)")]
      }),
      new Paragraph({
        children: [new TextRun("Interpretation:")]
      }),
      new Paragraph({
        children: [new TextRun("• Lift > 1: Positive correlation (items bought together more than by chance)")]
      }),
      new Paragraph({
        children: [new TextRun("• Lift = 1: Independent (no correlation)")]
      }),
      new Paragraph({
        children: [new TextRun("• Lift < 1: Negative correlation (items rarely bought together)")]
      }),

      new Paragraph({ text: "" }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("6.2 Sample Output")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Association Rule Example:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("{Bread} => {Butter}    Support: 0.0280, Confidence: 0.7234, Lift: 1.4567")]
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [new TextRun({ text: "Business Interpretation:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("• 2.8% of all transactions include both Bread and Butter")]
      }),
      new Paragraph({
        children: [new TextRun("• When customers buy Bread, 72.34% also purchase Butter")]
      }),
      new Paragraph({
        children: [new TextRun("• Customers are 1.46 times more likely to buy Butter when buying Bread")]
      }),
      new Paragraph({
        children: [new TextRun("• Recommendation: Place Bread and Butter near each other in store")]
      }),

      new Paragraph({ text: "", spacing: { after: 480 } }),

      // 7. Business Applications
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("7. Business Applications")]
      }),

      new Paragraph({
        children: [new TextRun({ text: "1. Product Placement", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("Place frequently co-purchased items near each other to increase convenience and impulse purchases.")]
      }),
      new Paragraph({ text: "" }),

      new Paragraph({
        children: [new TextRun({ text: "2. Cross-Selling Recommendations", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun('Display "Customers who bought this also bought..." suggestions based on strong association rules.')]
      }),
      new Paragraph({ text: "" }),

      new Paragraph({
        children: [new TextRun({ text: "3. Promotional Bundling", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("Create product bundles based on high-confidence rules to increase average transaction value.")]
      }),
      new Paragraph({ text: "" }),

      new Paragraph({
        children: [new TextRun({ text: "4. Inventory Management", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("Stock associated items together and maintain optimal inventory levels based on purchase patterns.")]
      }),
      new Paragraph({ text: "" }),

      new Paragraph({
        children: [new TextRun({ text: "5. Marketing Campaigns", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("Target customers with relevant offers based on their purchase history and association patterns.")]
      }),

      new Paragraph({ text: "", spacing: { after: 480 } }),

      // 8. Conclusion
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("8. Conclusion")]
      }),

      new Paragraph({
        children: [new TextRun("This project successfully demonstrates the implementation of an advanced Market Basket Analysis system using the Apriori algorithm with Hadoop MapReduce. The multi-pass approach effectively handles large-scale transactional data while discovering meaningful association rules.")]
      }),
      new Paragraph({ text: "" }),

      new Paragraph({
        children: [new TextRun({ text: "Key Achievements:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("• Successfully implemented three-pass MapReduce workflow")]
      }),
      new Paragraph({
        children: [new TextRun("• Demonstrated inter-job communication and distributed caching")]
      }),
      new Paragraph({
        children: [new TextRun("• Generated actionable association rules with comprehensive metrics")]
      }),
      new Paragraph({
        children: [new TextRun("• Created scalable solution for large datasets")]
      }),
      new Paragraph({
        children: [new TextRun("• Developed realistic dataset generator for testing")]
      }),
      new Paragraph({ text: "" }),

      new Paragraph({
        children: [new TextRun({ text: "Learning Outcomes:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("• Advanced understanding of MapReduce programming paradigm")]
      }),
      new Paragraph({
        children: [new TextRun("• Implementation of iterative algorithms in distributed systems")]
      }),
      new Paragraph({
        children: [new TextRun("• Data mining and association rule learning concepts")]
      }),
      new Paragraph({
        children: [new TextRun("• Practical experience with Hadoop ecosystem")]
      }),
      new Paragraph({ text: "" }),

      new Paragraph({
        children: [new TextRun({ text: "Future Enhancements:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("• Extend to 3-itemsets and beyond for more complex patterns")]
      }),
      new Paragraph({
        children: [new TextRun("• Implement temporal analysis for time-based patterns")]
      }),
      new Paragraph({
        children: [new TextRun("• Add visualization capabilities for rule networks")]
      }),
      new Paragraph({
        children: [new TextRun("• Optimize performance with combiner classes")]
      }),
      new Paragraph({
        children: [new TextRun("• Integrate with real-time streaming data")]
      }),

      new Paragraph({ text: "", spacing: { after: 960 } }),

      // Appendix
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Appendix: Code Snippets")]
      }),

      new Paragraph({
        children: [new TextRun({ text: "Sample Transaction Format:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("T000001 Bread,Milk,Butter,Eggs")]
      }),
      new Paragraph({
        children: [new TextRun("T000002 Coffee,Cream,Sugar")]
      }),
      new Paragraph({
        children: [new TextRun("T000003 Bread,Butter,Jam")]
      }),
      new Paragraph({ text: "" }),

      new Paragraph({
        children: [new TextRun({ text: "Key Java Methods:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("Pass1Mapper.map() - Tokenizes and emits items")]
      }),
      new Paragraph({
        children: [new TextRun("Pass1Reducer.reduce() - Aggregates and filters")]
      }),
      new Paragraph({
        children: [new TextRun("Pass2Mapper.setup() - Loads frequent items")]
      }),
      new Paragraph({
        children: [new TextRun("Pass2Mapper.map() - Generates candidate pairs")]
      }),
      new Paragraph({
        children: [new TextRun("AssociationRuleMapper.map() - Calculates metrics")]
      }),
      new Paragraph({ text: "" }),

      new Paragraph({
        children: [new TextRun({ text: "HDFS Commands Used:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("hdfs dfs -mkdir -p /mba/input")]
      }),
      new Paragraph({
        children: [new TextRun("hdfs dfs -put transactions.txt /mba/input/")]
      }),
      new Paragraph({
        children: [new TextRun("hdfs dfs -cat /mba/output/pass3_association_rules/part-r-00000")]
      }),
      new Paragraph({
        children: [new TextRun("hdfs dfs -get /mba/output results/")]
      }),

    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/mnt/user-data/outputs/Market_Basket_Analysis_Project_Report.docx", buffer);
  console.log("Document created successfully!");
}).catch(err => {
  console.error("Error creating document:", err);
  process.exit(1);
});
