'use strict';

const mongoose = require('mongoose'),
    mailer = require('../../../../services/mail/mailer')

    module.exports = (model, compareName) => {

    return model.post('save', async doc => {

        //automation of mongoose relationships. Anytime an update happens. This makes concurrent relationship gets updated as well. 
        //example if Main mongo object as relationship of secondary object. If you add the objectID on the query. It will find objectID within sub object and add recently created/updated ID within it sub category.
        //If the other object does not have a relationship too the other object nothing will happen.
        //You can also disable this for any column name. By creating an object under the mongoose model named rDisable.
   
        Object.keys(doc._doc).forEach((schemaName) => {
            let ref = model.paths[schemaName].options.ref ?  model.paths[schemaName].options.ref : model.paths[schemaName].options.type && model.paths[schemaName].options.type[0] && model.paths[schemaName].options.type[0].ref ? model.paths[schemaName].options.type[0].ref : undefined;
       
            if (ref) {
        
                let modelName = ref;

                let schemaList = mongoose.modelSchemas[modelName].paths ? mongoose.modelSchemas[modelName].paths : mongoose.models[modelName].schema.paths;
                
                Object.keys(schemaList).forEach(async (deepSchemaName) => {

                    if(schemaList[deepSchemaName].options.type && schemaList[deepSchemaName].options.type.ref === compareName) {
                        
                        modelSchema.m_update({
                            where: {
                                _id: doc[schemaName]
                            },
                            body: {
                                [deepSchemaName]: doc._id
                            }
                        });
                    }

                    else if(schemaList[deepSchemaName].options.type[0] && schemaList[deepSchemaName].options.type[0].ref === compareName) {
                        let modelSchema = mongoose.models[modelName];
                  
                        modelSchema.m_update({
                            where: {
                                _id: doc[schemaName]
                            },
                            body: {
                                [deepSchemaName]: doc._id
                            },
                            push: true
                        });
                    }



                });
            }

        });

    });
}