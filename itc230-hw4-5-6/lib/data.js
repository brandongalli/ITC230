let movies = [
    {movieName: "Toy Story 4", producer:"pixar", release:2019},
    {movieName: "Spider Man", producer:"Marvel", release:2002},
    {movieName: "Aladdin", producer:"Disney", release:2019},
];

const getAll = () => {
    return movies;
}

const getItem = (movieName) => {
    return movies.find((movies) => {
        return movies.movieName == movieName;
    })
}

// const deleteItem = (movieName) => {
//     const found = movies.findIndex((movies) => {
//         return movies.movieName == movieName;
//     });
//     movies.splice(found, 1);
// }

const deleteItem = (movieName) => {
    let foundIndex = movies.findIndex((movies) => {
        return movies.movieName === movieName;
    });
    if (foundIndex > -1) {
        movies.splice(foundIndex, 1);
        return {deleted: true, count: movies.length};
    } else {
        return {deleted: false, count: movies.length};
    };
}

const addItem = (newItem) => {
    if (getItem(newItem.movieName)) {
        return {added: false, count : movies.length};
    } else {
        movies.push(newItem);
        return {added: true, count: movies.length};
    };
}




module.exports = { getAll, getItem, deleteItem, addItem }