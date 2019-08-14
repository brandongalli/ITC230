'use strict'

let express = require("express");
let bodyParser = require("body-parser");
let Movie = require("./models/movie"); // use database model

let app = express();

// configure Express app
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + './public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api', require("cors")());
app.use((err, req, res, next) => {
  console.log(err);
});

// set template engine
let handlebars =  require("express-handlebars");
app.engine(".html", handlebars({extname: '.html'}));
app.set("view engine", ".html");

app.get('/', (req,res, next) => {
    Movie.find((err,movies) => {
        if (err) return next(err);
        res.render('home', {movies: JSON.stringify(movies)});    
    });
});

app.get('/about', (req,res, next) => {
        res.render('about');    
});

// api's
app.get('/api/v1/Movie/:movieName', (req, res, next) => {
    let movieName = req.params.movieName;
    Movie.findOne({movieName: movieName}, (err, result) => {
        if (err || !result) return next(err);
        res.json( result );    
    });
});

app.get('/api/v1/movies', (req,res, next) => {
    Movie.find((err,results) => {
        if (err || !results) return next(err);
        res.json(results);
    });
});

app.get('/api/v1/delete/:movieName', (req,res, next) => {
    Movie.remove({"movieName":req.params.movieName}, (err, result) => {
        if (err) return next(err);
        // return # of items deleted
        res.json({"deleted": result.result.n});
    });
});

app.post('/api/v1/add/', (req,res, next) => {
    // find & update existing item, or add new 
    if (!req.body.movieName) { // insert new document
        let movie = new Movie({movieName:req.body.movieName,producer:req.body.producer,release:req.body.release});
        movie.save((err,newMovie) => {
            if (err) return next(err);
            res.json({updated: 0, movieName: newMovie});
        });
    } else { // update existing document
        Movie.updateOne({movieName:req.body.movieName, producer: req.body.producer, release: req.body.release }, (err, result) => {
            if (err) return next(err);
            res.json({updated: result.nModified, movieName: req.body.movieName});
        });
    }
});

app.get('/api/v1/add/:movieName/:producer/:release', (req,res, next) => {
    // find & update existing item, or add new 
    let movieName = req.params.movieName;
    Movie.update({ movieName: movieName}, {movieName:movieName, producer: req.params.producer, release: req.params.release }, {upsert: true }, (err, result) => {
        if (err) return next(err);
        // nModified = 0 for new item, = 1+ for updated item 
        res.json({updated: result.nModified});
    });
});

app.use((req,res) => {
    res.type('text/plain'); 
    res.status(404);
    res.send('404 - Not found');
});

app.listen(app.get('port'), () => {
    console.log('Express started');    
});
