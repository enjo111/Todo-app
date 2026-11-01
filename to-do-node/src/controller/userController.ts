import { Request, Response } from "express";
import { User } from "../model/user.js";
import { isValidEmail } from "../util/email.js";
import { signAccessToken } from "../util/jwt.js";

interface CreateUserBody {
  name: string;
  email: string;
  password: string;
}

const createUser = async (
  req: Request<{}, {}, CreateUserBody>,
  res: Response,
) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string" || !name || !email || !password) {
      res
        .status(400)
        .json({ message: "Name, email, and password are required" });
      return;
    }

    if (name.length >= 256 || name.trim() === "") {
      res.status(400).json({
        message: "Name is required, must be less than 256 characters",
      });
      return;
    }
    if (typeof email !== "string" || !isValidEmail(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }
    if (typeof password !== "string" || password.length < 6 || password.trim() === "") {
      res.status(400).json({
        message: "Password is required, must be at least 6 characters long",
      });
      return;
    }

    // check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists" });
      return;
    }

    // creating
    const user = await User.create({ name, email, password });

    // token
    const payload = {
      id: user.dataValues.id,
      name: user.dataValues.name.toString(),
      user_id: user.dataValues.id.toString(),
      email: user.dataValues.email.toString(),
    };

    const accessToken = signAccessToken(payload);

    // return token
    res.status(201).json({ user: { id: user.dataValues.id, name: user.dataValues.name, email: user.dataValues.email }, token: accessToken });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

interface LoginRequestBody {
  email: string;
  password: string;
}

const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
) => {
  try {
    const { email, password } = req.body;
    // validation
    if (typeof email !== "string" || !isValidEmail(email)) {
      res.status(400).json({ message: "Invalid email" });
      return;
    }
    if (typeof password !== "string" || password.length < 6 || password.trim() === "") {
      res.status(400).json({
        message: "Password is required, must be at least 6 characters long",
      });
      return;
    }
    // user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // password match
    if (user.dataValues.password !== password) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // token
    const payload = {
      id: user.dataValues.id,
      name: user.dataValues.name.toString(),
      user_id: user.dataValues.id.toString(),
      email: user.dataValues.email.toString(),
    };

    const accessToken = signAccessToken(payload);

    // return token
    res.json({ user: { id: user.dataValues.id, name: user.dataValues.name, email: user.dataValues.email }, token: accessToken });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// auth / me must be auth, NO
const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Assuming the user ID is stored in req.user.id after authentication}

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // remove the password from the response
    const userWithoutPassword = {
      id: user.dataValues.id,
      name: user.dataValues.name,
      email: user.dataValues.email,
    };

    // response 
    // {
    // user: User
  //}
    
    res.json({ user: userWithoutPassword });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { createUser, login as loginUser, getMe };
