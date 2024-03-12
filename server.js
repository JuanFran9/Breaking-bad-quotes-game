import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const API_URL = "https://api.breakingbadquotes.xyz/v1/quotes";

app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', async (req, res) => {
    try {
        const response = await axios.get(API_URL);
        console.log('API response:', response.data);
        const quote = response.data[0].quote; // Adjust according to API response
        const author = response.data[0].author; // Adjust according to API response
        console.log('Quote:', quote);
        console.log('Author:', author);
        res.render('index.ejs', { quote: quote, author: author });
    } catch (error) {
        console.error('Error fetching quote:', error);
        res.send('An error occurred');
    }
});

app.post('/guess', (req, res) => {
    const { authorGuess, actualAuthor } = req.body;
    if (authorGuess.toLowerCase() === actualAuthor.toLowerCase()) {
        res.send("Correct! Well done.");
    } else {
        res.send("Incorrect. Try again!");
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    }
);
