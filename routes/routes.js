const express = require("express");
const homeController = require("../controllers/home.js");
const userController = require("../controllers/user.js");
const adminController = require("../controllers/admin.js");
const router = express.Router();

function connected(req, res, next) {
  if (req.session.connected && req.session) {
    return next();
  } else {
    return res.redirect("/");
  }
}
function admin(req, res, next) {
  if (
    req.session &&
    req.session.connected &&
    req.session.user &&
    req.session.admin
  ) {
    return next();
  } else {
    res.redirect("/");
  }
}
router.post('/add-deck' , connected,  userController.addDeck)
router.get('/rules' , homeController.getRules)
router.get("/ban-list", homeController.getBanList);
router.get("/", homeController.home);
router.get("/halloffame", homeController.hallFame);
router.get("/singin", homeController.singIn);
router.post("/singin",  userController.addUser);
router.get("/unlogin", connected, userController.unLoginUser);
router.get("/login", homeController.login);
router.post("/login", connected ,userController.loginUser);
router.get("/admin", admin, adminController.showAdminpage);
router.post("/admin/:id",  admin, adminController.showAdminpage);

module.exports.router = router;
