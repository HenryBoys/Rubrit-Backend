import express from "express";
import cors from "cors";

import aws from "./routes/aws";
import maps from "./routes/maps";
import subs from "./routes/subs";
import envConfig from "../environment";

const app = express();
const port = envConfig.port || 8080;

const corsOptions = {
  origin: [envConfig.cors.origin],
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
