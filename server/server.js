const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false})); // 이거 추가 안하면 req.body가 텅텅빔 이유는 구글링 해보자
// app.use(express.static( path.join(__dirname, '../todo/build') ))

let db;
const url = 'mongodb+srv://dytjq67:qwer1234@cluster0.tvhvf.mongodb.net/todolist?retryWrites=true&w=majority';
const  MongoClient  = require('mongodb');



MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if(err) {
        return console.log('error')
    }
    db = client.db('todoapp');

    app.listen(8080);
})

// app.get('/', function(req, res) {

// })

// app.get('*', function(req, res) {  // react router대처
//     res.sendFile( path.join(__dirname, '../todo/build/index.html') ) 

// })

app.get('/list', (req, res) => {
    db.collection('post').find().toArray(function(err, result){
        console.log(result)
        res.status(200).json(result)
    })
})

app.post('/add', function(req, res) {
    db.collection('counter').findOne({name : '게시물갯수'}, (err, result) => {
        let totalpost = result.totalpost;

        db.collection('post').insertOne({ _id : totalpost + 1, name : req.body.data.title }, (err, result) => {
            let title = JSON.stringify(req.body.data.title)
            res.send(title)
            console.log(title + '저장완료.')

            db.collection('counter').updateOne({name: '게시물갯수'}, {$inc : { totalpost : 1 } }, (err, result) => {
                 if(err) {return console.log('error')}
            })
        })
    })
})

app.delete('/delete', function(req, res) {
    db.collection('post').deleteOne({ _id : parseInt(req.body.id) }, (err, result) => {
        if(err) {
            console.log('err')
        } 
        console.log(req.body.id + "삭제완료")
        res.send(result)

        db.collection('counter').updateOne({name : '게시물갯수'}, {$inc : { totalpost : -1 } },  (err, result) => {
            if(err) {return console.log('error')}
        })
    })
})