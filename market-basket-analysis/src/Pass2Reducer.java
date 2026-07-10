import java.io.IOException;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.conf.Configuration;

/**
 * Pass 2 Reducer: Sum counts for item pairs and filter by minimum support
 * Input: <ItemPair, [1,1,1,...]>
 * Output: <ItemPair, Count> (only if Count >= minSupport)
 */
public class Pass2Reducer extends Reducer<Text, IntWritable, Text, IntWritable> {
    
    private int minSupport;
    
    @Override
    protected void setup(Context context) throws IOException, InterruptedException {
        Configuration conf = context.getConfiguration();
        minSupport = conf.getInt("min.support", 50);
    }
    
    @Override
    public void reduce(Text key, Iterable<IntWritable> values, Context context)
            throws IOException, InterruptedException {
        
        int sum = 0;
        for (IntWritable val : values) {
            sum += val.get();
        }
        
        // Only output pairs that meet minimum support threshold
        if (sum >= minSupport) {
            context.write(key, new IntWritable(sum));
        }
    }
}
