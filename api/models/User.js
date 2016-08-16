/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        email: {
            type: "email",
            required: true,
            unique: true,
        },
        password: {
            type: "string",
            required: true,
        },
        firstName: {
            type: "string",
            required: true,
        },
        middleName: {
            type: "string",
        },
        lastName: {
            type: "string",
            required: true,
        },

        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        },
        getFullName: function() {
            if(this.middleName)
                return sails.util.format("%s %s %s", this.firstName, this.middleName, this.lastName);
            else
                return sails.util.format("%s %s", this.firstName, this.lastName);
        },
    },

    beforeCreate: function(values, cb) {
        this.passwordHash(values.password, function(err, hash) {
            if(err)
                return cb(err);

            values.password = hash;
            return cb();
        });
    },
    beforeUpdate: function(values, cb) {
        var keys = Object.keys(values);

        if(keys.length != 1) {
            delete values.password;
            return cb();
        }

        return cb();
    },
    passwordHash: function(password, cb) {
        sails.bcrypt.genSalt(10, function(err, salt) {
            sails.bcrypt.hash(password, salt, function(err, hash) {
                if(err) {
                    sails.log.error(err);
                    return cb(err, null);
                }

                return cb(null, hash);
            });
        });
    },

};
