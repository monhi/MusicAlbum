const express       = require('express');
const path          = require('path');
const session       = require('express-session');
const MySQLStore    = require('express-mysql-session')(session);
const dbconf        = require('./db/db.config');
const { join }      = require("path");
const Router        = require('./routes/Router');
const app           = express();
const PORT          = 2077;

app.use(express.json());

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

var options ={
	host: dbconf.HOST,
	port: dbconf.PORT,
	user: dbconf.USER,
	password: dbconf.PASSWORD,
	database: dbconf.DB
};

const sessionStore = new MySQLStore(options);

app.use(session({
    name: "SESSIONID",
    key:'asdfoiuasdfmnwqeroizxcmvnu',
    secret:'zxcmvn654654321asdfoiuyoiuy',
    store:sessionStore,
    resave:false,
    saveUninitialized:true,
	cookie: {
        maxAge: 1000000
    }
}));

const database = require('./db');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

new Router(app,database.db);

app.listen(PORT,()=>{
	console.log(`Listening to port ${PORT}`);
});