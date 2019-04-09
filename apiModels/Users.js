'use strict';

const mongoose = require('mongoose'),
    uniqueValidator = require("mongoose-unique-validator"),
    crud = require('../controllers/mongoose/crud'),
    bcrypt = require('bcrypt-nodejs');

var modelName = 'Users';

var schema = new mongoose.Schema({
    account: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    groups: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Groups'
    }],
    messages: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Messages'
    }],
    status: {
        type: Number,
        default: 1
    },
    verified: String,
    biography: String,
    permissions: Number,
    profilePicture: Buffer,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    passwordHash: {
        type: String,
        required: true
    },
});

require('../controllers/mongoose/middleware/mongooseAutoMiddleware')(schema, modelName);

schema.methods.validPassword = function (password, cb) {
    if (password)

        bcrypt.compare(password, this.passwordHash, (e, data) => {
            if (!data) {
                return cb(false)
            } else {
                return cb(true)
            }
        });
};

schema.virtual("password").set(function (value) {
    if (value)
        this.passwordHash = bcrypt.hashSync(value, bcrypt.genSaltSync(12));
});


schema.plugin(uniqueValidator);
var Model = mongoose.model(modelName, schema);

let crudObj = {
    m_create: crud.m_create(Model),
    m_read: crud.m_read(Model),
    m_update: crud.m_update(Model),
    m_delete: crud.m_delete(Model)
}

Model = Object.assign(Model, crudObj);

//console.log(Model);

//mongoose.modelSchemas[modelName] = Model;


const options = {
    prefix: 'api',
    routes: {
        m_create: {},
        m_read: {

        },
        m_update: {

        },
        m_delete: {
            permissions: 1
        }
    }
}

module.exports = {
    [modelName]: Model,
    options
};