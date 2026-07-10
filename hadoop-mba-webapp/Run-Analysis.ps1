
function Run-MarketBasketAnalysis {
    param(
        [string]$DataFile,
        [int]$MinSupport = 50,
        [double]$MinConfidence = 0.5
    )
    
    # Upload to HDFS
    $fileName = Split-Path $DataFile -Leaf
    hdfs dfs -put -f $DataFile /mba/input/$fileName
    
    # Count lines
    $lines = (Get-Content $DataFile | Measure-Object -Line).Lines - 1
    
    # Run analysis
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    hadoop jar "C:\Users\Harish\OneDrive\Desktop\Big Boys\market-basket-analysis\output\marketbasket.jar" MarketBasketDriver /mba/input/$fileName /mba/output/run_$timestamp $MinSupport $MinConfidence $lines
    
    # Show results
    hdfs dfs -cat /mba/output/run_$timestamp/pass3_association_rules/part-r-00000
}

# Usage:
# Run-MarketBasketAnalysis -DataFile "C:\path\to\transactions.csv"
# Run-MarketBasketAnalysis -DataFile "C:\path\to\transactions.csv" -MinSupport 100 -MinConfidence 0.6
