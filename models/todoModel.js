const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
    {
        description: {
            type: String,
        },
        status: {
            type: String
        }
    },
    {
        timeStamps: true
    }
);

const TODO = mongoose.model("TODO", todoSchema);

module.exports = TODO;