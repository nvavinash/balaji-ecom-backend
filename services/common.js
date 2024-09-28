const passport = require("passport");
exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
    console.log('Extracted JWT:', token); // Debugging log
  }
  //TODO : this is temporary token for testing without cookie
  //token =
    //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZGRlMWE0ZWE3NzA5ODU4MTg3MzY1NSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzI2MzE0OTI4fQ.0iHi6kd6uV3Uh_9xn320IZ6o80bimoH60yBJwp88mgk";
  return token;
};
