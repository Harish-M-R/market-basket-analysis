import java.io.IOException;
import java.io.BufferedReader;
import java.io.FileReader;
import java.util.HashSet;
import java.util.Set;
import java.util.ArrayList;
import java.util.Collections;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.Configuration;

/**
 * Pass 2 Mapper: Generate candidate 2-itemsets from frequent 1-itemsets
 * Input: TransactionID Item1,Item2,Item3,...
 * Output: <Item1,Item2, 1> (sorted pairs of frequent items)
 */
public class Pass2Mapper extends Mapper<Object, Text, Text, IntWritable> {
    
    private final static IntWritable one = new IntWritable(1);
    private Text itemPair = new Text();
    private Set<String> frequentItems = new HashSet<>();
    
    @Override
    protected void setup(Context context) throws IOException, InterruptedException {
        // Load frequent 1-itemsets from Pass 1 output
        Configuration conf = context.getConfiguration();
        String frequentItemsPath = conf.get("frequent.items.path");
        
        if (frequentItemsPath != null) {
            BufferedReader reader = new BufferedReader(
                new FileReader(frequentItemsPath));
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split("\\s+");
                if (parts.length >= 1) {
                    frequentItems.add(parts[0]);
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
        
        // Parse transaction
        String[] parts = line.split("\\s+", 2);
        if (parts.length < 2) {
            return;
        }
        
        String[] items = parts[1].split(",");
        ArrayList<String> validItems = new ArrayList<>();
        
        // Filter to only frequent items
        for (String item : items) {
            String cleanItem = item.trim();
            if (frequentItems.contains(cleanItem)) {
                validItems.add(cleanItem);
            }
        }
        
        // Generate all pairs (lexicographically sorted)
        Collections.sort(validItems);
        for (int i = 0; i < validItems.size(); i++) {
            for (int j = i + 1; j < validItems.size(); j++) {
                String pair = validItems.get(i) + "," + validItems.get(j);
                itemPair.set(pair);
                context.write(itemPair, one);
            }
        }
    }
}
