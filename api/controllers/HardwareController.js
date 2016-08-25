/**
 * HardwareController
 *
 * @description :: Server-side logic for managing hardwares
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    manage: function(req, res) {
        Hardware
            .find()
            .sort("position asc")
            .then(function(hardwares) {
                return res.view("hardware/manage", {
                    hardwares: hardwares,
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
                "hardwareType",
                "title",
                "title_th",
                "desc",
                "desc_th",
            ]);

            async.map(["image", "image_th"], function(file, cb) {
                return uploadFiles(req.file(file))
                    .then(function(fs) {
                        return cb(null, fs);
                    })
                    .catch(function(err) {
                        return cb(err, null);
                    });
            }, function(err, files) {
                if(err) return res.serverError(err);

                if(files[0].length > 0)
                    params.image = files[0][0].extra.uploadPath;

                if(files[1].length > 0)
                    params.image_th = files[1][0].extra.uploadPath;

                Hardware
                    .create(params)
                    .then(function(f) {
                        return res.redirect(sails.getUrlFor("HardwareController.manage"));
                    })
                    .catch(function(err) {
                        return res.serverError(err);
                    });
            });
        }
        else {
            return res.view("hardware/create", {
                follow: false,
            });
        }
    },

    update: function(req, res) {
        var hid = req.param("hid");

        if(req.method == "POST") {
            var params = readForm(req, [
                "hardwareType",
                "title",
                "title_th",
                "desc",
                "desc_th",
            ]);
            params.id = hid;

            async.map(["image", "image_th"], function(file, cb) {
                return uploadFiles(req.file(file))
                    .then(function(fs) {
                        return cb(null, fs);
                    })
                    .catch(function(err) {
                        return cb(err, null);
                    });
            }, function(err, files) {
                if(err) return res.serverError(err);

                if(files[0].length > 0)
                    params.image = files[0][0].extra.uploadPath;

                if(files[1].length > 0)
                    params.image_th = files[1][0].extra.uploadPath;

                Hardware
                    .update({id: hid}, params)
                    .then(function(fs) {
                        return res.redirect(sails.getUrlFor("HardwareController.manage"));
                    })
                    .catch(function(err) {
                        return res.serverError(err);
                    });
            });
        }
        else {
            Hardware
                .findOne({id: hid})
                .then(function(hardware) {
                    return res.view("hardware/update", {
                        hardware: hardware,
                        follow: false,
                    });
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
    },

    delete: function(req, res) {
        Hardware
            .destroy({id: req.param("hid")})
            .then(function() {
                return res.redirect(
                    sails.getUrlFor("HardwareController.manage")
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
                        Hardware
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

