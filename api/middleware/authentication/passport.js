const User = require("../../models/user");
const crypt = require("crypto");

const passport    = require('passport');
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const { ExtractJwt } = require('passport-jwt');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('authorization'),
    secretOrKey   : process.env.JWT_SECRET
}, async (req, payload, done) => {
    try {
        // find user
        const user =  await User.findOne({_id: payload.sub});
        // if user does not exist
        if (!user) {
            return done(null, false)
        }

        user.role = payload.role;
        // if user exists
        done(null, user)

    } catch (error) {
        done(error, false)
    }
}
));
