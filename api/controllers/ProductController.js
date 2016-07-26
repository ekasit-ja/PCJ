/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    fsd: function(req, res) {
        Type
            .find({category: "fsd"})
            .sort("position asc")
            .then(function(types) {
                if(types.length < 1)
                    return Promise.resolve([]);

                dynamicInter(req, "Type", types);

                // suppose to found just one type of fire steel door
                return Model.find({type: types[0].id}).sort("position asc")
            })
            .then(function(models) {
                dynamicInter(req, "Model", models);

                return res.view("product/fsd/index", {
                    models: models,
                });
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    fsdModel: function(req, res) {
        var mid = req.param("mid");
        if(isNaN(mid))
            mid = -1;

        var m, ps, result, sorting, certs, insts, catgs;
        Model
            .findOne(mid)
            .then(function(model) {
                m = model;
                dynamicInter(req, "Model", m);
                return Product.find({model: mid}).sort("position asc");
            })
            .then(function(products) {
                ps = products;
                dynamicInter(req, "Product", ps);
                return Hardware.find().sort("position asc");
            })
            .then(function(hardwares) {
                // sort hardware according to enums config
                // and position attribute
                sorting = [];
                for(var key in sails.config.enums.hardware) {
                    sorting.push(key);
                }

                result = new Array(sorting.length);
                for(var i=0; i<sorting.length; i++) {
                    result[i] = [];

                    for(var j=0; j<hardwares.length; j++) {
                        if(hardwares[j].hardwareType == sorting[i]) {
                            dynamicInter(req, "Hardware", hardwares[j]);
                            result[i].push(hardwares[j]);
                        }
                    }
                }

                return File
                    .find({category: "fsd", fileType: "cert"})
                    .sort("position asc");
            })
            .then(function(files) {
                certs = files;
                dynamicInter(req, "File", certs);
                return File
                    .find({category: "fsd", fileType: "inst"})
                    .sort("position asc");
            })
            .then(function(files) {
                insts = files;
                dynamicInter(req, "File", insts);
                return File
                    .find({category: "fsd", fileType: "catg"})
                    .sort("position asc");
            })
            .then(function(files) {
                catgs = files;
                dynamicInter(req, "File", catgs);

                return res.view("product/fsd/model", {
                    model: m,
                    products: ps,
                    hardwares: result,
                    sorting: sorting,
                    certs: certs,
                    insts: insts,
                    catgs: catgs,
                });
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    dd: function(req, res) {
        Type
            .find({category: "dd"})
            .sort("position asc")
            .populate("models", {sort: "position asc"})
            .exec(function(err, types) {
                if(err) return res.serverError(err);

                dynamicInter(req, "Type", types);
                for(var i=0; i<types.length; i++)
                    dynamicInter(req, "Model", types[i].models);

                return res.view("product/dd/index", {
                    types: types,
                });
            });
    },

    ddModel: function(req, res) {
        var mid = req.param("mid");
        if(isNaN(mid))
            mid = -1;

        var m, ps, certs, insts, catgs;
        Model
            .findOne(mid)
            .populate("type")
            .then(function(model) {
                m = model;
                dynamicInter(req, "Model", m);
                dynamicInter(req, "Type", m.type);
                return Product.find({model: mid}).sort("position asc")
            })
            .then(function(products) {
                ps = products;
                dynamicInter(req, "Product", ps);
                return File
                    .find({category: "dd", fileType: "cert"})
                    .sort("position asc");
            })
            .then(function(files) {
                certs = files;
                dynamicInter(req, "File", certs);
                return File
                    .find({category: "dd", fileType: "inst"})
                    .sort("position asc");
            })
            .then(function(files) {
                insts = files;
                dynamicInter(req, "File", insts);
                return File
                    .find({category: "dd", fileType: "catg"})
                    .sort("position asc");
            })
            .then(function(files) {
                catgs = files;
                dynamicInter(req, "File", catgs);
                return res.view("product/dd/model", {
                    model: m,
                    products: ps,
                    certs: certs,
                    insts: insts,
                    catgs: catgs,
                });
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    ao: function(req, res) {
        Type
            .find({category: "ao"})
            .sort("position asc")
            .populate("models", {sort: "position asc"})
            .exec(function(err, types) {
                if(err) return res.serverError(err);

                dynamicInter(req, "Type", types);
                for(var i=0; i<types.length; i++)
                    dynamicInter(req, "Model", types[i].models);

                return res.view("product/ao/index", {
                    types: types,
                });
            });
    },

    aoModel: function(req, res) {
        var mid = req.param("mid");
        if(isNaN(mid))
            mid = -1;

        var m, ps, certs, insts, catgs;
        Model
            .findOne(mid)
            .populate("type")
            .then(function(model) {
                m = model;
                dynamicInter(req, "Model", m);
                dynamicInter(req, "Type", m.type);
                return Product.find({model: mid}).sort("position asc")
            })
            .then(function(products) {
                ps = products;
                dynamicInter(req, "Product", ps);
                return File
                    .find({category: "ao", fileType: "cert"})
                    .sort("position asc");
            })
            .then(function(files) {
                certs = files;
                dynamicInter(req, "File", certs);
                return File
                    .find({category: "ao", fileType: "inst"})
                    .sort("position asc");
            })
            .then(function(files) {
                insts = files;
                dynamicInter(req, "File", insts);
                return File
                    .find({category: "ao", fileType: "catg"})
                    .sort("position asc");
            })
            .then(function(files) {
                catgs = files;
                dynamicInter(req, "File", catgs);
                return res.view("product/ao/model", {
                    model: m,
                    products: ps,
                    certs: certs,
                    insts: insts,
                    catgs: catgs,
                });
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    manage: function(req, res) {
        Product
            .find()
            .populate("model")
            .sort("position asc")
            .then(function(products) {
                return res.view("product/manage", {
                    products: products,
                });
            })
            .catch(function(err) {
                return res.serverError(err);
            });
    },

    create: function(req, res) {
        if(req.method == "POST") {
            var params = readForm(req, [
                "model",
                "title",
                "title_th",
            ]);

            uploadFiles(req.file("image"))
                .then(function(fs) {
                    if(fs.length < 1)
                        throw "No file has been uploaded."

                    params.image = fs[0].extra.uploadPath;
                    return Product.create(params);
                })
                .then(function(p) {
                    return res.redirect(sails.getUrlFor('ProductController.manage'));
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            Model
                .find()
                .populate("type")
                .then(function(models) {
                    return res.view("product/create", {
                        models: models,
                    });
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
    },

    update: function(req, res) {
        var pid = req.param("pid");

        if(req.method == "POST") {
            var params = readForm(req, [
                "model",
                "title",
                "title_th",
            ]);
            params.id = pid;

            uploadFiles(req.file("image"))
                .then(function(fs) {
                    if(fs.length > 0)
                        params.image = fs[0].extra.uploadPath;

                    return Product.update({id: pid}, params);
                })
                .then(function(p) {
                    return res.redirect(sails.getUrlFor('ProductController.manage'));
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            var ms;
            Model
                .find()
                .populate("type")
                .sort("position asc")
                .then(function(models) {
                    ms = models;
                    return Product.findOne({id: pid})
                })
                .then(function(product) {
                    return res.view("product/update", {
                        models: ms,
                        product: product,
                    });
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
    },

    delete: function(req, res) {
        Product
            .destroy({id: req.param("pid")})
            .then(function() {
                return res.redirect(
                    sails.getUrlFor('ProductController.manage')
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
                        Product
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

