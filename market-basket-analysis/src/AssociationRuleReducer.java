import java.io.IOException;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

/**
 * Association Rule Reducer: Pass-through reducer (just for organization)
 */
public class AssociationRuleReducer extends Reducer<Text, Text, Text, Text> {
    
    @Override
    public void reduce(Text key, Iterable<Text> values, Context context)
            throws IOException, InterruptedException {
        
        // Since mapper outputs unique rules, just pass through
        for (Text val : values) {
            context.write(key, val);
        }
    }
}
