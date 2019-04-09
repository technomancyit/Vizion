'use strict';

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

let msgString = '.';

let mongooseConnect, auth;
if (config.mongoUser) {
    msgString = ` with account ${config.mongoUser}.`
    mongooseConnect = `mongodb://${config.mongo.user}:${config.mongo.pass}@${mongo.host}:27017/$${mongo.database}`;
    if (config.mongoAdmin) {
        auth = { authdb: "admin" };
    }
} else {
    mongooseConnect = `mongodb://${config.mongo.host}/${config.mongo.database}`;
}
async function awaitMongoose() {
    let connected = await mongoose.connect(mongooseConnect, { auth, useNewUrlParser: true }).catch(e => log('mongoose-error', [e.toString()]));
    if (connected) log('mongoose-connected', [config.mongo.host, msgString]);
}
awaitMongoose();

require('../../apiModels/Users');
