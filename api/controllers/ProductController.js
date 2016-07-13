/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	fireSteelDoor: function(req, res) {
        res.view("product/fire_steel_door");
    },

    ductDamper: function(req, res) {
        res.view("product/duct_damper");
    },
};

