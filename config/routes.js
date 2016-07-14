/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  "/": {view: "homepage"},

  "get /login": "UserController.login",
  "post /login": "AuthController.login",
  "/logout": "AuthController.logout",
  "/register": "UserController.register",

  "/product/fireSteelDoor": "ProductController.fireSteelDoor",
  "/product/ductDamper": "ProductController.ductDamper",

  "/api/product/model/:mid": "ProductController.apiGetProduct",




  "/product/manager": "ProductController.manager",

  "/product/manage": "ProductController.manage",
  "/product/create": "ProductController.create",
  "/product/update/:pid": "ProductController.update",
  "/product/delete": "ProductController.delete",

  "/product/category/manage": "ProductController.categoryManage",
  "/product/category/create": "ProductController.categoryCreate",
  "/product/category/update/:cid": "ProductController.categoryUpdate",
  "/product/category/delete": "ProductController.categoryDelete",

  "/product/type/manage": "ProductController.typeManage",
  "/product/type/create": "ProductController.typeCreate",
  "/product/type/update/:tid": "ProductController.typeUpdate",
  "/product/type/delete": "ProductController.typeDelete",

  "/product/model/manage": "ProductController.modelManage",
  "/product/model/create": "ProductController.modelCreate",
  "/product/model/update/:mid": "ProductController.modelUpdate",
  "/product/model/delete": "ProductController.modelDelete",
};
