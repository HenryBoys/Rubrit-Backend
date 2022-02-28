import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.SERVER_PORT || 8080;

// Entrypoint
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

// Start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );