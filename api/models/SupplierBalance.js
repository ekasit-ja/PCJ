/**
 * SupplierBalance.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        position: {
            type: "integer",
        },

        title_1: {
            type: "text",
        },

        title_1_th: {
            type: "text",
        },

        title_2: {
            type: "text",
        },

        title_2_th: {
            type: "text",
        },

        title_3: {
            type: "text",
        },

        title_3_th: {
            type: "text",
        },

        content: {
            type: "text",
            required: true,
        },

        content_th: {
            type: "text",
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
};

