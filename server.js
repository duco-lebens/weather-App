/* Empty JS object to act as endpoint for all routes */
let projectData = {};

// Require Express to run server and routes
const express = require('express');

// dependencies
const bodyParser = require('body-parser');

// Start up an instance of app
const app = express();

/* Middleware*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

/* Initialize the main project folder */
app.use(express.static('site'));

// our POST route connected through addWeatherdata()
app.post('/add', addWeatherdata);

// we need to get the temperature, date and content back from the call
function addWeatherdata(req, res) {
    projectData['temp'] = req.body.temp;
    projectData['date'] = req.body.date;
    projectData['content'] = req.body.content;
    res.send(projectData);
}

// Initialize 'all' route
app.get('/all', getInfo);

// Callback function to do actual GET
function getInfo(req, res) {
    res.send(projectData);
};

// Spin up the server
const port = 8080;
const server = app.listen(port, () => {
    console.log(`server is listening on port: ${port}`); // some reassurance in the console
});