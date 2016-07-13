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
                cb(err);

            values.password = hash;
            cb();
        });
    },
    beforeUpdate: function(values, cb) {
        // Password must be updated by function changePassword()
        delete values.password;
        cb();
    },
    passwordHash: function(password, cb) {
        sails.bcrypt.genSalt(10, function(err, salt) {
            sails.bcrypt.hash(password, salt, function(err, hash) {
                if(err) {
                    sails.log.error(err);
                    cb(err, null);
                }

                cb(null, hash);
            });
        });
    },
    passwordChange: function(oldPassword, newPassword, cb) {
        this.passwordHash(oldPassword, function(err, hash) {
            if(err)
                cb(err)
            else if(this.password !== hash)
                cb("Old Password is incorrect")

            this.save(function(err) {
                if(err)
                    cb(err)

                cb();
            });
        });
    },

};
