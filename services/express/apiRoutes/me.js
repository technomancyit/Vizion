'use strict';

const express = require('express'),
    server = require('../server').app,
    passport = require('passport'),
    router = express.Router();
require('../middleware/passport');

var pathSet = '/me';
router.route('').get(async (req, res) => {
    let user = JSON.parse(req.user);

    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify(user));

});

server.use('/api'+pathSet, passport.authenticate(['jwt', 'cookie'], { session: false }),  server.permissions(3), server.groups(['administrators', 'moderators', 'users']), router);