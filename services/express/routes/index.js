'use strict';

const fs = require('fs'),
    path = require('path');

let page = 'index';
let models = {};

if (config.express.signUp) {
    //let dirs = fs.readdirSync(path.join(__dirname, '../../../models/mgSync'));
    // async function asyncCheck() {
    //     await Functions.asyncForEach(dirs, (dir, index) => {
    //         if (dir.substring(dir.length - 3) === '.js') {
    //             models[dir.slice(0, -3)] = require(path.join(__dirname, '../../../models/mgSync', dir));
    //         }
    //     });

    //     let users = await models.Users.read({}).catch(e => {});

    //     if(users) {
    //         page = 'index';
    //     } else {  
    //         page = 'pages/setupAdmin';
    //     }


    // }
    //asyncCheck();
}



function shuffle(arra1) {
    var ctr = arra1.length, temp, index;

// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}


var pathSet = config.express.signUp ? '/' : '/';

var elements = Object.assign({
    home: require('../../../config/elements/pages/home.json'),
    resume: require('../../../config/elements/pages/resume.json'),
    work: require('../../../config/elements/pages/work.json'),
    contact: require('../../../config/elements/pages/contact.json'),
    colors: shuffle(['primary', 'success', 'warning', 'danger'])
});

if(config.express.recaptchaSiteSecret && config.express.recaptchSiteKey && elements.contact.contactForm.recaptcha) {
    elements.contact.contactForm.recaptchaSiteSecret = config.express.recaptchaSiteSecret;
    elements.contact.contactForm.recaptchSiteKey = config.express.recaptchSiteKey;
} else {
    elements.contact.contactForm.recaptcha = false;
}

console.log('RANz', elements.colors, 'hr')



module.exports = {
    route: (req, res) => {
        res.render(page, elements);
    },
    path: pathSet,
    type: 'get'
}

// require('./mongooseAutomationRoutes');