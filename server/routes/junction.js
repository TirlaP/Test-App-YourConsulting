module.exports = (app) => {
  "use strict";
  const express = require("express");
  const junctionCtrl = require("../controllers/junctionCtrl")(app.locals.db);
  const router = express.Router();

  router.post("/", junctionCtrl.create);
  router.put("/", junctionCtrl.update);
  router.get("/", junctionCtrl.findAll);
  router.get("/:id", junctionCtrl.find);
  router.delete("/:id", junctionCtrl.destroy);

  return router;
};
