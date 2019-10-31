/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

    // force redirect http port to https port
    var express = require("express")
    var app = express();
    // app.get('*', function(req, res) {
    //   if(req.isSocket)
    //     return res.redirect('wss://' + req.headers.host + req.url);
    //   return res.redirect('https://' + req.headers.host + req.url);
    // }).listen(80);



    sails.util = require("util");
    sails.bcrypt = require("bcryptjs");
    sails.passport = require("passport");
    sails.passportLocal = require("passport-local");
    sails.fs = require('fs');
    sails.getUploadDirFromTmp = "../../assets/images/upload";
    sails.getUploadDir = "/images/upload/";
    sails.prefixDir = "./assets";

    var adminData = {
        email: 'admin@pcjindustries.co.th',
        password: 'Admin1234',
        firstName: 'Admin',
        lastName: 'PCJ INDUSTRIES',
    };

    User
        .find({email: adminData.email})
        .then(function(users) {
            if(users.length > 0) {
                return cb();
            }
            else {
                User
                    .create(adminData)
                    .then(function(user) {
                        sails.log.warn("Default Admin has been created. Account information is as below.");
                        sails.log.warn(adminData);
                        return cb();
                    })
                    .catch(function(err) {
                        sails.log.error(err);
                        return cb();
                    });
            }
        })
        .catch(function(err) {
            sails.log.error(err);
            return cb();
        });


    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    // cb();
};
