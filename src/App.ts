import express, { Application, Response } from "express";
import V1Router from "./routes";
import ErrorHandler from "./middlewares/errorHandler";

const app: Application = express();

// middlewares

// router config
app.get("/", (_, res: Response) => {
  res.send("Welcome to eClass api root, documentation: ");
});

app.use("/api", V1Router);

// -------Middlewares--------
// error handling middleware
app.use(ErrorHandler);

module.exports = app;
