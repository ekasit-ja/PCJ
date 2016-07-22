/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    homepage: function(req, res) {
        Project
            .find()
            .sort("position asc")
            .populate("images", {sort: "position asc"})
            .limit(3)
            .exec(function(err, projects) {
                if(err) return res.serverError(err);

                return res.view("homepage", {
                    projects: projects,
                });
            });
    },

    apiGetProduct: function(req, res) {
        Product
            .find({model: req.param("mid")})
            .sort("position asc")
            .exec(function(err, products) {
                if(err) return res.json(err);

                return res.json(products);
            });
    },

	fsd: function(req, res) {
        Type
            .find({category: "fsd"})
            .sort("position asc")
            .then(function(types) {
                // suppose to found just one type of fire steel door
                return Model.find({type: types[0].id})
            })
            .then(function(models) {
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
        var m, ps;
        Model
            .findOne(mid)
            .then(function(model) {
                m = model;
                return Product.find({model: mid}).sort("position asc")
            })
            .then(function(products) {
                ps = products;
                return Hardware.find().sort("position asc");
            })
            .then(function(hardwares) {
                // sort hardware according to enums config
                // and position attribute
                var sorting = [];
                for(var key in sails.config.enums.hardware) {
                    sorting.push(key);
                }

                var result = new Array(sorting.length);
                for(var i=0; i<sorting.length; i++) {
                    result[i] = [];

                    for(var j=0; j<hardwares.length; j++) {
                        if(hardwares[j].hardware == sorting[i]) {
                            result[i].push(hardwares[j]);
                        }
                    }
                }

                return res.view("product/fsd/model", {
                    model: m,
                    products: ps,
                    hardwares: result,
                    sorting: sorting,
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

                return res.view("product/dd/index", {
                    types: types,
                });
            });
    },

    ddModel: function(req, res) {
        var mid = req.param("mid");
        var m;
        Model
            .findOne(mid)
            .populate("type")
            .then(function(model) {
                m = model;
                return Product.find({model: mid}).sort("position asc")
            })
            .then(function(products) {
                return res.view("product/dd/model", {
                    model: m,
                    products: products,
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
};

