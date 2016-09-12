/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

    /***************************************************************************
    *                                                                          *
    * Default policy for all controllers and actions (`true` allows public     *
    * access)                                                                  *
    *                                                                          *
    ***************************************************************************/

    "*": ["subdomain", "langPref"],

    "ProductController": {
        "*": ["subdomain", "langPref"],
        "manage": ["subdomain", "isAuthenticated", "langPref"],
        "create": ["subdomain", "isAuthenticated", "langPref"],
        "update": ["subdomain", "isAuthenticated", "langPref"],
        "delete": ["subdomain", "isAuthenticated", "langPref"],
        "reorder": ["subdomain", "isAuthenticated", "langPref"],
    },

    "HomeController": {
        "*": ["subdomain", "langPref"],
        "carouselManage": ["subdomain", "isAuthenticated", "langPref"],
        "apiCarouselCreate": ["subdomain", "isAuthenticated", "langPref"],
        "apiCarouselDelete": ["subdomain", "isAuthenticated", "langPref"],
        "apiCarouselReorder": ["subdomain", "isAuthenticated", "langPref"],
    },
    "TypeController": {
        "*": ["subdomain", "isAuthenticated", "langPref"],
    },
    "ModelController": {
        "*": ["subdomain", "isAuthenticated", "langPref"],
    },
    "HardwareController": {
        "*": ["subdomain", "isAuthenticated", "langPref"],
    },
    "FileController": {
        "*": ["subdomain", "isAuthenticated", "langPref"],
    },
    "ProjectController": {
        "*": ["subdomain", "langPref"],
        "manage": ["subdomain", "isAuthenticated", "langPref"],
        "create": ["subdomain", "isAuthenticated", "langPref"],
        "update": ["subdomain", "isAuthenticated", "langPref"],
        "delete": ["subdomain", "isAuthenticated", "langPref"],
        "apiImageCreate": ["subdomain", "isAuthenticated", "langPref"],
        "apiImageDelete": ["subdomain", "isAuthenticated", "langPref"],
        "apiImageReorder": ["subdomain", "isAuthenticated", "langPref"],
        "reorder": ["subdomain", "isAuthenticated", "langPref"],
    },
    "AdminController": {
        "*": ["subdomain", "isAuthenticated", "langPref"],
    },
    "UserController": {
        "*": ["subdomain", "langPref"],
        "register": ["subdomain", "isAuthenticated", "langPref"],
        "passwordUpdate": ["subdomain", "isAuthenticated", "langPref"],
    },

    /***************************************************************************
    *                                                                          *
    * Here's an example of mapping some policies to run before a controller    *
    * and its actions                                                          *
    *                                                                          *
    ***************************************************************************/
    // RabbitController: {

        // Apply the `false` policy as the default for all of RabbitController's actions
        // (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
        // '*': false,

        // For the action `nurture`, apply the 'isRabbitMother' policy
        // (this overrides `false` above)
        // nurture  : 'isRabbitMother',

        // Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
        // before letting any users feed our rabbits
        // feed : ['isNiceToAnimals', 'hasRabbitFood']
    // }
};
