/**
 * TypeController
 *
 * @description :: Server-side logic for managing types
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    manage: function(req, res) {
        Type
            .find()
            .sort("position asc")
            .then(function(types) {
                return res.view("type/manage", {
                    types: types,
                    follow: false,
                });
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    create: function(req, res) {
        if(req.method == "POST") {
            var params = readForm(req, [
                "category",
                "title",
                "title_th",
            ]);

            uploadFiles(req.file("image"))
                .then(function(fs) {
                    if(fs.length < 1)
                        throw "No file has been uploaded."

                    params.image = fs[0].extra.uploadPath;
                    return Type.create(params);
                })
                .then(function(t) {
                    return res.redirect(sails.getUrlFor("TypeController.manage"));
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            return res.view("type/create", {
                follow: false,
            });
        }
    },

    update: function(req, res) {
        var tid = req.param("tid");

        if(req.method == "POST") {
            var params = readForm(req, [
                "category",
                "title",
                "title_th",
            ]);
            params.id = tid;

            uploadFiles(req.file("image"))
                .then(function(fs) {
                    if(fs.length > 0)
                        params.image = fs[0].extra.uploadPath;

                    return Type.update({id: tid}, params);
                })
                .then(function(t) {
                    return res.redirect(sails.getUrlFor("TypeController.manage"));
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            Type
                .findOne({id: tid})
                .then(function(t) {
                    return res.view("type/update", {
                        type: t,
                        follow: false,
                    });
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
    },

    delete: function(req, res) {
        Type
            .destroy({id: req.param("tid")})
            .then(function() {
                return res.redirect(
                    sails.getUrlFor("TypeController.manage")
                );
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    reorder: function(req, res) {
        var order = req.param("order") || [];

        var tasks = [];
        for(var i=0; i<order.length; i++) {
            if(order[i]) {
                (function(i) {
                    tasks.push(function(cb) {
                        Type
                            .update(order[i], {position: i+1})
                            .exec(cb);
                    });
                })(i);
            }
        }

        async.parallel(tasks, function(err, results) {
            if(err) return res.serverError(err);

            return res.json({
                order: order,
            });
        });
    },
};

