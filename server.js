const express = require('express')
const routes = require('./routes/routes.js')
const session = require('express-session')
const  FileStore = require('session-file-store')(session)
const db = require("./models/database.js");
const app = express()

app.use(session({
    store: new FileStore({}),
    secret:"&ZuC!~A*&yWF`hHb%:da",
    resave:false,
    saveUninitialized: true,
    httpOnly: true,  // dont let browser javascript access cookie ever
    secure: true, // only use cookie over https
    ephemeral: true // delete 
}))

app.use((req, res , next) =>{
    res.locals.session = req.session;

    next();
})
    app.use(async (req, res, next) => {
        try {
            if(req.session && req.session.user && req.session.user.id){
                const userId = req.session.user.id;
        
                const sql = `SELECT * FROM user JOIN user_deck ON user.id = user_deck.user_id WHERE user.id = ?`;
                const [result] = await db.execute(sql, [userId]);
                
                // Assurez-vous que res.locals est initialisé (par exemple, dans un middleware)
                res.locals = res.locals || {};
            
                // Stockez les données dans res.locals pour les rendre disponibles dans les templates
                res.locals.userData = result;
            

            }
        next();
        } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'utilisateur :', error);
        // Gérez l'erreur de manière appropriée, par exemple, renvoyez une réponse d'erreur
        res.status(500).json({ error: 'Erreur serveur' });
        }
    });

app.use(express.static('public'))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use('/', routes.router)
app.use('/singin' , routes.router)
app.use('/login' , routes.router)
app.use('/halloffame' , routes.router)
app.use('/unlogin' , routes.router)
app.use('/admin' , routes.router)


app.listen(3000, () => {
    console.log('Start server on port 3000')
})