const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Explicitly handle CORS
const corsOptions = {
    origin: 'https://scarecrow-field-e6y6g3pps-kellys-projects-9ea9f4ea.vercel.app',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type'
};

app.use(cors(corsOptions));

let characterDesign = {
    hat: null,
    expression: null,
    clothing: null
};

let characters = [];

// Save the current character design
app.post('/saveCharacter', (req, res) => {
    characterDesign = req.body;
    res.sendStatus(200);
});

// Get the current character design
app.get('/getCharacter', (req, res) => {
    res.json(characterDesign);
});

// Save a new character to the list
app.post('/saveCharacters', (req, res) => {
    characters.push(req.body);
    res.sendStatus(200);
});

// Get the list of saved characters
app.get('/getCharacters', (req, res) => {
    res.json(characters);
});

// Reset all data
app.post('/reset', (req, res) => {
    characterDesign = {
        hat: null,
        expression: null,
        clothing: null
    };
    characters = [];
    console.log('All data has been reset.');
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
