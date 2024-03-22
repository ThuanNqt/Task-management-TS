import Task from "../models/task.model";
import { Request, Response } from "express";
import paginationHelper from "../../../helpers/pagination";
import searchHelper from "../../../helpers/search";

export const index = async (req: Request, res: Response): Promise<void> => {
  //find
  interface Find {
    deleted: boolean;
    status?: string;
    title?: RegExp;
  }

  const find: Find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status.toString();
  }

  // sort
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey.toString()] = req.query.sortValue;
  }

  // pagination
  let initPagination = {
    currentPage: 1,
    limitItems: 2,
  };

  const countTasks = await Task.countDocuments(find);
  const objectPagination = paginationHelper(
    initPagination,
    req.query,
    countTasks
  );

  // filter by keyword
  let objectSearch = searchHelper(req.query);
  if (req.query.keyword) {
    find.title = objectSearch.regex;
  }

  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.json(tasks);
};

export const detail = async (req: Request, res: Response): Promise<void> => {
  const id: string = req.params.id;
  const task = await Task.findOne({ _id: id, deleted: false });
  res.json(task);
};
