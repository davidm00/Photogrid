function log(req, res, next) {
    console.log("logging...");
    next();
}
function auth(req, res, next) {
    console.log("Authenticating...");
    next();
}

module.exports = {
    log: log,
    auth: auth
}