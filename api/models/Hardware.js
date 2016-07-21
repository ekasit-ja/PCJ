/**
 * Hardware.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        position: {
            type: "integer",
            required: true,
        },

        title: {
            type: "string",
            required: true,
        },

        image: {
            type: "string",
            required: true,
        },

        desc: {
            type: "text",
        },

        hardware: {
            type: "string",
            required: true,
        },
    },

    beforeUpdate: function(valuesToUpdate, cb) {
        if("image" in valuesToUpdate) {
            this.findOne(valuesToUpdate.id).exec(function(err, model) {
                if(err) return cb(err);

                sails.fs.unlink(
                    sails.prefixDir + model.image,
                    function() {});
                cb();
            });
        }
    },

    afterDestroy: function(destroyedRecords, cb) {
        for(var i=0; i<destroyedRecords.length; i++)
            sails.fs.unlink(
                sails.prefixDir + destroyedRecords[i].image,
                function() {});

        cb();
    },
};

