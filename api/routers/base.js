const appRoot = require('app-root-path');
const passport = require('passport');
const role = require('../middleware/authentication/role');
require(`${appRoot}/api/middleware/authentication/passport`)
exports.protectRoute = function (roles) {
    return [
        passport.authenticate('jwt', {
            session: false
        }),
        role(roles)
    ]
}