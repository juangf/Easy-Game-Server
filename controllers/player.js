const express    = require('express');
const router     = express.Router();
const elastics   = require('elasticsearch');
const HttpStatus = require('http-status-codes');
const security   = require('../helpers/security');

const es = elastics.Client({
    host: 'localhost:9200'
});

router.use(security.authorize);

/**
 * Get all the registered players
 */
router.get('/all', (req, res) => {
    es.search({
        index: 'game'
    })
    .then(function(response) {
        res.send(response.hits.hits);
    });
});

/**
 * Get a player
 */
router.get('/:playerId', (req, res) => {
    es.get({
        index: 'game',
        type: 'player',
        id: req.params.playerId
    })
    .then(function(response) {
        res.send(response._source);
    });
});

/**
 * Register unique device/player
 */
router.post('/register', (req, res) => {
    if (!req.body.id) {
        res
            .status(HttpStatus.BAD_REQUEST)
            .json({
                error: 'missing parameters'
            });
        return;
    }

    let ip       = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let newToken = token.generate(req.body.id);

    res.json({
        token: newToken
    });
});

module.exports = router;
