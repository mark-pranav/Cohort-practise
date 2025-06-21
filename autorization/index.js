const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.json());

const users = [];
const JWT_SECRET = "iampranavpaglu";

function logger(res, req , next){
    console.log(req.method+"request came")
    next();
}

app.post('/signup', logger, function(req, res){
    const username = req.body.username;
    const password = req.body.password;
   


    if(users.find(u => u.username === username)){
        res.json({
            message: "User already exist"
        })
        return;
    }
    users.push({
        username : username,
        password : password
    })

    res.json({
        message: "You have signed in"
    })
    console.log(users)
})

app.post('/signin',logger,  function(req, res){
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    
    const foundUser = users.find(function(u) {
        if(u.username == username && u.password == password){
            return true;
        }
        else{
            return false;
        }
    })
    
    if(foundUser){
        const token = jwt.sign({
            username: username
        }, JWT_SECRET);

        //foundUser.token = token;
        res.json({
            message : token
        })
    }
    else{
        res.status(403).send({
            message:"Invalid username and password"
        })
    }
    console.log(users)
})

function auth(res,req,next){
    const token = req.headers.token;
    const decodeData = jwt.verify(token, JWT_SECRET);

    if(decodeData.username){
        req.username = decodeData.username;
        next();
    }
    else{
        res.json({
            message:"not logged in";
        })
    }
}

app.get('/me' ,logger ,f auth , function(req, res){
    const token = req.headers.token
    const decodeInformation = jwt.verify(token, JWT_SECRET);
    const username = decodeInformation.username;

    let foundUser = null;

    for(let i = 0 ; i<users.length ; i++){
        if(users[i].username == username){
            foundUser = users[i]
        }
    }

    if(foundUser){
        res.json({
            username : foundUser.username,
            password : foundUser.password
        })
    }else{
        res.json({
            message: "token invalid"
        })
    }
})

app.listen(3000);