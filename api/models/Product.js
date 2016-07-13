/**
 * Product.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        category: {
            type: "string",
            required: true,
        },

        type: {
            type: "string",
            required: true,
        },

        model: {
            type: "string",
            required: true,
        },

        title: {
            type: "string",
            required: true,
        },

        image: {
            // model: "image",
            // via: "image",
            type: "string",
            required: true,
        },
    }
};

