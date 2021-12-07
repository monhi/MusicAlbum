# Music album
This project is a web based project which is developed to share my music files and audio books in my home. 
In this way,  I can always listen to my music files and audio books without needing to copy them to different devices. ( I have a Laptop, a PC, a Raspberry Pi 4 and a mobile set).
I just upload my files to web server once and listen to them in different devices. 

This project also supports different users and each user can have his/her own audio files.

**Backend**
* Backend is developed with Node.js and express library.
* to keep the track of music files and users and sessions, MySQL database is used.
* to support different users, session and mysql-session library  is used.
* to upload files to server, formidable library is used.


**Frontend**
* Bootstrap library is used in frontend. 

**How to setup**

This project is a normal Node.js one.
After downloading the project, do following steps to run the program:

* Run <em>npm install</em> to download the necessary libraries. 
* Run npm start to run the project.
* Default port number is 2077.
* Default username is <em>admin</em>
* Default password is <em>12345</em>
* Upload new music files (*.mp3 files) from <em>Album</em>  menu. 
* You can create new users from <em>Admin</em> menu.
* Web program tries to play first music after successfull login, but some browsers (firefox for example) may prevent it from playing.
* When a music is finished, the next music will be played in circular.

**Important point **
After installing mysql server on your system, you are supposed to run following 2 commands in mysql workbench or heidisql to resolve the login bug in mysql

>ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
>flush privileges;


**Acknowledgement**

* Special thanks to webprog.io site (Mr Ali Sheikh) for great bootstrap tutorial.
* Also special thanks to Bethany Griggs for great `Node Cookbook fourth edition` book. I use some parts of it in this project.
