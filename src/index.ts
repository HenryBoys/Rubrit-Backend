import express from "express";
import cors from "cors";

import aws from "./routes/aws";
import maps from "./routes/maps";
import subs from "./routes/subs";
import chat from "./routes/chat";
import envConfig from "../environment";
import userRoutes from "./routes/userRoutes";
import  connectDb from "./config/db";
import dotenv from 'dotenv';

const app = express();
const port = envConfig.port || 8080;
dotenv.config();
connectDb();

app.use(express.json());

const corsOptions = {
  origin: [envConfig.cors.origin],
};

//middlewares
app.use(express.json());
app.use(cors(corsOptions));

// Entrypointss
app.get("/", (req, res) => {
  res.send("Hello mundo!");
});

app.use("/aws", aws);
app.use("/maps", maps);
app.use("/subs", subs);

app.use("/user",userRoutes)

// Start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
