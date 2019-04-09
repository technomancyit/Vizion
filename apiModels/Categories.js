'use strict';

const mongoose = require('mongoose'),
    uniqueValidator = require("mongoose-unique-validator"),
    crud = require('../controllers/mongoose/crud'),
    bcrypt = require('bcrypt-nodejs');

var modelName = 'Categories';

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    tickets: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Tickets'
    }],
    groups: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Groups'
    }],
    enabled: {
        type: Boolean,
        default: true
    },
    permissions: {
        type: Number,
        default : 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

require('../controllers/mongoose/middleware/mongooseAutoMiddleware')(schema, modelName);

schema.plugin(uniqueValidator);
var Model = mongoose.model(modelName, schema);

let crudObj = {
    m_create: crud.m_create(Model),
    m_read: crud.m_read(Model),
    m_update: crud.m_update(Model),
    m_delete: crud.m_delete(Model)
}

Model = Object.assign(Model, crudObj);

const options = {
    prefix: 'api',
    routes: {
        m_create: {

        },
        m_read: {

        },
        m_update: {
            permissions: 1
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