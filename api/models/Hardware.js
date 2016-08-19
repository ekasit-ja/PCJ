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
            required: true,
        },

        image_th: {
            type: "string",
        },

        desc: {
            type: "text",
        },

        desc_th: {
            type: "text",
        },

        hardwareType: {
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
        if("image" in valuesToUpdate || "image_th" in valuesToUpdate) {
            this
                .findOne(valuesToUpdate.id)
                .then(function(rec) {
                    if("image" in valuesToUpdate)
                        sails.fs.unlink(
                            sails.prefixDir + rec.image,
                            function() {});

                    if("image_th" in valuesToUpdate && rec.image_th)
                        sails.fs.unlink(
                            sails.prefixDir + rec.image_th,
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
                sails.prefixDir + destroyedRecords[i].image,
                function() {});

            if(destroyedRecords[i].image_th) {
                sails.fs.unlink(
                    sails.prefixDir + destroyedRecords[i].image_th,
                    function() {});
            }
        }

        cb();
    },
};

