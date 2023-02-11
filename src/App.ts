import express, { Application, Request, Response, NextFunction } from "express";

const app: Application = express();

// middlewares

// router config
app.get("/", (_, res: Response) => {
  res.send("Welcome to eClass api root, documentation: ");
});

module.exports = app;
