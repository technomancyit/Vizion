'use strict';

module.exports = (permissions) => {
    
    return async function (req, res, next) {

        

        if(permissions === 0) return next();

        if(!req) return null;

        if (req.routeAccess) return next();
        let compareArray = Functions.permissionArray(permissions);

        console.log(compareArray, JSON.parse(req.user).permissions);

        let binaryArray = Functions.permissionArray(JSON.parse(req.user).permissions);
        let found = false;

        await Functions.asyncForEach(Object.keys(compareArray), (key) => {
            if (binaryArray[key]) found = true;
        });

        if (!found) return res.sendStatus(401)

        req.routeAccess = true;

        next();
    }
}
