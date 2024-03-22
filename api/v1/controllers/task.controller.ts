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

export const changeStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: string = req.params.id;
    const status: string = req.body.status;

    await Task.updateOne({ _id: id }, { status: status });

    res.json({
      code: 200,
      message: "Status update successful!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Not found!",
    });
  }
};

export const changeMulti = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    interface ObjectChangeMulti {
      ids: string[];
      key: string;
      value?: string;
    }

    const objectChangeMulti: ObjectChangeMulti = {
      ids: req.body.ids,
      key: req.body.key,
    };

    if (req.body.value) {
      objectChangeMulti.value = req.body.value;
    }

    console.log(objectChangeMulti);
    enum Key {
      STATUS = "status",
      DELETE = "delete",
    }

    switch (objectChangeMulti.key) {
      case Key.STATUS:
        await Task.updateMany(
          { _id: { $in: objectChangeMulti.ids } },
          { status: objectChangeMulti.value }
        );
        break;

      case Key.DELETE:
        await Task.updateMany(
          { _id: { $in: objectChangeMulti.ids } },
          { deleted: true }
        );
        break;
    }

    res.json({
      code: 200,
      message: "Update successful!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Not found!",
    });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = new Task(req.body);
    const data = await task.save();
    res.json({
      code: 200,
      message: "Create successful!",
      data: data,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Create fail!",
    });
  }
};
