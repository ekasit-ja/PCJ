/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    login: function(req, res) {
        return res.view("user/login");
    },

    register: function(req, res) {
        if(req.method == "POST") {
            var params = readForm(req, [
                "email",
                "password",
                "firstName",
                "middleName",
                "lastName",
            ]);

            User.create(params).exec(function(err, user) {
                if(err)
                    return res.handleError(0, {
                        err: err,
                        flash: err.toString(),
                        url: sails.getUrlFor("UserController.register"),
                    });

                // return sails.controllers.auth.login(req, res);
                return res.redirect(sails.getUrlFor("AdminController.dashboard"));
            });
        }
        else {
            return res.view("user/register");
        }
    },

    isEmailAvailable: function(req, res) {
        var email = req.param("email");
        if(!email)
            return res.send(400);

        User.findOne({email: email}).exec(function(err, user) {
            if(err || user)
                return res.send(400);

            return res.send(200);
        });
    },

    passwordUpdate: function(req, res) {
        if(req.method == "POST") {
            var params = readForm(req, [
                "oldPassword",
                "newPassword",
            ]);
            params.id = req.session.passport.user;

            User
                .findOne({id: params.id})
                .then(function(user) {
                    sails.bcrypt.compare(params.oldPassword, user.password, function(err, match) {
                        if(err) return res.serverError(err);
                        else if(!match) {
                            return res.handleError(0, {
                                err: "old-pass-incorrect",
                                flash: "Old password is incorrect",
                                url: sails.getUrlFor("UserController.passwordUpdate"),
                            });
                        }
                        else {
                            User.passwordHash(params.newPassword, function(err, hash) {
                                if(err) return res.serverError(err);
                                else {
                                    User
                                        .update({id: params.id}, {password: hash})
                                        .then(function() {
                                            return res.redirect(sails.getUrlFor("AdminController.dashboard"));
                                        })
                                        .catch(function(err) {
                                            return res.serverError(err);
                                        });
                                }
                            });
                        }
                    });
                });
        }
        else {
            res.view("user/passwordUpdate");
        }
    },
};
