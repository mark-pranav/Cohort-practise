const express = require ('express');
const app = express();
var user = [
    {
        name : "Pranav",
        age : 22,
        email : "pranavbobade48@gmail.com",
        metadata : {
            profilepicture : "set",
            pronoun : "he/him"
        },
        kidney : [{
            healthy: true
        }]
    },
    {
        name : "gauri",
        age : 21,
        email : "gauri@gmail.com",
        metadata : {
            profilepicture : "Notset",
            pronoun : "she/her"
        }
    }
]

app.get("/" , function(req,res){
    const pranavKidney = user[0].kidney;
    res.json({
        pranavKidney
    })
    console.log(pranavKidney);
})


app.listen(3000);