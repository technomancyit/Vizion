'use strict';

global.log = require('./functions/messenger');
global.config = require('./config/scripts/config');
require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();



const repeat = require('repeat').default,
    CronJob = require('cron').CronJob,
    imap = require('./services/mail/imap/imap');


Promise.all(require('./config/scripts/config').doneArray).then((data) => {
    global.config.bash = data[0];
    global.config.mail = data[2];
    global.config.express = data[3];
    global.config.mongo = data[4];

    global.hostname;
    if (config.express.port) {
        global.hostname = `${config.express.hostname}:${config.express.port}`
    } else {
        global.hostname = config.express.hostname;
    }

    require('./controllers/mongoose/mongoose');
    //  global.crud = require('./controllers/crud');
    require('./services/express/server');

    require('./services/express/routes/mongooseAutomationRoutes');

    //   imap({tls:true,host:config.mail.host, user:config.mail.user, password:config.mail.pass, port:993},{folder:'autoTicket'});

    let job = new CronJob('*/10 * * * * *', function () {
        imap({
            tls: true,
            host: config.mail.host,
            user: config.mail.user,
            password: config.mail.pass,
            port: 993
        }, {
            folder: 'autoTicket'
        })
    }, null, true, 'America/Denver');

    job.start();

    console.log(job._callbacks[0].toString());


});
