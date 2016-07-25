/**
 * ModelController
 *
 * @description :: Server-side logic for managing models
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    manage: function(req, res) {
        Model
            .find()
            .populate("type")
            .sort("position asc")
            .then(function(models) {
                return res.view("model/manage", {
                    models: models,
                });
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    create: function(req, res) {
        if(req.method == "POST") {
            var params = readForm(req, [
                "type",
                "title",
                "title_th",
            ]);

            uploadFiles(req.file("image"))
                .then(function(fs) {
                    if(fs.length < 1)
                        throw "No file has been uploaded."

                    params.image = fs[0].extra.uploadPath;
                    return Model.create(params);
                })
                .then(function(t) {
                    return res.redirect(sails.getUrlFor("ModelController.manage"));
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            Type
                .find()
                .then(function(types) {
                    return res.view("model/create", {
                        types: types,
                    });
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
    },

    update: function(req, res) {
        var mid = req.param("mid");

        if(req.method == "POST") {
            var params = readForm(req, [
                "type",
                "title",
                "title_th",
            ]);
            params.id = mid;

            uploadFiles(req.file("image"))
                .then(function(fs) {
                    if(fs.length > 0)
                        params.image = fs[0].extra.uploadPath;

                    return Model.update({id: mid}, params);
                })
                .then(function(t) {
                    return res.redirect(sails.getUrlFor("ModelController.manage"));
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            var ts;
            Type
                .find()
                .sort("position asc")
                .then(function(types) {
                    ts = types;
                    return Model.findOne({id: mid})
                })
                .then(function(model) {
                    return res.view("model/update", {
                        types: ts,
                        model: model,
                    });
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
    },

    delete: function(req, res) {
        Model
            .destroy({id: req.param("mid")})
            .then(function() {
                return res.redirect(
                    sails.getUrlFor("ModelController.manage")
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
                        Model
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

