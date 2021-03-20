const mongoose = require('mongoose')
const express = require('express')
const path = require('path')
const app = express()
app.use(express.urlencoded({ extended: true }));
var auth = false
const url = `mongodb+srv://glebClusterUser:glebClusterUserPassword@cluster0.fvfru.mongodb.net/comments?retryWrites=true&w=majority`;
var options = {
    root: path.join(__dirname, 'views'),
}

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}

mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

const CommentSchema = new mongoose.Schema({
    name: String,
    content:String   
});

const CommenttModel = mongoose.model('CommenttModel', CommentSchema);
    
app.get('/', (req, res)=>{
    //получение всех записей
    let query = CommenttModel.find({}).select(['name', 'content']);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    query.exec( (err, allComments) => {
        if (err){
            return
        }
        return res.json(allComments)
    });
    
})


app.get('/add', async (req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    //создание записи
    if(req.query.name === null || req.query.content === null){
        return res.send(`product not found`)
    } else if(req.query.name !== null || req.query.content !== null) {
        await new CommenttModel({ name: req.query.name, content: req.query.content }).save(function (err) {
            if(err){
                return res.send(`product not found`)
            } else {
                res.redirect('/')
            }
        })
    }
})

app.get('/delete', async (req, res)=>{
    //удаление записи
    if(req.query.name === undefined){
        res.send(`product not found`)
        return
    } else if(req.query.name !== undefined) {
       
        await CommenttModel.deleteOne({ name: req.query.name  })
        res.redirect('/')
        
    }
})



app.get('/edit', async(req, res)=>{
    //изменение записи
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    if(req.query.name === undefined || req.query.content === undefined){
        res.send(`product not found`)
        return
    }else if(req.query.name !== undefined || req.query.content !== undefined){
    const comments = await CommenttModel.updateOne({ name: req.query.name }, 
    { 
        "content": req.query.content
    })
    return res.redirect('/')
}
})
    


app.listen(4000)