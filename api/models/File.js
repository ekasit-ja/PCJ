/**
 * File.js
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
        },

        url: {
            type: "string",
            required: true,
        },

        desc: {
            type: "text",
        },

        category: {
            type: "string",
            required: true,
        },

        fileType: {
            type: "string",
            required: true,
        },
    },

    beforeUpdate: function(valuesToUpdate, cb) {
        if("url" in valuesToUpdate || "image" in valuesToUpdate) {
            this.findOne(valuesToUpdate.id).exec(function(err, file) {
                if(err) return cb(err);

                if("url" in valuesToUpdate)
                    sails.fs.unlink(
                        sails.prefixDir + file.url,
                        function() {});

                if("image" in valuesToUpdate)
                    sails.fs.unlink(
                        sails.prefixDir + file.image,
                        function() {});

                return cb();
            });
        }
        else {
            return cb();
        }
    },

    afterDestroy: function(destroyedRecords, cb) {
        for(var i=0; i<destroyedRecords.length; i++)
            sails.fs.unlink(
                sails.prefixDir + destroyedRecords[i].url,
                function() {});

        cb();
    },
};

