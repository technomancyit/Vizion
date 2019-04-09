'use strict';

const express = require('express'),
    server = require('../server').app,
    mysqlPassword = require('mysql-password'),
    jwt = require('jsonwebtoken'),
    cookie = require('cookie'),
    mailer = require('../../../services/mail/mailer'),
    { Users } = require('../../../apiModels/Users'),
    randomstring = require("randomstring"),
    router = express.Router();

var pathSet = '/registration';

router.route(pathSet).post(async (req, res, next) => {
    let newRegistrationToken = randomstring.generate(32);
    res.setHeader('Content-Type', 'application/json');

    if (req.body.resend) {

        let cookies = {}
        let user;
        if (req.headers.cookie) cookies = cookie.parse(req.headers.cookie);

        if (cookies.jwt) {
            user = await jwt.decode(cookies.jwt, config.express.jwt);
        }

        if (user) {

            let hostname;
            if (config.express.port) {
                hostname = `${config.express.hostname}:${config.express.port}`
            } else {
                hostname = config.express.hostname;
            }

            await Users.update({where:{ _id: user._id }, body:{ verified: newRegistrationToken }});

            await mailer({ subject: "Please verify email address.", from: config.mail.user, to: user.email }, {
                name: 'emailVerification',
                replace: 
                    { server: "Super Bashbots",
                     link: `${hostname}?verify=${newRegistrationToken}&lookup=${user.email}`,
                     user: user.account }
                
            });

            res.status(200).send(JSON.stringify({
                alert: {
                    type: "success",
                    title: "Registration email",
                    text: `Email was sent successfully to ${user.user[0].email}`
                }
            }));

        } else {
            res.status(401).send({ err: 'Invalid cookie' });
        }

    } else {

        if (req.body.account === '') {
            return res.status(401).send('{"err":"noAccount"}');
        }

        if (req.body.password === '') {
            return res.status(401).send('{"err":"noPassword"}');
        }

        let userObj = req.body;
        userObj.verified = newRegistrationToken;
        userObj.permissions = 6;
        userObj.groups = ['users'];

        async function createUser() {

          
            let user = await Users.create(userObj).catch(e => { 
                return e.errors[Object.keys(e.errors)[0]];
            });
 
            let hostname;
            if (user && !user.message) {

                if (config.express.port) {
                    hostname = `${config.express.hostname}:${config.express.port}`
                } else {
                    hostname = config.express.hostname;
                }

                await mailer({ subject: "Please verify email address.", from: config.mail.user, to: user.email }, {
                    name: 'emailVerification',
                    replace:
                        { server: "Super Bashbots" ,
                         link: `${hostname}/auth/?verify=${newRegistrationToken}&lookup=${user._id}` ,
                         user: user.account }
                    
                });

                return user;
            } else {
                return user;
            }
        }

        let user = await createUser();

        if(user && !user.message) {
        let objString = { user, registration: true };

        let token = jwt.sign(objString, config.express.jwt);
        objString.token = token;
        objString = JSON.stringify(objString);
        res.status(200).send(objString);

        } else {
            res.status(404).send("error");
        }

    }

});

server.use('/auth', router);