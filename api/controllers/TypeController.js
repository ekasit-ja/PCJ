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
                "title"
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
            return res.view("type/create");
        }
    },

    update: function(req, res) {
        var tid = req.param("tid");

        if(req.method == "POST") {
            var params = readForm(req, [
                "category",
                "title"
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
};

