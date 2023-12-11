const db = require("../models/database.js");
const bcrypt = require("bcrypt");

async function addUser(req, res) {
  const saltRound = 10;
  const email = req.body.email;
  const pseudo = req.body.pseudo;
  const password = req.body.password;
  const city = req.body.city.toLowerCase();

  bcrypt.hash(password, saltRound, async (err, hash) => {
    try {
      const sql = `INSERT INTO user (email , pseudo , password , city ) VALUES ( ?  , ?  , ? , ?)`;
      let [addUserRows] = await db.query(sql, [email, pseudo, hash, city]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
      res.redirect("/singin");
    }
  });
}

async function loginUser(req, res) {
  try {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    const sql = `SELECT * FROM user WHERE email = ? `;
    let [loginUserRows] = await db.query(sql, [userEmail]);

    for (user of loginUserRows) {
      const match = await bcrypt.compare(userPassword, user.password);

      console.log("Connected" + match);

      if (match) {
        req.session.connected = true;
        req.session.user = user;

        if (user.admin) {
          req.session.admin = user.admin;
          return res.redirect("/admin");
        }
        console.log(match)
        res.redirect("/");
      }
    }
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
}

function unLoginUser(req, res) {
  if (req.session) {
    req.session.destroy((err) => {
      res.redirect("/");
      console.log(err);
      return;
    });
  } else {
    res.redirect("/singin");
  }
}

async function addDeck(req, res){
  const userId = req.session.user.id
  const nameDeck = req.body.nameDeck
  const urlDeck = req.body.urlDeck
  const sql = `INSERT INTO  user_deck ( user_id , deck_name , deck_url) VALUES ( ? ,? , ? )`
  await db.query(sql , [userId , nameDeck , urlDeck])
  res.redirect('/')
}

module.exports.addUser = addUser;
module.exports.loginUser = loginUser;
module.exports.unLoginUser = unLoginUser;
module.exports.addDeck = addDeck