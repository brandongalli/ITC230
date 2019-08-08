var movies = require("./models/movie");

movies.countDocuments((err, result) => {
    console.log(result);
});

movies.find({}, (err, items) => {
    if (err) return next(err);
    console.log(items.length);
});