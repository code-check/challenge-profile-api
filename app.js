var express = require('express');
var app = express();
var validator = require('validator');
var moment = require('moment'); 
 
//Database variables 
var fs = require("fs");
var file = "./sql/profileChallenge.db";
var exists = fs.existsSync(file);

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

//middleware to populate req.body.
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.listen(9000);

//Testing database
db.serialize(function() {
  db.each("SELECT * FROM users", function(err, row) {
    console.log(row.id + ": " + row.name);
  });
});

app.get('/api/users', function (req, res, next){

    db.serialize(function() {
        db.all("SELECT * FROM users", function(err, rows) {
            if(rows){
                res.status(200).send(rows);
                return next();
            }else{
                return next(err);
            }
        });
    });
}); 


app.get('/api/users/:id', function (req, res, next){

    db.serialize(function() {
        db.get("SELECT * FROM users WHERE id = $id", {
            $id:  req.params.id
        }, function(err, row) {
            if(row){
                res.status(200).send({ 
                    "code": 200,
                    "result": true,
                    "name": row.name
                });
                return next();
            }else{
                res.status(404).send({
                    "code": 404,
                    "result": false
                });
                return next(err);
            }
        });
    });
});

app.post('/api/users', upload.array(), function (req, res, next) {
    
    //console.log(req.body);
    var isEmail = validator.isEmail(req.body.email);
    var isValidDate = moment(req.body.birthday, 'YYYY-MM-DD').isValid() && moment(req.body.birthday).isBefore(new Date());

    if( isEmail && isValidDate) {
        db.serialize(function() {
            db.run("INSERT INTO users (name, password, email, birthday) VALUES ($name, $password, $email, $birthday)", {
                $name: req.body.name,
                $password: req.body.password,
                $email: req.body.email,
                $birthday: req.body.birthday
            }, function(err) {
                if(!err){
                    res.status(200).send({
                        "code": 200,
                        "result": true
                    });
                    
                }else{
                    res.status(400).send({
                        "code": 400,
                        "result": false
                    });
                }
                return next();
            });
        });
    }
    else {
        res.status(400).send({
            "code": 400,
            "result": false
        });
        return next();
    }
});

app.delete('/api/users/:id', function (req, res, next) {

    db.serialize(function() {
        db.get("SELECT name FROM users WHERE id = $id",{
            $id: req.params.id
        }, 
        function(error, row) {
            if(row !== undefined) {
                db.run("DELETE FROM users WHERE id = $id",{
                    $id: req.params.id
                },
                function(err) {
                    if(!err){
                        res.status(200).send({
                            "code": 200,
                            "result": true
                        });
                    }else{
                        res.status(404).send({
                            "code": 404,
                            "result": false
                        });
                    }
                    return next();
                });
            }
            else {
                res.status(404).send({
                    "code": 404,
                    "result": false
                });
                return next();
            }
        });
    });
});


app.put('/api/users/:id', function (req, res, next) {

    if(req.body.birthday) {
        var isValidDate = moment(req.body.birthday, 'YYYY-MM-DD').isValid() && moment(req.body.birthday).isBefore(new Date());
        if(!isValidDate){
            res.status(400).send({
                "code": 400,
                "result": false
            });
            return next();
        }
    }

    db.serialize(function() {
        db.get("SELECT * FROM users WHERE id = $id",{
            $id: req.params.id
        }, 
        function(error, row) {
            if(row !== undefined) {
                var updateName = !req.body.name ? row.name : req.body.name;
                var updatePassword = !req.body.password ? row.password : req.body.password;
                var updateBirthday = !req.body.birthday ? row.birthday : req.body.birthday;

                db.run("UPDATE users SET name = $name, password = $password, birthday = $birthday WHERE id = $id",{
                    $id: req.params.id,
                    $name: updateName,
                    $password: updatePassword,
                    $birthday: updateBirthday
                },
                function(err) {
                    if(!err){
                        res.status(200).send({
                            "code": 200,
                            "result": true
                        });
                    }else{
                        res.status(404).send({
                            "code": 404,
                            "result": false
                        });
                    }
                    return next();
                });
            }
            else {
                res.status(404).send({
                    "code": 404,
                    "result": false
                });
                return next();
            }
        });
    });
});
