const bcrypt      = require('bcrypt');
const formidable  = require("formidable");
const fs          = require("fs");
const path        = require('path');

var thisPtr;


class Router {
  constructor(app, db) {
    this.processIndex(app, db);
    this.processAuth(app, db);
    thisPtr = this;
  }

  AddMusicTrack(dbm,userid,trackname)
  {
			let sql 	  = `INSERT INTO albums (filename,userid) VALUES(?,?)`;
			let params  = [trackname,userid];
			let res2 	  = dbm.query(sql,params);
      console.log(res2);
	}            	

  ProcessInputParams(u, p1, p2) 
  {
    if (u == "") 
    {
      return "username empty";
    }

    if (p1 == "") 
    {
      return "pass1 empty";
    }

    if (p2 == "") 
    {
      return "pass2 empty";
    }

    if (p1 != p2) 
    {
      return "pass1 & pass2 mismatch";
    }
    return "Success";
  }

  processIndex(app, db) 
  {
    
    app.post("/newfile",function (req,res){
      if (!/multipart\/form-data/.test(req.headers["content-type"])) 
      {
        res.end(JSON.stringify({result:'Failure',param:'Upload data error'}));
        return;
      }


      try 
      {
        if (!fs.existsSync('.\\users\\')) 
        {
          fs.mkdirSync('.\\users\\');
        }
      } 
      catch (err) 
      {
        res.end(JSON.stringify({result:'Failure',param:'Create directory error'}));
        return;
      }

      const {name} = req.session.user;
      const path = ".\\users\\"+name+ "\\";
      
      try 
      {
        if (!fs.existsSync(path)) 
        {
          fs.mkdirSync(path);
        }
      } 
      catch (err) 
      {
        res.end(JSON.stringify({result:'Failure',param:'Create directory error'}));
        return;
      }

      const form = formidable({
        multiples: true,
        uploadDir: path,
      });

      form.parse(req, (err, fields, files) => 
      {
        if (err)
        {
            console.log(err);
            res.end(JSON.stringify({result:'Failure',param:'Parsing data error'}));
            return;
        }
        
        const new_file_path = path +  files.musicFile.name;
        console.log(new_file_path);
        const old_file_path =  files.musicFile.path;
        console.log(old_file_path);

        if (fs.existsSync(new_file_path))
        {
            fs.rmSync(old_file_path);
            res.end(JSON.stringify({result:'Failure',param:'File already exists'}));
            return;
        }
        fs.renameSync(old_file_path,new_file_path);
        /////// Save data in database /////
        thisPtr.AddMusicTrack(db,req.session.user.id,files.musicFile.name);
        ///////////////////////////////////
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({result:'Success',param:'Upload done'}));
      });
    });

    app.get("/album", function (req, res) {
      const user = req.session.user;
      console.log(`calling album, user name is ${JSON.stringify(user)}`);
      //res.render("album", { user,musics });

      let cols = [user.id];
      db.query('SELECT * FROM albums where userid = ? ;',cols, (err, data, fields) => {
        if (err)
        {
          res.render("album", { user, musics: {} });
          return;
        }

        if (data && data.length > 0) 
        {
          var op = data.map((item) => {
            return {"name": item.filename};
          });
          
          console.log(JSON.stringify(op)); 
          res.render("album", { user, musics: op });
          return;
        }
        else 
        {
          res.render("album", { user, musics: {} });
          return;
        }
      });      
    });

    app.post("/album/refresh", function (req, res) 
    {
      const user = req.session.user;      
      let cols = [user.id];
      db.query('SELECT * FROM albums where userid = ? ;', cols , (err, data, fields) => {
        if (err)
        {
          res.send(`{}`);
          return;
        }

        if (data && data.length > 0) 
        {
          var op = data.map((item) => {
            return {"name": item.filename};
          });
          console.log(JSON.stringify(op));
          res.send(JSON.stringify(op));
          return;
        }
        else 
        {
          res.send(`{}`);
          return;
        }
      });
    });

    app.delete("/album/deletemusic", (req, res) => 
    {
      let musicname   = req.body.musicname;
      let {name}      = req.session.user;
      let cols        = [musicname];
      console.log('music name to delete is:'+musicname);

      db.query('DELETE FROM albums WHERE filename = ? ;', cols, (err, data, fields) => {
        if (err) {
          console.log(err);
          res.end(JSON.stringify({ result: "Failure", param: "Internal error" }));
          return;
        }

        if(data.affectedRows>0)
        {
          let path = ".\\users\\"+name+"\\"+musicname;

          if (fs.existsSync(path)) 
          {
            fs.rmSync(path);
          }          
          console.log(`File ${musicname} delete Success.`);
          res.end(JSON.stringify({ result: "Success", param: "File removed" }));
        }
        else
        {
          console.log(`File ${musicname} not found.`);
          res.end(JSON.stringify({ result: "Failure", param: "File not found" }));
        }
        return;
      });
    });

    app.get("/", (req, res) => 
    {
      const user = req.session.user;
      console.log(`calling home, user name is ${JSON.stringify(user)}`);    
      if(user == undefined)
      {
        res.render("index", { user, musics: {} });
      }
      else
      {
        const user = req.session.user;
        console.log(`calling index, user name is ${JSON.stringify(user)}`);
        //res.render("album", { user,musics });
  
        let cols = [user.id];
        db.query('SELECT * FROM albums where userid = ? ;',cols, (err, data, fields) => {
          if (err)
          {
            res.render("index", { user, musics: {} });
            return;
          }
  
          if (data && data.length > 0) 
          {
            var op = data.map((item) => {
              return {"name": item.filename};
            });
            
            console.log(JSON.stringify(op)); 
            res.render("index", { user, musics: op });
            return;
          }
          else 
          {
            res.render("index", { user, musics: {} });
            return;
          }
        });      
      }
    });

    app.get("/audio/:file",(req,res)=>{
      const user = req.session.user;
      console.log(__dirname);
      res.sendFile(path.join(__dirname ,'..' ,'users',user.name , req.params.file));
    })


    app.get("/admin", function (req, res)
    {
      const user = req.session.user;
      console.log(`calling admin page, user name is ${JSON.stringify(user)}`);


      db.query('SELECT * FROM users ;', (err, data, fields) => {
        if (err)
        {
          res.render("admin", { user, users: [] });
          return;
        }

        if (data && data.length > 0) 
        {

          var op = data.map((item) => {
            return {"name": item.username};
          });

          console.log(JSON.stringify(op)); 
          //console.log(data);
          res.render("admin", { user, users: op });
          return;
        }
        else 
        {
          return;
        }
      });      
    });

    app.post("/admin/newuser", function (req, res) 
    {
      let username  = req.body.username;
      let pass1     = req.body.pass1;
      let pass2     = req.body.pass2;
      username      = username.toLowerCase();

      console.log(username);

      let restring = thisPtr.ProcessInputParams(username, pass1, pass2);

      if (restring != "Success") 
      {
        res.end(JSON.stringify({ result: "Failure", param: "Input parameter error" }));
      }

      let cols = [username];

      db.query('SELECT * FROM users WHERE username = ? LIMIT 1;', cols, (err, data, fields) => {
        if (err) {
          console.log(err);
          res.end(JSON.stringify({ result: "Failure", param: "Internal error" }));
          return;
        }
        // found 1 user with this username.
        if (data && data.length === 1) 
        {
          res.end(JSON.stringify({ result: "Failure", param: "User exists" }));
          return;
        }
        else 
        {
          // add new user into database.
          let pswrd 	= bcrypt.hashSync(pass1,9);
          let sql 	  = `INSERT INTO users (username,password) VALUES(?,?)`;
          let params  = [username,pswrd];
          let res2 	  = db.query(sql,params);
          res.end(JSON.stringify({ result: "Success" , param:"New user added" }));
          return;
        }
      });
    });

    app.post("/admin/refresh", function (req, res) 
    {
      db.query('SELECT * FROM users ;', (err, data, fields) => {
        if (err)
        {
          res.send(json.stringify([]));
          return;
        }

        if (data && data.length > 0) 
        {
          var op = data.map((item) => {
            return {"name": item.username};
          });
          console.log(JSON.stringify(op));
          res.send(JSON.stringify(op));
          return;
        }
        else 
        {
          res.send(json.stringify([]));
          return;
        }
      });
    });

    app.post("/admin/changepassword", function (req, res) 
    {
      let username  = req.body.username;
      let pass1     = req.body.pass1;
      let pass2     = req.body.pass2;
      username = username.toLowerCase();
      console.log(username)

      let restring = thisPtr.ProcessInputParams(username, pass1, pass2);

      if (restring != "Success") 
      {
        res.end(JSON.stringify({ result: "Failure", param: "Input parameter error" }));
      }

      let cols = [username];

      db.query('SELECT * FROM users WHERE username = ? LIMIT 1;', cols, (err, data, fields) => {
        if (err) {
          console.log(err);
          res.end(JSON.stringify({ result: "Failure", param: "Internal error" }));
          return;
        }
        // found 1 user with this username.
        if (data && data.length === 1) 
        {
          let pswrd 	= bcrypt.hashSync(pass1,9);
          let sql     = "UPDATE `users` SET `Password` = ? WHERE username = ?;"
          let params  = [pswrd,username];
          let res2 	  = db.query(sql,params);
          res.end(JSON.stringify({ result: "Success" , param:"Update done" }));
        }
        else 
        {          
          res.end(JSON.stringify({ result: "Failure", param: "User does not exist" }));
          return;
        }
      });
    });
  }

  processAuth(app, db) {
    app.get("/auth/login", function (req, res) {
      res.render("login", { fail: false });
    });

    app.get("/auth/logout", (req, res) => {
      req.session.user = null;
      res.redirect("/");
    });

    app.post("/auth/login", (req, res) => {

      if (req.session.user) {
        res.redirect("/");
        return;
      }
      ///////////////////////////////////
      let username  = req.body.username;
      let password  = req.body.password;
      username      = username.toLowerCase();
      let cols      = [username];

      db.query('SELECT * FROM users WHERE username = ? LIMIT 1;', cols, (err, data, fields) => {
        if (err) 
        {
          console.log(err);
          res.render("login", { fail: true });
          return;
        }
        // found 1 user with this username.
        if (data && data.length === 1)
        {
          console.log("Login data is:",JSON.stringify(data));
          bcrypt.compare(password, data[0].password, (bcryptError, verified) => {
            if (verified) 
            {
              req.session.user = { name: data[0].username,id:data[0].id};
              //req.session.id   = data.id;
              res.redirect("/");
              return;
            }
            else 
            {
              console.log(err);
              res.render("login", { fail: true });
              return;
            }
          })
        }
        else 
        {
          console.log(err);
          res.render("login", { fail: true });
          return;
        }
      });
    });

    app.delete("/admin/deleteuser", (req, res) => {
      let username  = req.body.username;

      username = username.toLowerCase();
      
      if(username === 'admin')
      {
        res.end(JSON.stringify({ result: "Failure", param: "Can not delete admin" }));
      }

      let cols = [username];

      db.query('DELETE FROM users WHERE username = ? ;', cols, (err, data, fields) => {
        if (err) {
          console.log(err);
          res.end(JSON.stringify({ result: "Failure", param: "Internal error" }));
          return;
        }
        //console.log('data is')
        //console.log(data);
        //console.log(fields);
        // found 1 user with this username.
        if(data.affectedRows>0)
        {
          console.log(`user ${username} delete Success.`);
          res.end(JSON.stringify({ result: "Success", param: "User removed" }));
        }
        else
        {
          console.log(`user ${username} not found.`);
          res.end(JSON.stringify({ result: "Failure", param: "User not found" }));
        }
        return;
      });
    });
  }
}

module.exports = Router;
