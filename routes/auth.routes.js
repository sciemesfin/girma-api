const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  app.patch("/api/user/update", [authJwt.verifyToken], controller.updateUser);
  app.get("/api/user/me", [authJwt.verifyToken], controller.getUser);
  app.patch("/api/user/update-psd", [authJwt.verifyToken], controller.updatePassword);
  app.get("/api/users", [authJwt.verifyToken], controller.getUsers);
  app.delete("/api/users", [authJwt.verifyToken], controller.deleteUser);
};
