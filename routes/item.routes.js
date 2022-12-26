const { authJwt } = require("../middleware");
const controller = require("../controllers/item.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/api/item/create", [authJwt.verifyToken], controller.addItem);
  app.get("/api/items", controller.getItems);
  app.get("/api/item", controller.getItem);
  app.get("/api/item/search", controller.searchItem);
  app.patch("/api/item/update", [authJwt.verifyToken], controller.updateItem);
  app.patch("/api/approve/post", [authJwt.verifyToken], controller.approvePost);
  app.delete("/api/item/delete", [authJwt.verifyToken], controller.deleteItem);
  app.delete(
    "/api/my-item/delete",
    [authJwt.verifyToken],
    controller.deleteMyItem
  );
  app.get("/api/my/item", [authJwt.verifyToken], controller.userShare);

};
