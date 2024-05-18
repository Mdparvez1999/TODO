const mongoose = require("mongoose");

const dbConnection = async () => {
    try {
        const connection = await mongoose.connect("mongodb://localhost:27017/TODO");
        if (connection) console.log("database connected");
    } catch (error) {
        console.log("error in database connection", error);
    }
};

module.exports = dbConnection;