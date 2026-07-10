import java.io.IOException;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.conf.Configuration;

/**
 * Pass 1 Reducer: Sum counts and filter by minimum support
 * Input: <Item, [1,1,1,...]>
 * Output: <Item, Count> (only if Count >= minSupport)
 */
public class Pass1Reducer extends Reducer<Text, IntWritable, Text, IntWritable> {
    
    private int minSupport;
    
    @Override
    protected void setup(Context context) throws IOException, InterruptedException {
        Configuration conf = context.getConfiguration();
        minSupport = conf.getInt("min.support", 50);  // Default minimum support
    }
    
    @Override
    public void reduce(Text key, Iterable<IntWritable> values, Context context)
            throws IOException, InterruptedException {
        
        int sum = 0;
        for (IntWritable val : values) {
            sum += val.get();
        }
        
        // Only output items that meet minimum support threshold
        if (sum >= minSupport) {
            context.write(key, new IntWritable(sum));
        }
    }
}
