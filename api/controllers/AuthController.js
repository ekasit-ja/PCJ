/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    login: function(req, res) {
        sails.passport.authenticate("local", function(err, user, info) {
            if(err || !user) {
                return res.handleError(0, {
                    err: "",
                    flash: "Email or password is incorrect.",
                    url: sails.getUrlFor("UserController.login"),
                });
            }
            req.logIn(user, function(err) {
                if(err)
                    return res.handleError(0, {
                        err: err,
                        flash: err.toString(),
                        url: sails.getUrlFor("UserController.login"),
                    });

                if(req.session.next) {
                    var next = req.session.next;
                    delete req.session["next"];
                    return res.redirect(next);
                }

                return res.redirect(sails.getUrlFor("ProductController.manage"));
            });
        })(req, res);
    },

    logout: function(req, res) {
        req.logout();
        return res.redirect("/");
    },
};
