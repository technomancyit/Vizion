'use strict';

const fs = require('fs'),
    path = require('path');

var pathSet = '/';
let page = '/';
let models = {};

// let dirs = fs.readdirSync(path.join(__dirname, '../../../models/mgSync'));
async function asyncCheck() {
    // await Functions.asyncForEach(dirs, (dir, index) => {
    //     if (dir.substring(dir.length - 3) === '.js') {
    //         models[dir.slice(0, -3)] = require(path.join(__dirname, '../../../models/mgSync', dir));
    //     }
    // });
    
}
asyncCheck();

module.exports = {
    route: (req, res) => {
        res.render(page, { title: 'title' });
    },
    path: pathSet
}


require('../apiRoutes/bashBuffer');

var apiRoutes = fs.readdirSync(path.join(__dirname, '../', 'apiRoutes/'));

apiRoutes.forEach(file => {
    require(`../apiRoutes/${file}`);
});