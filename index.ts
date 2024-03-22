import express, { Express, Request, Response } from "express";
import * as database from "./config/database";
import dotenv from "dotenv";
import Task from "./models/task.model";
dotenv.config();
const app: Express = express();
const port: number | string = process.env.PORT || 3000;

// Connect to database
database.connect();

app.get("/tasks", async (req: Request, res: Response) => {
  const tasks = await Task.find({ deleted: false });
  res.json(tasks);
});

app.get("/tasks/detail/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const task = await Task.findOne({ _id: id, deleted: false });
  res.json(task);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
