import { Sequelize } from 'sequelize';

// Initialize SQLite database (creates a local file named 'database.sqlite')
const sequelize = new Sequelize({
  dialect: 'sqlite',  storage: './database.sqlite', // File path for the database
  logging: false // Set to console.log to see raw SQL queries
});


export { sequelize };