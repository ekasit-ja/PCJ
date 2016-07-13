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

                return sails.controllers.auth.login(req, res);
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
};
