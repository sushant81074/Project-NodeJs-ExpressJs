const passport = require("passport");

exports.isAuth = (req, res) => {
  return passport.authenticate("jwt");
};
exports.sanitizer = (user) => {
  return { id: user.id, role: user.role };
};
exports.cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookie) {
    token = req.cookie["jwt"];
  }
  token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTk1ZWI3ODMxNmFkNGMyZWU2MGMwZSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg3NzcyODU1fQ.rVowX1HB1f87bcwoGtVsoeOnp6HOFtkWJB-op6zc21E";
  return req;
};
