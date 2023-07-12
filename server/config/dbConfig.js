const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log('Connection to DataBase successfull');
})

connection.on('error', (err) => {
    console.log('Mongo DB Connection Error', err);
})