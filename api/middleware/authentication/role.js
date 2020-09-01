module.exports = function (roles) {
    return function (req, res, next) {
        return roles.includes(req.user.role);
    }
}