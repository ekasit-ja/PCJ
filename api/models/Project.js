/**
 * Project.js
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

        images: {
            collection: "projectImage",
            via: "project",
        },

        desc: {
            type: "text",
        },

        desc_th: {
            type: "text",
        },

        region: {
            type: "string",
        },

        year: {
            type: "string",
        },

        company: {
            type: "string",
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

    afterDestroy: function(destroyedRecords, cb) {
        for(var i=0; i<destroyedRecords.length; i++)
            ProjectImage
                .destroy({project: destroyedRecords[i].id})
                .exec(function() {});

        cb();
    },
};

