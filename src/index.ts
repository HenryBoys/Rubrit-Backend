import express from "express";
import dotenv from "dotenv";
import aws from "./routes/aws";
import maps from "./routes/maps";

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

// Entrypoint
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

app.use('/aws', aws);
app.use('/maps', maps);

// Start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );