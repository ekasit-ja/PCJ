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
                "desc",
            ]);

            uploadFiles(req.file("image"))
                .then(function(fs) {
                    if(fs.length < 1)
                        throw "No file has been uploaded."

                    params.image = fs[0].extra.uploadPath;
                    return Hardware.create(params);
                })
                .then(function(h) {
                    return res.redirect(sails.getUrlFor("HardwareController.manage"));
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            return res.view("hardware/create");
        }
    },

    update: function(req, res) {
        var hid = req.param("hid");

        if(req.method == "POST") {
            var params = readForm(req, [
                "hardwareType",
                "title",
                "desc",
            ]);
            params.id = hid;

            uploadFiles(req.file("image"))
                .then(function(fs) {
                    if(fs.length > 0)
                        params.image = fs[0].extra.uploadPath;

                    return Hardware.update({id: hid}, params);
                })
                .then(function(h) {
                    return res.redirect(
                        sails.getUrlFor("HardwareController.manage")
                    );
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            Hardware
                .findOne({id: hid})
                .then(function(hardware) {
                    return res.view("hardware/update", {
                        hardware: hardware,
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

