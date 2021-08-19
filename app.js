const express = require('express');
const path  = require('path');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
const alert = require('alert');

app.use('/public', express.static('public'))
// app.use(express.static('./public/images'));
app.set("view engine","ejs");

const port = process.env.port || 80;
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/userdata', {useNewUrlParser: true, useUnifiedTopology: true});
// const staticpath = path.join(__dirname,"../public");
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

const usersSchema = {
    name : String,
    email : String,
    balance : Number,
    accountNo : Number
}

const User = mongoose.model('user',usersSchema);
const user1 = new User({
    name: "Raj Shekar",
    email: "rajshek@gmail.com",
    balance: 254600,
    accountNo: 111
})

const user2 = new User({
    name: "Shalini Kapoor",
    email: "kapporsahab@gmail.com",
    balance: 1000,
    accountNo: 112
})

const user3 = new User({
    name: "Shashank gupta",
    email: "shashankgupta@gmail.com",
    balance: 98546,
    accountNo: 113
})

const user4 = new User({
    name: "Akshat Sharma",
    email: "Akshatsharma@gmail.com",
    balance: 184654,
    accountNo: 114
})

const user5 = new User({
    name: "Preeta",
    email: "Preeta@gmail.com",
    balance: 8458,
    accountNo: 115
})

const user6 = new User({
    name: "Karishma Singh",
    email: "KarishmaSingh@gmail.com",
    balance: 45445,
    accountNo: 116
})

const user7 = new User({
    name: "RitikRaj",
    email: "RitikRaj@gmail.com",
    balance: 1500,
    accountNo: 117
})
const user8 = new User({
    name: "Yash Jain",
    email: "yashjain@gmail.com",
    balance: 25000,
    accountNo:118

})
const user9 = new User({
    name: "Ayush Gupta",
    email: "ayushgupta@gmail.com",
    balance: 55000,
    accountNo:119
     
})
const user10 = new User({
    name: "Mehul Shrimal",
    email: "shrimalmehul12@gmail.com",
    balance: 11500,
    accountNo:120

})
const userArray = [user1, user2, user3, user4, user5, user6,user7,user8,user9,user10];


var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();
let day = today.toLocaleDateString("en-US", options);
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
// ---------x--------Date-------x---------



const history = [];
app.get("/index",(req,res)=>{
    res.render("index");
})
app.get("/",(req,res)=>{
    res.render("index");
    res.send("cannot fetch file");
})


app.get("/history",(req,res)=>{
    
    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })
        } else {
            res.render('history', {
                history : history,
                balance : foundUsers[0].balance 
            })
        }
    } )
})

app.get("/transfer",(req,res)=>{
    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })
        } else {
            res.render('transfer', {
                users : foundUsers,
                balance : foundUsers.balance 
            })
        }
    } )

})

app.get("/users",(req,res)=>{
    User.find({},(err,foundUsers)=>{
        if(foundUsers.length === 0){
            User.insertMany(userArray,(err)=>{

            })
            res.redirect('users');
        }else{
            res.render('users',{
                users : foundUsers,
                balance : foundUsers[0].balance
            })
        }
    })

})
app.post("/index",(req,res)=>{
    amount = Number(req.body.amount);

    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })
        } else {
            
            if(amount > foundUsers[7].balance) {
                alert('failed')
                res.redirect("/transfer");
            }

            else {
                foundUsers[7].balance -= amount;

                foundUsers[7].save();

            User.findById(req.body.select, (err, found) => {
                found.balance += amount;
                found.save();
                console.log(found.balance)
                history.push({
                    sender : foundUsers[7].name,
                    receiver : found.name,
                    amount : amount,
                    date :day+' '+time
                })
            })

            alert('Transaction successful')
            res.render("index", {
                balance : foundUsers[7].balance
            })
            }

        }
    } )

})
app.listen(port,()=>{
    console.log(`application started successfully at port ${port} `)
});



