var restify = require('restify');
var validator = require('validator');
var moment = require('moment');
 
//Server variables  
var ip_addr = '127.0.0.1';
var port    =  '9000';
 
var server = restify.createServer({
    name : "myapp"
});
 
//Database variables 
var fs = require("fs");
var file = "./sql/profileChallenge.db";
var exists = fs.existsSync(file);

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

//Use Restify Module Plugins
//The restify.queryParser() plugin is used to parse the HTTP query string (i.e., /jobs?skills=java,mysql). 
//The restify.bodyParser() takes care of turning your request data into a JavaScript object on the server automatically
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.listen(port ,ip_addr, function(){
    console.log('%s listening at %s ', server.name , server.url);
});

//Testing database
/*db.serialize(function() {

  db.each("SELECT * FROM users", function(err, row) {
    console.log(row.id + ": " + row.name);
  });
});*/

//Define CRUD API
var PATH = '/api/users'
server.get({path : PATH , version : '0.0.1'} , findAllUsers);
server.get({path : PATH +'/:id' , version : '0.0.1'} , findUser);
server.post({path : PATH , version: '0.0.1'} ,addNewUser);
server.del({path : PATH +'/:id' , version: '0.0.1'} ,deleteUser);
server.put({path : PATH +'/:id' , version: '0.0.1'} ,updateUser);

//Define callbacks
function findAllUsers(req, res, next){
    db.serialize(function() {

        db.all("SELECT * FROM users", function(err, rows) {
            if(rows){
                res.send(200 , rows);
                return next();
            }else{
                return next(err);
            }
        });
    });
}

function findUser(req, res, next){
    res.setHeader('Access-Control-Allow-Origin','*');
    db.serialize(function() {

        db.get("SELECT * FROM users WHERE id = $id", {
            $id:  req.params.id
        }, function(err, row) {
            if(row){
                res.send(200, {
                    "code": 200,
                    "result": true,
                    "name": row.name
                });
                return next();
            }else{
                res.send(404, {
                    "code": 404,
                    "result": false
                });
                return next(err);
            }
        });
    });
}

function addNewUser(req, res, next){

    var isEmail = validator.isEmail(req.params.email);
    var isValidDate = moment(req.params.birthday, 'YYYY-MM-DD').isValid() && moment(req.params.birthday).isBefore(new Date());

    if( isEmail && isValidDate) {

        db.serialize(function() {
            db.run("INSERT INTO users (name, password, email, birthday) VALUES ($name, $password, $email, $birthday)", {
                $name: req.params.name,
                $password: req.params.password,
                $email: req.params.email,
                $birthday: req.params.birthday
            },
            function(err) {
                if(!err){
                    res.send(200, {
                        "code": 200,
                        "result": true
                    });
                }else{
                    res.send(400,{
                        "code": 400,
                        "result": false,
                        "reason": "Error, cannot create"
                    });
                }
            });
        });
    }
    else {
        res.send(400,{
            "code": 400,
            "result": false,
            "reason": "Invalid Email or Invalid Birthday"
        });
    }

    return next();
}

function deleteUser(req, res, next){
    res.setHeader('Access-Control-Allow-Origin','*');
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
                        res.send(200, {
                            "code": 200,
                            "result": true
                        });
                    }else{
                        res.send(404 , {
                            "code": 404,
                            "result": false
                        });
                    }
                });
            }
            else {
                res.send(404, {
                    "code": 404,
                    "result": false
                });
            }
        });
    });
    return next();
}

function updateUser(req, res, next){
    res.setHeader('Access-Control-Allow-Origin','*');
    
    if(req.params.birthday) {
        var isValidDate = moment(req.params.birthday, 'YYYY-MM-DD').isValid() && moment(req.params.birthday).isBefore(new Date());
        if(!isValidDate){
            res.send(400 , {
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
                var updateName = !req.params.name ? row.name : req.params.name;
                var updatePassword = !req.params.password ? row.password : req.params.password;
                var updateBirthday = !req.params.birthday ? row.birthday : req.params.birthday;

                db.run("UPDATE users SET name = $name, password = $password, birthday = $birthday WHERE id = $id",{
                    $id: req.params.id,
                    $name: updateName,
                    $password: updatePassword,
                    $birthday: updateBirthday
                },
                function(err) {
                    if(!err){
                        res.send(200, {
                            "code": 200,
                            "result": true
                        });
                    }else{
                        res.send(404 , {
                            "code": 404,
                            "result": false
                        });
                    }
                });
            }
            else {
                res.send(404, {
                    "code": 404,
                    "result": false
                });
            }
        });
    });
    return next();
}