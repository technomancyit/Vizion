'use strict';

const fs = require('fs');

module.exports = (model, modelName) => {

    let saveDir = fs.readdirSync(`${__dirname}/save`);
    
    saveDir.forEach( (file) => {

       require(`${__dirname}/save/${file}`)(model, modelName);

    });


}

