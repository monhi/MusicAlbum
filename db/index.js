const dbConfig 		= require("./db.config.js");
const mysql 		= require('mysql2');
const bcrypt 		= require('bcrypt');

const db 			= mysql.createConnection({host:dbConfig.HOST,user:dbConfig.USER,password:dbConfig.PASSWORD,database:''});

db.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.DB}\`;`);
db.query(`USE \`${dbConfig.DB}\`;`);
db.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY,username VARCHAR(255) NOT NULL,password VARCHAR(255) NOT NULL) ENGINE=INNODB; `);
db.query(`CREATE TABLE IF NOT EXISTS albums (id INT AUTO_INCREMENT PRIMARY KEY,filename VARCHAR(255) NOT NULL,userid INT) ENGINE=INNODB; `);
CheckAdminUser(db);

module.exports = {db};

function CheckAdminUser(dbm)
{
	let cols = ['admin'];
	dbm.query('SELECT * FROM users WHERE username = ? LIMIT 1',cols,(err,data,fields)=>{            
		if(err)
		{
			let pswrd 	= bcrypt.hashSync('12345',9);
			let sql 	= `INSERT INTO users (username,password) VALUES(?,?)`;
			let params  = ['admin',pswrd];
			let res2 	= dbm.query(sql,params);	
		}
		// found 1 user with this username.
		if(data && data.length ===1)
		{
			return;
		}
		else
		{
			let pswrd 	= bcrypt.hashSync('12345',9);
			let sql 	= `INSERT INTO users (username,password) VALUES(?,?)`;
			let params  = ['admin',pswrd];
			let res2 	= dbm.query(sql,params);			
		}

	}            
	);
}


