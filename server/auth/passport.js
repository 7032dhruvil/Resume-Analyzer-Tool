const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Serialize/deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ provider: 'google', providerId: profile.id });
    if (!user) {
      // Try to find user by email (regardless of provider)
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        // Optionally, update provider info if needed
        user.provider = 'google';
        user.providerId = profile.id;
        await user.save();
      } else {
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          provider: 'google',
          providerId: profile.id,
          password: 'oauth', // Not used
        });
      }
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL || '/api/auth/github/callback',
  scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ provider: 'github', providerId: profile.id });
    if (!user) {
      // Try to find user by email (regardless of provider)
      const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || `${profile.username}@github.com`;
      user = await User.findOne({ email });
      if (user) {
        // Optionally, update provider info if needed
        user.provider = 'github';
        user.providerId = profile.id;
        await user.save();
      } else {
        user = await User.create({
          name: profile.displayName || profile.username,
          email,
          provider: 'github',
          providerId: profile.id,
          password: 'oauth', // Not used
        });
      }
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

module.exports = passport; 