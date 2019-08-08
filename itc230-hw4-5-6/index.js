'use strict'
const express = require("express");
const bodyParser = require("body-parser")
const app = express();
const movies = require('./models/movie');

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public')); // set location for static files
app.use(bodyParser.urlencoded({ extended: true })); // parse form submissions

const handlebars = require("express-handlebars");
app.engine(".html", handlebars({ extname: '.html', defaultLayout: false }));
app.set("view engine", ".html");
app.use('/api', require('cors')());


app.get('/', (req, res) => {
    movies.find({}, { '_id': false }, (err, items, next) => {
        if (err) return next(err);
        res.render('home', { movies: items });
    });
});

//render about page
app.get('/about', function(req,res){
    res.render('about'); 
});

// handle form submission
app.post('/detail', (req, res, next) => {
    movies.findOne({ 'movieName': req.body.movieName }, { '_id': false }, (err, item) => {
        if (err) return next(err);
        res.render('detail', { movie: item });
    })
});

app.get('/detail', (req, res, next) => {
    movies.findOne({'movieName':req.query.movieName}, {'_id':false}, (err, item) => {
        if (err) return next(err);
        res.render('detail', { movie: item });
    })
});


// delete item
app.get('/delete', (req, res) => {
    movies.deleteOne({ 'movieName': req.query.movieName }, (err, next) => {
        if (err) return next(err);
        movies.countDocuments((err, result) => {
            res.render('delete', {
                movieName: req.query.movieName,
                count: result
            });
        })
    })
});

// add item
app.post('/add', (req, res) => {
    let newMovie = {
        'movieName': req.body.movieName, 
        'producer': req.body.producer, 
        'release': req.body.release 
        };
    movies.update({ 'movieName': req.body.movieName }, newMovie, { upsert: true }, (err, result) => {
        if (err) return next(err);
        console.log(result);
        res.render('add', {
            movieName: req.body.movieName,
            producer: req.body.producer,
            release: req.body.release
        })
    })
});


// api
// get a single item
app.get('/api/detail/:movieName', (req, res, next) => {
    movies.findOne({ movieName: req.params.movieName }, { "_id": false }, (err, item) => {
        if (err) return next(err);
        res.json(item);
    })
});

// get all items
app.get('/api/detail', (req, res, next) => {
    movies.find({}, { "_id": false }, (err, items) => {
        if (err) return next(err);
        res.json(items);
    })
});

// delete an item
app.get('/api/delete/:movieName', (req, res, next) => {
    movies.deleteOne({ movieName: req.params.movieName }, (err, item) => {
        if (err) return next(err);
        res.json(item);
    })
});






// add an item
app.post('/api/added/', (req, res, next) => {
    movies.updateOne({
        'movieName': req.body.movieName,
        'producer': req.body.producer,
        'release': req.body.release}, req.body, { upsert: true }, (err, result) => {
            res.json({
                movieName: req.body.movieName,
                producer: req.body.producer,
                release: req.body.release });
    })
});


// add item
app.post('/add', (req, res) => {
    let newMovie = {
        'movieName': req.body.movieName,
        'producer': req.body.producer,
        'release': req.body.release
    };
    movies.update({ 'movieName': req.body.movieName }, newMovie, { upsert: true }, (err, result) => {
        if (err) return next(err);
        console.log(result);
        res.render('add', {
            movieName: req.body.movieName,
            producer: req.body.producer,
            release: req.body.release
        })
    })
});



// define 404 handler
app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not found');
});

app.listen(app.get('port'), () => {
    console.log('Express started at ' + __dirname);
});


