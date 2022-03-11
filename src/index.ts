import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import aws from "./routes/aws";
import maps from "./routes/maps";
import subs from "./routes/subs";

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

const corsOptions = {
  origin: ["http://localhost:3000", "https://localhost:3000"],
};

//middlewares
app.use(express.json());
app.use(cors(corsOptions));

// Entrypoint
app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/aws", aws);
app.use("/maps", maps);
app.use("/subs", subs);

// Start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
