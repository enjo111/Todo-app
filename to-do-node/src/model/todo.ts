import { sequelize } from "../config/database.js";
import { DataTypes, Model, Optional } from "sequelize";
import { User } from "./user.js";

export interface TodoAttributes {
  id: number;
  title: string;
  completed: boolean;
  user_id: number;
}

interface TodoCreationAttributes
  extends Optional<TodoAttributes, "id" | "completed"> {}

const Todo = sequelize.define<Model<TodoAttributes, TodoCreationAttributes>>(
  "Todo",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  }
);

// Associations
User.hasMany(Todo, { foreignKey: "user_id" });
Todo.belongsTo(User, { foreignKey: "user_id" });

export { sequelize, Todo };
