const { authJwt } = require("../middleware");
const controller = require("../controllers/category.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/categories", [authJwt.verifyToken], controller.getCategories);
  app.get("/api/category", [authJwt.verifyToken], controller.getCategory);
  app.post("/api/category/create", [authJwt.verifyToken], controller.addCategory);
  app.delete("/api/category/delete", [authJwt.verifyToken], controller.deleteCategory);
  app.patch("/api/category/update", [authJwt.verifyToken], controller.updateCategory);
};
