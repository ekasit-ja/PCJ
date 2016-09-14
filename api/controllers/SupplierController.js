/**
 * SupplierController
 *
 * @description :: Server-side logic for managing suppliers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    supplierBalanceView: function(req, res) {
        SupplierBalance
            .find()
            .sort("position desc")
            .limit(1)
            .then(function(sbs) {
                dynamicInter(req, "SupplierBalance", sbs);

                return res.view("supplier/balance/view", {
                    sbs: sbs,
                    title: "seo-home-title",
                    metaKeyword: "seo-home-meta-keyword",
                    metaDesc: "seo-home-meta-desc",
                });
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    supplierBalanceViewLegacy: function(req, res) {
        if(req.query.tpid == "0031" &&
                req.query.pgname == "finance" &&
                req.query.count == "1") {
            return sails.controllers.supplier.supplierBalanceView(req, res);
        }
        else {
            return res.notFound();
        }
    },

	supplierBalanceManage: function(req, res) {
        SupplierBalance
            .find()
            .sort("position desc")
            .then(function(sbs) {
                return res.view("supplier/balance/manage", {
                    sbs: sbs,
                    follow: false,
                });
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    supplierBalanceCreate: function(req, res) {
        if(req.method == "POST") {
            var params = readForm(req, [
                "title_1",
                "title_1_th",
                "title_2",
                "title_2_th",
                "title_3",
                "title_3_th",
                "content",
                "content_th",
            ]);

            SupplierBalance
                .create(params)
                .then(function(sb) {
                    return res.redirect(sails.getUrlFor("SupplierController.supplierBalanceManage"));
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            return res.view("supplier/balance/create", {
                follow: false,
            });
        }
    },

    supplierBalanceUpdate: function(req, res) {
        var sbid = req.param("sbid");

        if(req.method == "POST") {
            var params = readForm(req, [
                "title_1",
                "title_1_th",
                "title_2",
                "title_2_th",
                "title_3",
                "title_3_th",
                "content",
                "content_th",
            ]);
            params.id = sbid;

            SupplierBalance
                .update({id: sbid}, params)
                .then(function(t) {
                    return res.redirect(sails.getUrlFor("SupplierController.supplierBalanceManage"));
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            SupplierBalance
                .findOne({id: sbid})
                .then(function(sb) {
                    return res.view("supplier/balance/update", {
                        sb: sb,
                        follow: false,
                    });
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
    },

    supplierBalanceDelete: function(req, res) {
        SupplierBalance
            .destroy({id: req.param("sbid")})
            .then(function() {
                return res.redirect(
                    sails.getUrlFor("SupplierController.supplierBalanceManage")
                );
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    supplierBalanceReorder: function(req, res) {
        var order = req.param("order") || [];

        var tasks = [];
        for(var i=0; i<order.length; i++) {
            if(order[i]) {
                (function(i) {
                    tasks.push(function(cb) {
                        SupplierBalance
                            .update(order[i], {position: order.length-i})
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

