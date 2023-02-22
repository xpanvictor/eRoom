import express, { Application, Response } from "express";
import V1Router from "./routes";

const app: Application = express();
const man = "ssss";

// middlewares

// router config
app.get("/", (_, res: Response) => {
  res.send("Welcome to eClass api root, documentation: ");
});

app.use("/api", V1Router);

module.exports = app;
