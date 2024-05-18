const todoRouter = require("express").Router();
const upload = require("../config/multerConfig");
const todoControllers = require("../controllers/todoController");

// add todo item
todoRouter.post("/todos", todoControllers.addToDoItem);

// get all todo items
todoRouter.get("/todos", todoControllers.getAllToDoItems);

// get single todo item
todoRouter.get("/todo/:id", todoControllers.getSingleToDoItem);

// filter todo items based on status
todoRouter.get("/todos/filter", todoControllers.getFilteredToDoItems);

// update todo item
todoRouter.put("/todo/:id", todoControllers.updateToDoItem);

// delete todo item
todoRouter.delete("/todo/:id", todoControllers.deleteToDoItem);

// upload todo items from csv file
todoRouter.post("/todo/upload", upload.single("file"), todoControllers.uploadFromCSVFile);

// dowmnload todo in csv format
todoRouter.get("/todos/download", todoControllers.downloadToDoInCSV);

module.exports = todoRouter;