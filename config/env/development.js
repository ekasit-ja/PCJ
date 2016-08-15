/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

var MySQLSessionStore = require('express-mysql-session');
var db_options = {
    adapter: 'sails-mysql',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'pcj_industries'
}

module.exports = {

    /***************************************************************************
     * Set the default database connection for models in the development       *
     * environment (see config/connections.js and config/models.js )           *
     ***************************************************************************/

    connections: {
        mysqlDb: db_options,
    },

    models: {
        connection: 'mysqlDb',
        migrate: 'safe'
    },

    session: {
        store: new MySQLSessionStore(db_options),
    },

    hookTimeout: 60000,

};
