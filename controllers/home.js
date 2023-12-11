const db = require("../models/database.js");
async function home(req, res) {
  let [postRows, fields] = await db.query("SELECT * FROM post");

  res.render("home.ejs", { posts: postRows });
}

async function hallFame(req, res) {
  const sql = ` SELECT hall_of_fame.id, hall_of_fame.tittle_card, hall_of_fame.description_card, hall_of_fame.img , hall_of_fame.vote, user.pseudo
    FROM hall_of_fame
    INNER JOIN user ON hall_of_fame.id_user = user.id`;
  let [hallCardsRows] = await db.query(sql);
  res.render("hallfame.ejs", { cardsUser: hallCardsRows });
}

async function singIn(req, res) {
  res.render("singin.ejs");
}

async function login(req, res) {
  res.render("login.ejs");
}

async function getBanList(req, res) {
  const response = await fetch(
    "https://db.ygoprodeck.com/api/v7/cardinfo.php?banlist=tcg"
  );
  // Parse le corps de la réponse JSON
  const responseBody = await response.json();
  res.render("banList.ejs", { responseBody:responseBody });
}

async function getRules (req ,res) {
 res.render('rules.ejs')
}


module.exports.home = home;
module.exports.hallFame = hallFame;
module.exports.singIn = singIn;
module.exports.login = login;
module.exports.getBanList = getBanList;
module.exports.getRules = getRules