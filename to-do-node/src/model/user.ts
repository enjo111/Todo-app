import { sequelize } from '../config/database.js';
import { DataTypes, Model, Optional } from "sequelize";
 
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

const User = sequelize.define<Model<UserAttributes, UserCreationAttributes>>(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { notEmpty: true, isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
  }
);

export { sequelize, User, UserAttributes };