const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Local strategy for login - email + password
passport.use('login', new LocalStrategy({ usernameField: 'email', passwordField: 'password', session: false },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return done(null, false, { message: 'User not found' });
      const valid = user.validatePassword(password);
      if (!valid) return done(null, false, { message: 'Invalid credentials' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// JWT strategy 'current' para validar token y setear req.user
const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
};

passport.use('current', new JwtStrategy(jwtOpts, async (payload, done) => {
  try {
    // payload con id
    const user = await User.findById(payload.id).select('-password');
    if (!user) return done(null, false, { message: 'Token not valid' });
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;
