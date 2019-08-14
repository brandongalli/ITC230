const expect = require("chai").expect;
const movies = require("../lib/data.js");

describe('Movie Get method', () => {
    it('returns requested movie', () => {
        const result = movies.getItem("Test");
        expect(result).to.deep.equal({
            movieID: 4, 
            movieName: 'Test', 
            producer: 'Test', 
            release: 2019 
            });
    });

    it('fails w/ invalid movie', () => {
        const result = movies.getItem('null');
        expect(result).to.be.undefined;
    });
});

describe('Delete method', () => {
    it('removes requested movie', () => {
        const result = movies.deleteItem("Pepperjack");
        expect(result.deleted).to.be.true;
    });

    it("fails to delete movie if not present", () => {
        const result = movies.deleteItem('null');
        expect(result.deleted).to.be.false;
    });
});

describe('Add method', () => {
    it('adds requested movie', () => {
        const result = movies.addItem({ 
            movieID: 4, 
            movieName: 'Test', 
            producer: 'Test', 
            release: 2019 
            });
        expect(result.added).to.be.true;
    });

    it('fails to add if movie present', () => {
        const result = movies.addItem({ 
            movieID: 4, 
            movieName: 'Test', 
            producer: 'Test', 
            release: 2019 
            });
        expect(result.added).to.be.false;
    });
});