import java.io.IOException;
import java.io.BufferedReader;
import java.io.FileReader;
import java.util.HashMap;
import java.util.Map;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.conf.Configuration;

/**
 * Association Rule Mapper: Generate rules from frequent 2-itemsets
 * For pair {A,B}, generate rules: A=>B and B=>A
 * Calculate confidence and lift
 */
public class AssociationRuleMapper extends Mapper<Object, Text, Text, Text> {
    
    private Map<String, Integer> itemCounts = new HashMap<>();
    private Map<String, Integer> pairCounts = new HashMap<>();
    private int totalTransactions;
    private double minConfidence;
    
    @Override
    protected void setup(Context context) throws IOException, InterruptedException {
        Configuration conf = context.getConfiguration();
        minConfidence = conf.getDouble("min.confidence", 0.5);  // Default 50%
        totalTransactions = conf.getInt("total.transactions", 5000);
        
        // Load frequent 1-itemsets
        String itemCountsPath = conf.get("item.counts.path");
        if (itemCountsPath != null) {
            BufferedReader reader = new BufferedReader(new FileReader(itemCountsPath));
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split("\\s+");
                if (parts.length >= 2) {
                    itemCounts.put(parts[0], Integer.parseInt(parts[1]));
                }
            }
            reader.close();
        }
    }
    
    @Override
    public void map(Object key, Text value, Context context)
            throws IOException, InterruptedException {
        
        String line = value.toString().trim();
        if (line.isEmpty()) {
            return;
        }
        
        // Parse: ItemPair Count
        String[] parts = line.split("\\s+");
        if (parts.length < 2) {
            return;
        }
        
        String[] items = parts[0].split(",");
        if (items.length != 2) {
            return;
        }
        
        int pairCount = Integer.parseInt(parts[1]);
        String itemA = items[0];
        String itemB = items[1];
        
        // Get individual item counts
        Integer countA = itemCounts.get(itemA);
        Integer countB = itemCounts.get(itemB);
        
        if (countA == null || countB == null) {
            return;
        }
        
        // Calculate metrics
        double supportAB = (double) pairCount / totalTransactions;
        double supportA = (double) countA / totalTransactions;
        double supportB = (double) countB / totalTransactions;
        
        // Rule: A => B
        double confidenceAB = (double) pairCount / countA;
        double liftAB = confidenceAB / supportB;
        
        if (confidenceAB >= minConfidence) {
            String rule = String.format("{%s} => {%s}", itemA, itemB);
            String metrics = String.format("Support: %.4f, Confidence: %.4f, Lift: %.4f",
                                          supportAB, confidenceAB, liftAB);
            context.write(new Text(rule), new Text(metrics));
        }
        
        // Rule: B => A
        double confidenceBA = (double) pairCount / countB;
        double liftBA = confidenceBA / supportA;
        
        if (confidenceBA >= minConfidence) {
            String rule = String.format("{%s} => {%s}", itemB, itemA);
            String metrics = String.format("Support: %.4f, Confidence: %.4f, Lift: %.4f",
                                          supportAB, confidenceBA, liftBA);
            context.write(new Text(rule), new Text(metrics));
        }
    }
}
