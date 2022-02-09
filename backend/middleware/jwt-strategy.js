/*
    Middleware
        Use JWT to lock down parts of API, Added to specific routes
        Client will send header field with token (Authentication: Bearer token)
        Server needs to get token from header, check if it is valid,
            if user is a real user in database, if info in token is valid
            passport & passport-jwt will handle this
    http://www.passportjs.org/packages/passport-jwt/
*/
const User = require('../models/user.js')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const config = require('../config/config.js')

/*
    secretOrKey is the string or buffer for verifying the token's signature REQUIRED
    jwtFromRequest accepts a request as request as the only parameter and 
        returns either JWT as a string or null
    fromAuthHeaderAsBearerToken creates a new extractor that looks for the JWT 
        in the authorization header with the scheme 'brearer'
*/
let options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
    algorithms: 'HS256'
}

/*
    jwt_payload is an object literal containing the decoded JWT payload
    done is a passport error first callback accepting arguments done(error,user,info)

    creating new JwtStrategy which will be passed to the app
        finds User in database using jwt_payload.id if user is not found send error
*/

// Changed find User.findById to FindOne (_id, email, username)
let jwtStrategy = new JwtStrategy(options, function (jwt_payload, done) {
    User.findOne({  _id: jwt_payload.id, 
                    email: jwt_payload.email, 
                    username: jwt_payload.username }, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
})

module.exports = jwtStrategy