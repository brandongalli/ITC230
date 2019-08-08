const credentials = require('./credentials');
const mongoose = require('mongoose');

mongoose.connect(credentials.connectionString, {
    dbName: "movie", useNewUrlParser: true });
    
mongoose.connection.on('open', () => {
            console.log('Mongoose connected.');
        });
        
const mySchema = mongoose.Schema({
    _id: {type: Number, required: true },
    movieName: String,
    producer: String,
    release  : String
   }); 
       
module.exports = mongoose.model('Movie', mySchema);