/**
 * Product.js
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

        image: {
            type: "string",
            required: true,
        },

        model: {
            model: "model",
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
        if("image" in valuesToUpdate) {
            this
                .findOne(valuesToUpdate.id)
                .then(function(rec) {
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
        for(var i=0; i<destroyedRecords.length; i++)
            sails.fs.unlink(
                sails.prefixDir + destroyedRecords[i].image,
                function() {});

        cb();
    },
};

