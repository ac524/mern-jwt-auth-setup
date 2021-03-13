const passport = require('passport');

const authenticateUser = passport.authenticate('jwt', { session: false });

module.exports = authenticateUser;