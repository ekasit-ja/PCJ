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
        },

        title: {
            type: "string",
            required: true,
        },

        title_th: {
            type: "string",
        },

        image: {
            type: "string",
        },

        url: {
            type: "string",
            required: true,
        },

        url_th: {
            type: "string",
        },

        desc: {
            type: "text",
        },

        desc_th: {
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

    beforeCreate: function(values, cb) {
        this
            .find()
            .max("position")
            .then(function(recs) {
                values.position = recs[0] ? ++recs[0].position : 1;
                return cb();
            })
            .catch(function(err) {
                return cb(err);
            })
    },

    beforeUpdate: function(valuesToUpdate, cb) {
        if("url" in valuesToUpdate ||
                "url_th" in valuesToUpdate ||
                "image" in valuesToUpdate) {
            this
                .findOne(valuesToUpdate.id)
                .then(function(rec) {
                    if("url" in valuesToUpdate)
                        sails.fs.unlink(
                            sails.prefixDir + rec.url,
                            function() {});

                    if("url_th" in valuesToUpdate)
                        sails.fs.unlink(
                            sails.prefixDir + rec.url_th,
                            function() {});

                    if("image" in valuesToUpdate)
                        sails.fs.unlink(
                            sails.prefixDir + rec.image,
                            function() {});

                    return cb();
                })
                .catch(function(err) {
                    return cb(err);
                })
        }
        else {
            return cb();
        }
    },

    afterDestroy: function(destroyedRecords, cb) {
        for(var i=0; i<destroyedRecords.length; i++) {
            sails.fs.unlink(
                sails.prefixDir + destroyedRecords[i].url,
                function() {});

            sails.fs.unlink(
                sails.prefixDir + destroyedRecords[i].url_th,
                function() {});

            sails.fs.unlink(
                sails.prefixDir + destroyedRecords[i].image,
                function() {});
        }

        cb();
    },
};

