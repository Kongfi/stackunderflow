/**** External libraries ****/
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

/**** Configuration ****/
const appName = "Stackunderflow"; // Change the name of your server app!
const port = process.env.PORT || 8080; // Pick port 8080 if the PORT env variable is empty.
const app = express(); // Get the express app object.

app.use(bodyParser.json()); // Add middleware that parses JSON from the request body.
app.use(morgan('combined')); // Add middleware that logs all http requests to the console.
app.use(cors()); // Avoid CORS errors. https://en.wikipedia.org/wiki/Cross-origin_resource_sharing

/**** Database ****/
const db = require('./db.js')(mongoose);

/**** Routes ****/
// Return all recipes in data
app.get('/api/questions', async (req, res) => {
    const questions = await db.getQuestions();
    res.json(questions);
});

// Return the question in data with its id equal to ':id' in the route below.
app.get('/api/questions/:id', async (req, res) => {
    let id = req.params.id;
    const question = await db.getQuestion(id);
    res.json(question);
});

app.put('/api/questions/:id', (req, res) => {
    const id = req.body.id;
    const newAnswer = req.body.answer;
    async function addAnswer() {
        const answer = await db.addAnswer(id, newAnswer);
    }
    addAnswer();
});

app.put('/api/vote', (req, res) => {
    const answerId = req.body.answerId;
    const vote = req.body.vote;
    async function voteUpdate() {
        await db.votes(answerId, vote);
    }
    voteUpdate();
});

app.put('/api/newQuestion', (req, res) => {
    let title = req.body.title;
    let desc = req.body.desc;
    async function addQuestion() {
        await db.createQuestion(title, desc);
    }
    addQuestion();
})

// "Redirect" all get requests (except for the routes specified above) to React's entry point (index.html) to be handled by Reach router
// It's important to specify this route as the very last one to prevent overriding all of the other routes
app.get('*', (req, res) =>
    res.sendFile(path.resolve('..', 'Client', 'build', 'index.html'))
);

/**** Start ****/
const url = process.env.MONGO_URL || 'mongodb://localhost/stackunderflow_db';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(async () => {
        await app.listen(port); // Start the API
        console.log(`StackUnderflow API running on port ${port}!`);
    })
    .catch(error => console.error(error));