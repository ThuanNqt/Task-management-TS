import express, { Express, Request, Response } from "express";
import * as database from "./config/database";
import dotenv from "dotenv";
import mainV1Routes from "./api/v1/routes/index.route";
import bodyParser = require("body-parser");
import cors from "cors";
dotenv.config();
const app: Express = express();
const port: number | string = process.env.PORT || 3000;

// cors
//app.use(cors);

// parse application/json
app.use(bodyParser.json());

// Connect to database
database.connect();

// Router
mainV1Routes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
