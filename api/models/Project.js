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
            required: true,
        },

        title: {
            type: "string",
            required: true,
        },

        images: {
            collection: "projectImage",
            via: "project",
        },

        desc: {
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

    afterDestroy: function(destroyedRecords, cb) {
        for(var i=0; i<destroyedRecords.length; i++)
            ProjectImage
                .destroy({project: destroyedRecords[i].id})
                .exec(function() {});

        cb();
    },
};

