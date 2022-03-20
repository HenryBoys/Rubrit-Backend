const mongooose = require('mongoose');

const connectDb = async () => {

    try {
        const conn = await mongooose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
           
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }

}

export default connectDb;