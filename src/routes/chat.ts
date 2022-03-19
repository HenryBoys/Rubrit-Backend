import express, { Request, Response } from "express";
import axios from "axios";
import env from "../../environment";
import { chats } from "../data/data";

const app = express.Router();

app.get("/", (req: Request, res: Response) => {
  res.send(chats);
});

export default app;
