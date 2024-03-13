import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import session from "express-session";

const app = express();
const port = 3000;

const API_URL = "https://api.breakingbadquotes.xyz/v1/quotes";

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// Configure express-session
app.use(session({
    secret: 'Wagamama', // Choose a secret key to sign the session ID cookie
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto', maxAge: 3600000 } // Secure should be true in production if using HTTPS
}));

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(API_URL);
        const quote = response.data[0].quote;
        const author = response.data[0].author;
        // Store the author in the session
        req.session.actualAuthor = author;

        const message = req.query.message; // Get the message from query parameters, if present


            const characters = [
                { name: "Walter White", img: "images/BB_T5A-Walter_White.webp" },
                { name: "Jesse Pinkman", img: "images/BB_S5A_Jesse_Pinkman.webp" },
                { name: "Saul Goodman", img: "images/BB_T5A-Saul_Goodman.webp" },
                { name: "Skyler White", img: "images/T5_-_Skyler.webp" },
                // { name: "Tuco Salamanca", img: "URL_TO_SAUL_IMAGE" },
                // { name: "Gus Fring", img: "URL_TO_SAUL_IMAGE" },
                { name: "Hank Schrader", img: "images/T5_-_Hank.webp" },
                { name: "Mike Ehrmantraut", img: "images/MikeEnBB.webp" },
                // Add more characters as needed
            ];
        res.render('index.ejs', { quote: quote, characters: characters, message: message});
    } catch (error) {
        console.error('Error fetching quote:', error);
        res.send('An error occurred');
    }
});

app.post('/guess', (req, res) => {
    const { authorGuess } = req.body;
    const actualAuthor = req.session.actualAuthor; // Retrieve the author from the session

    let message;
    if (actualAuthor && authorGuess.toLowerCase() === actualAuthor.toLowerCase()) {
        message = "Correct! Well done.";
    } else {
        message = `Incorrect.`;
    }

    // Redirect to the main page with a result message as a query parameter
    res.redirect('/?message=' + encodeURIComponent(message));
});




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    }
);
