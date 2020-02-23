// var Routes = require('./routes')
var mongoose = require('mongoose')
var MongoClient = require("mongodb").MongoClient;
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var shortid = require('shortid');
var ws = require('nodejs-websocket')
const history = require('connect-history-api-fallback');

const express = require('express')
var app = express(); // define our app using express

var url = "mongodb://localhost:27017/markdown";

app.use(history());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded());

// 配置跨域请求
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// 数据库插入操作
app.post('/eassy', function(req, res) {
    console.log("接收到请求")
    console.log(req.body)
    var url = "mongodb://localhost:27017/markdown";
    let id = shortid.generate()
    req.body.id = id
    MongoClient.connect(url, function(err, client) {
        //client参数就是连接成功之后的mongoclient(个人理解为数据库客户端)
        if (err) {
            console.log("数据库连接失败");
            return;
        }
        console.log("数据库连接成功");
        //3.0新写法
        var db = client.db("markdown");
        db.collection("workdaily").insertOne(req.body, function(err, result) {
            if (err) {
                res.send("插入数据失败");
                console.log("插入数据失败")
                return;
            } else {
                res.send({
                    id,
                })
                console.log("插入数据成功", id)
            }
        })
    })
})

// 数据库读取操作
app.get('/eassy', function(req, res) {
    console.log('接收到GET请求')
    var query = req.query
    console.log(query, 'query')
    var url = "mongodb://localhost:27017/markdown";
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            console.log("数据库连接失败");
            return;
        }
        console.log("数据库连接成功");
        //3.0新写法
        var db = client.db("markdown");
        db.collection("workdaily").find({ id: query.id }).toArray().then(result => {
            console.log(result)
            res.send(result)
        })
    });
})

app.get('/blogTable', (req, res) => {
    var url = "mongodb://localhost:27017/markdown";
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log("数据库连接失败");
            return;
        }
        var db = client.db("markdown");
        db.collection("workdaily").find().toArray().then(result => {
            console.log('查询成功')
            res.send(result)
        })
    })
})


console.log('成功运行')

app.listen('8087')
console.log('程序运行在8087端口')