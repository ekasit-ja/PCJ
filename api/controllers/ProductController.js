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
            .limit(3)
            .exec(function(err, projects) {
                if(err) return res.serverError(err);

                return res.view("homepage", {
                    projects: projects,
                });
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

    apiGetProduct: function(req, res) {
        Product
            .find({model: req.param("mid")})
            .sort("position asc")
            .exec(function(err, products) {
                if(err) return res.json(err);

                return res.json(products);
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

    manager: function(req, res) {
        return res.view("product/manager");
    },

    manage: function(req, res) {
        Product
            .find()
            .populate("model")
            .sort("position asc")
            .exec(function(err, products) {
                if(err) return res.serverError(err);

                return res.view("product/manage", {
                    products: products,
                });
            });
    },

    create: function(req, res) {
        if(req.method == "POST") {
            var url;
            uploadSingleFile(req.file("image"))
                .then(function(fs) {
                    if(fs.length < 1)
                        throw "No file has been uploaded."

                    url = fs[0].extra.uploadFilepath;
                    return Product.find().max("position");
                })
                .then(function(p) {
                    var params = readForm(req, [
                        "model",
                        "title",
                    ]);
                    params.image = url;
                    params.position = p[0] ? p[0].position + 1 : 1;
                    return Product.create(params);
                })
                .then(function(p) {
                    return res.redirect(
                        sails.getUrlFor('ProductController.manage')
                    );
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            Model.find().exec(function(err, models) {
                if(err) return res.serverError(err);

                return res.view("product/create", {
                    models: models,
                });
            });
        }
    },

    update: function(req, res) {
        var pid = req.param("pid");

        if(req.method == "POST") {
            uploadSingleFile(req.file("image"))
                .then(function(fs) {
                    var params = readForm(req, [
                        "model",
                        "title",
                    ]);

                    if(fs.length > 0)
                        params.image = fs[0].extra.uploadFilepath;

                    return Product.update({id: pid}, params);
                })
                .then(function(p) {
                    return res.redirect(
                        sails.getUrlFor('ProductController.manage')
                    );
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
            .exec(function(err) {
                if(err) return res.serverError(err);

                return res.redirect(
                    sails.getUrlFor('ProductController.manage')
                );
            });
    },



    typeManage: function(req, res) {
        Type
            .find()
            .sort("position asc")
            .exec(function(err, types) {
                if(err) return res.serverError(err);

                return res.view("product/type/manage", {
                    types: types,
                });
            });
    },

    typeCreate: function(req, res) {
        if(req.method == "POST") {
            var url;
            uploadSingleFile(req.file("image"))
                .then(function(fs) {
                    if(fs.length < 1)
                        throw "No file has been uploaded."

                    url = fs[0].extra.uploadFilepath;
                    return Type.find().max("position");
                })
                .then(function(t) {
                    var params = readForm(req, [
                        "category",
                        "title",
                    ]);
                    params.image = url;
                    params.position = t[0] ? t[0].position + 1 : 1;
                    return Type.create(params);
                })
                .then(function(t) {
                    return res.redirect(
                        sails.getUrlFor('ProductController.typeManage')
                    );
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            Category
                .find()
                .sort("position asc")
                .exec(function(err, categories) {
                    if(err) return res.serverError(err);

                    return res.view("product/type/create", {
                        categories: categories,
                    });
                });
        }
    },

    typeUpdate: function(req, res) {
        var tid = req.param("tid");

        if(req.method == "POST") {
            uploadSingleFile(req.file("image"))
                .then(function(fs) {
                    var params = readForm(req, [
                        "category",
                        "title",
                    ]);

                    if(fs.length > 0)
                        params.image = fs[0].extra.uploadFilepath;

                    return Type.update({id: tid}, params);
                })
                .then(function(t) {
                    return res.redirect(
                        sails.getUrlFor('ProductController.typeManage')
                    );
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            Type.findOne({id: tid}).exec(function(err, type) {
                if(err) return res.serverError(err);

                return res.view("product/type/update", {
                    type: type,
                });
            })
        }
    },

    typeDelete: function(req, res) {
        Type
            .destroy({id: req.param("tid")})
            .exec(function(err) {
                if(err) return res.serverError(err);

                return res.redirect(
                    sails.getUrlFor('ProductController.typeManage')
                );
            });
    },



    modelManage: function(req, res) {
        Model
            .find()
            .populate("type")
            .sort("position asc")
            .exec(function(err, models) {
                if(err) return res.serverError(err);

                return res.view("product/model/manage", {
                    models: models,
                });
            });
    },

    modelCreate: function(req, res) {
        if(req.method == "POST") {
            var url;
            uploadSingleFile(req.file("image"))
                .then(function(fs) {
                    if(fs.length < 1)
                        throw "No file has been uploaded."

                    url = fs[0].extra.uploadFilepath;
                    return Model.find().max("position");
                })
                .then(function(t) {
                    var params = readForm(req, [
                        "type",
                        "title",
                    ]);
                    params.image = url;
                    params.position = t[0] ? t[0].position + 1 : 1;
                    return Model.create(params);
                })
                .then(function(t) {
                    return res.redirect(
                        sails.getUrlFor('ProductController.modelManage')
                    );
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            Type
                .find()
                .exec(function(err, types) {
                    if(err) return res.serverError(err);

                    return res.view("product/model/create", {
                        types: types,
                    });
                })
        }
    },

    modelUpdate: function(req, res) {
        var mid = req.param("mid");

        if(req.method == "POST") {
            uploadSingleFile(req.file("image"))
                .then(function(fs) {
                    var params = readForm(req, [
                        "type",
                        "title",
                    ]);

                    if(fs.length > 0)
                        params.image = fs[0].extra.uploadFilepath;

                    return Model.update({id: mid}, params);
                })
                .then(function(t) {
                    return res.redirect(
                        sails.getUrlFor('ProductController.modelManage')
                    );
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
                    return res.view("product/model/update", {
                        types: ts,
                        model: model,
                    });
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
    },

    modelDelete: function(req, res) {
        Model
            .destroy({id: req.param("mid")})
            .exec(function(err) {
                if(err) return res.serverError(err);

                return res.redirect(
                    sails.getUrlFor('ProductController.modelManage')
                );
            });
    },

    hardwareManage: function(req, res) {
        Hardware
            .find()
            .sort("position asc")
            .exec(function(err, hardwares) {
                if(err) return res.serverError(err);

                return res.view("product/hardware/manage", {
                    hardwares: hardwares,
                });
            });
    },

    hardwareCreate: function(req, res) {
        if(req.method == "POST") {
            var url;
            uploadSingleFile(req.file("image"))
                .then(function(fs) {
                    if(fs.length < 1)
                        throw "No file has been uploaded."

                    url = fs[0].extra.uploadFilepath;
                    return Hardware.find().max("position");
                })
                .then(function(h) {
                    var params = readForm(req, [
                        "hardware",
                        "title",
                        "desc",
                    ]);
                    params.image = url;
                    params.position = h[0] ? h[0].position + 1 : 1;
                    return Hardware.create(params);
                })
                .then(function(h) {
                    return res.redirect(
                        sails.getUrlFor('ProductController.hardwareManage')
                    );
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            return res.view("product/hardware/create");
        }
    },

    hardwareUpdate: function(req, res) {
        var hid = req.param("hid");

        if(req.method == "POST") {
            uploadSingleFile(req.file("image"))
                .then(function(fs) {
                    var params = readForm(req, [
                        "hardware",
                        "title",
                        "desc",
                    ]);

                    if(fs.length > 0)
                        params.image = fs[0].extra.uploadFilepath;

                    return Hardware.update({id: hid}, params);
                })
                .then(function(h) {
                    return res.redirect(
                        sails.getUrlFor('ProductController.hardwareManage')
                    );
                })
                .catch(function(err) {
                    return res.serverError(err);
                });
        }
        else {
            Hardware.findOne({id: hid}).exec(function(err, hardware) {
                if(err) return res.serverError(err);

                return res.view("product/hardware/update", {
                    hardware: hardware,
                });
            });
        }
    },

    hardwareDelete: function(req, res) {
        Hardware
            .destroy({id: req.param("hid")})
            .exec(function(err) {
                if(err) return res.serverError(err);

                return res.redirect(
                    sails.getUrlFor('ProductController.hardwareManage')
                );
            });
    },
};

