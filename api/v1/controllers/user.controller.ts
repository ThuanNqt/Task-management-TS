import md5 from "md5";
import User from "../models/user.model";
import { generateRandomString } from "../../../helpers/generate";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const existEmail = await User.findOne({
      email: req.body.email,
      deleted: false,
    });
    console.log(existEmail);
    if (existEmail) {
      res.json({
        code: 400,
        message: "Email already exist!",
      });
    } else {
      req.body.password = md5(req.body.password);
      req.body.token = generateRandomString(30);

      const user = new User(req.body);
      await user.save();

      const token = user.token;

      res.json({
        code: 200,
        message: "Register successful!",
        token: token,
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Register fail!",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (!user) {
      res.json({
        code: 400,
        message: "Email does not exist!",
      });
      return;
    }

    if (user.password !== md5(req.body.password)) {
      res.json({
        code: 400,
        message: "Password incorrect!",
      });
      return;
    }

    const token = user.token;

    res.json({
      code: 200,
      message: "Login successful!",
      token: token,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Login fail!",
    });
  }
};

export const detail = async (req: Request, res: Response) => {
  try {
    res.json({
      code: 200,
      message: "Get info successful!",
      data: req["user"],
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Get info failed!",
    });
  }
};
