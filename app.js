const express    = require('express');
const helmet     = require('helmet');
const bodyParser = require('body-parser');
const app        = express();
const port       = 3000;

// Prepare the routes
app.use('/player', require('./controllers/player'));

// Security http headers
app.use(helmet());

// Setup the output
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json(req.headers);
});

app.listen(port, () => console.log(`Easy Game Server listening on port ${port}!`));
