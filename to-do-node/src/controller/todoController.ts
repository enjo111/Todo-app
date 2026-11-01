import { Request, Response } from "express";
import { Op } from "sequelize";
import { Todo } from "../model/todo.js";

// Types for request bodies
interface CreateTodoBody {
  title: string;
}

interface UpdateTodoBody {
  title?: string;
  completed?: boolean;
}

interface TodoQuery {
  page?: string;
  limit?: string;
  search?: string;
  filter?: string;
}

// CREATE
export const createTodo = async (
  req: Request<{}, {}, CreateTodoBody>,
  res: Response,
): Promise<void> => {
  try {
    // if user exists in request, filter todos by userId
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { title } = req.body;

    // validation
    if (typeof title !== "string" || !title) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    if (title.length === 0 || title.trim() === "" || title.length > 256) {
      res.status(400).json({
        error: "Title cannot be empty and must be less than 256 characters",
      });
      return;
    }

    const todo = await Todo.create({ title: title.trim(), user_id: req.user.id });

    res.status(201).json(todo);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// READ
export const getTodos = async (
  req: Request<{}, {}, {}, TodoQuery>,
  res: Response,
): Promise<void> => {
  try {
    // if user exists in request, filter todos by userId
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);
    if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100 || !Number.isSafeInteger((page - 1) * limit)) {
      res.status(400).json({ error: "Invalid pagination parameters" });
      return;
    }
    const offset = (page - 1) * limit;

    const filter = req.query.filter ?? "all";
    const search = req.query.search ?? "";
    if (typeof search !== "string" || !["all", "active", "completed"].includes(filter)) {
      res.status(400).json({ error: "Invalid task filter" });
      return;
    }
    const where = {
      user_id: req.user.id,
      ...(filter !== "all" ? { completed: filter === "completed" } : {}),
      ...(search.trim() ? { title: { [Op.substring]: search.trim() } } : {}),
    };
    // Fetch todos and total count for the authenticated user
    const { count, rows } = await Todo.findAndCountAll({
      where,
      order: [["createdAt", "DESC"], ["id", "DESC"]],
      limit: limit,
      offset: offset,
    });

    const activeCount = await Todo.count({
      where: { user_id: req.user.id, completed: false },
    });

    const total = await Todo.count({ where: { user_id: req.user.id } });
    res.json({
      filteredTotal: count,
      page: page,
      limit: limit,
      total,
      totalActive: activeCount,
      totalCompleted: total - activeCount,
      todos: rows,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
export const updateTodo = async (
  req: Request<{ id: string }, {}, UpdateTodoBody>,
  res: Response,
): Promise<void> => {
  try {
    // if user exists in request, filter todos by userId
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // check the todo is the user's todo
    const check_todo = await Todo.findByPk(req.params.id);

    if (!check_todo || check_todo.dataValues.user_id !== req.user.id) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    // validation
    if (
      req.body.title !== undefined &&
      (typeof req.body.title !== "string" || req.body.title.length === 0 ||
        req.body.title.trim() === "" ||
        req.body.title.length > 256)
    ) {
      res.status(400).json({
        error: "Title cannot be empty and must be less than 256 characters",
      });
      return;
    }
    if (
      req.body.completed !== undefined &&
      typeof req.body.completed !== "boolean"
    ) {
      res.status(400).json({ error: "Completed must be a boolean" });
      return;
    }

    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    await todo.update({
      ...(req.body.title !== undefined ? { title: req.body.title.trim() } : {}),
      ...(req.body.completed !== undefined ? { completed: req.body.completed } : {}),
    });
    res.json(todo);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE
export const deleteTodo = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    // if user exists in request, filter todos by userId
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // check the todo is the user's todo
    const todo = await Todo.findByPk(req.params.id);
    if (!todo || todo.dataValues.user_id !== req.user.id) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    await todo.destroy();

    res.json({ message: "Todo deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
