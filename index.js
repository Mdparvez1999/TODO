const express = require("express");
const todoRouter = require("./routes/todoRouter");
const dbConnection = require("./config/dataBaseConfig");
const errorController = require("./controllers/errorController");

// app instance
const app = express();

// db connection
dbConnection();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", todoRouter);

// error handler
app.use(errorController);

module.exports = app;
