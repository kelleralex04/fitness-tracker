const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');
const Exercise = require('../models/exercise');
const Category = require('../models/category');

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK
    },
    async function(accessToken, refreshToken, profile, cb) {
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (user) return cb(null, user);
            let categories = [];
            categories.push(await Category.find({ name: 'Back' }));
            categories.push(await Category.find({ name: 'Chest' }));
            categories.push(await Category.find({ name: 'Legs' }));
            user = await User.create({
                name: profile.displayName,
                googleId: profile.id,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value
            });
            for (c of categories) {
                user.category.push(c[0]);
                await user.save();
            };
            return cb(null, user);
            } catch (err) {
                return cb(err);
            }
    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user._id);
});

passport.deserializeUser(async function(userId, cb) {
    cb(null, await User.findById(userId));
});