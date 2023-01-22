const { authJwt } = require("../middleware");
const controller = require("../controllers/subcategory.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/subcategories", [authJwt.verifyToken], controller.getSubategories);
  app.get("/api/subcategory", [authJwt.verifyToken], controller.getSubategory);
  app.post("/api/subcategory/create", [authJwt.verifyToken], controller.addSubcategory);
  app.delete("/api/subcategory/delete", [authJwt.verifyToken], controller.deleteSubategory);
  app.patch("/api/subcategory/update", [authJwt.verifyToken], controller.updateSubategory);
};
