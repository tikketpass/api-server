const HTTPError = require("node-http-error");

module.exports = function (roles) {
    return function (req, res, next) {
        const authenticated = roles.includes(req.user.role);
        if(authenticated) next(null, true);
        else next(new HTTPError(403, "role not allowed"))
    }
}