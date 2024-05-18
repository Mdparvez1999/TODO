const todoValidation = require("../validation/todoValidation");
const TODO = require("../models/todoModel");
const fs = require("fs");
const csvParser = require("csv-parser");
const AppError = require("../utils/appError");
const tryCatch = require("../utils/tryCatch");
const { createObjectCsvWriter } = require("csv-writer");

// Add a new todo item
const addToDoItem = tryCatch(async (req, res, next) => {
    // Validate request body
    const { error, value } = todoValidation.validate(req.body);

    // Handle validation errors
    if (error) {
        return next(error);
    }

    // Extract description and status from validated value
    const { description, status } = value;

    // Create a new todo item
    const newToDo = await TODO.create({
        description,
        status
    });

    // Handle creation failure
    if (!newToDo) {
        const err = new AppError(400, "Something went wrong, try again later");
        return next(err);
    }

    // Respond with success message and created todo item
    return res.status(201).json({
        message: "Todo added successfully",
        todo: newToDo
    });
});

// Get all todo items
const getAllToDoItems = tryCatch(async (req, res, next) => {
    // Fetch all todo items from the database
    const todoItems = await TODO.find();

    // Handle no items found
    if (!todoItems || todoItems.length === 0) {
        const err = new AppError(404, "No todo items found");
        return next(err);
    }

    // Respond with success message and todo items
    return res.status(200).json({
        message: "Successful",
        todoItems
    });
});

// Filter todo items based on status
const getFilteredToDoItems = tryCatch(async (req, res, next) => {
    // Extract status from query parameter
    const status = req.query.status;

    // Fetch todo items matching the status
    todoItems = await TODO.find({ status });

    // Handle no items found
    if (!todoItems || todoItems.length === 0) {
        const err = new AppError(404, "No todo items found");
        return next(err);
    };

    // Respond with success message and filtered todo items
    return res.status(200).json({
        message: "Successful",
        todoItems
    });
});

// Get a single todo item by ID
const getSingleToDoItem = tryCatch(async (req, res, next) => {
    // Extract todo ID from request parameters
    const todoId = req.params.id;

    // Find the todo item by ID
    const todoItem = await TODO.findById(todoId);

    // Handle item not found
    if (!todoItem) {
        const err = new AppError(404, "Todo not found");
        return next(err);
    };

    // Respond with success message and todo item
    return res.status(200).json({
        message: "Successful",
        todo: todoItem
    });
});

// Update todo item
const updateToDoItem = tryCatch(async (req, res, next) => {
    // Validate request body
    const { error, value } = todoValidation.validate(req.body);

    // Handle validation errors
    if (error) {
        return next(error);
    };

    // Extract description and status from validated value
    const { description, status } = value;

    // Extract todo ID from request parameters
    const todoId = req.params.id;

    // Find the todo item by ID
    const todoItem = await TODO.findById(todoId);

    // Handle item not found
    if (!todoItem) {
        const err = new AppError(404, "Todo not found");
        return next(err);
    };

    // Update todo item
    const updatedTodo = await TODO.findByIdAndUpdate(todoId, {
        description,
        status
    }, { new: true });

    // Respond with success message and updated todo item
    return res.status(200).json({
        message: "Successful",
        todo: updatedTodo
    });
});

// Delete todo item
const deleteToDoItem = tryCatch(async (req, res, next) => {
    // Extract todo ID from request parameters
    const todoId = req.params.id;

    // Find the todo item by ID
    const todoItem = await TODO.findById(todoId);

    // Handle item not found
    if (!todoItem) {
        const err = new AppError(404, "Todo not found");
        return next(err);
    };

    // Delete todo item
    await TODO.findByIdAndDelete(todoId);

    // Respond with success message
    return res.status(200).json({
        message: "Successful"
    });
});

// Upload from CSV file
const uploadFromCSVFile = tryCatch(async (req, res, next) => {
    // Extract CSV file path from request file
    const csvFilePath = req.file.path;

    const todos = [];

    // Create a CSV parser from the file stream
    const parser = fs.createReadStream(csvFilePath).pipe(csvParser());

    // Error event for handling CSV read errors
    parser.on("error", (error) => {
        const err = new AppError(400, "Error reading in CSV file");
        return next(err);
    });

    // Data event to handle CSV parsing
    parser.on("data", (data) => {
        // Validate each record
        if (!data.description || !data.status) {
            const err = new AppError(400, "CSV file has invalid format or missing fields");
            return next(err);
        }

        if (!['Pending', 'Completed'].includes(data.status)) {
            const err = new AppError(400, `Invalid status value: ${data.status}`);
            return next(err);
        };

        // Push valid records to todos array
        todos.push({
            description: data.description,
            status: data.status
        })
    });

    // End event for completing CSV parsing
    parser.on("end", async () => {
        // Insert valid todos into database
        await TODO.insertMany(todos);
        res.status(200).json({
            message: "Todo items uploaded successfully"
        });
    });
});

// Download todo items in CSV file 
const downloadToDoInCSV = tryCatch(async (req, res, next) => {
    // Fetch all todo items from the database
    const todoItems = await TODO.find();

    // Handle no items found
    if (!todoItems || todoItems.length === 0) {
        const err = new AppError(404, "No todo items found");
        return next(err);
    };

    const fileName = `todos_${Date.now()}.csv`

    // Create a CSV writer and write todo items to CSV file
    const csvWriter = createObjectCsvWriter({
        path: fileName,
        header: [
            { id: "description", title: "Description" },
            { id: "status", title: "Status" },
        ]
    });

    await csvWriter.writeRecords(todoItems);

    // Download the CSV file
    res.download(fileName, (err) => {
        if (err) return next(err);

        fs.unlinkSync(fileName);
    });
});

module.exports = {
    getAllToDoItems,
    getSingleToDoItem,
    getFilteredToDoItems,
    addToDoItem,
    updateToDoItem,
    deleteToDoItem,
    uploadFromCSVFile,
    downloadToDoInCSV
}

