import express, { Express, Response } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import V1Router from "./routes";
import ErrorHandler from "./middlewares/errorHandler";

class App {
  private readonly _app: Express;

  get app(): Express {
    return this._app;
  }

  constructor() {
    // initiate app
    this._app = express();

    // -----configure the middlewares----

    // mount the helmet sanitizer
    this._app.use(helmet());

    // mount the json parser
    this._app.use(
      bodyParser.json({
        limit: "200kb",
      })
    );
    // mount the express url encoded
    this._app.use(
      bodyParser.urlencoded({
        extended: false,
      })
    );

    // ----mount the router class-----
    // -- api home page first
    this._app.get("/", (_, res: Response) => {
      res.send("Welcome to the eClass api home, documentation is here: ");
    });
    // -- api version handler
    this._app.use("/api", V1Router);

    // -- error handler middleware
    this._app.use(ErrorHandler);
  }
}

module.exports = new App().app;
