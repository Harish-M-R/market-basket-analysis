import java.io.IOException;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

/**
 * Pass 1 Mapper: Count individual item frequencies
 * Input: TransactionID Item1,Item2,Item3,...
 * Output: <Item, 1>
 */
public class Pass1Mapper extends Mapper<Object, Text, Text, IntWritable> {
    
    private final static IntWritable one = new IntWritable(1);
    private Text item = new Text();
    
    @Override
    public void map(Object key, Text value, Context context) 
            throws IOException, InterruptedException {
        
        String line = value.toString().trim();
        if (line.isEmpty()) {
            return;
        }
        
        // Parse: TransactionID Item1,Item2,Item3,...
        String[] parts = line.split("\\s+", 2);
        if (parts.length < 2) {
            return;
        }
        
        String[] items = parts[1].split(",");
        
        // Emit each item with count 1
        for (String it : items) {
            String cleanItem = it.trim();
            if (!cleanItem.isEmpty()) {
                item.set(cleanItem);
                context.write(item, one);
            }
        }
    }
}
