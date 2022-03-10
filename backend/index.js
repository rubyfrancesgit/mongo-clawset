const express = require('express'); // includes express js
const app = express();  // vaiable for express
const bodyParser = require('body-parser'); // includes body parser
const mongoose = require('mongoose'); // includes mongoose
const bcrypt = require('bcryptjs'); // includes bcrypt
const cors = require('cors');
const config = require('./config.json');
const Product = require('./models/product');
const User = require('./models/user');

const port = 5000

app.use((req, res, next) => {
    console.log(`${req.method} request ${req.url}`);
    next();
});

app.use(bodyParser.json()); // calling bodyParser method 
app.use(bodyParser.urlencoded({extended:false})); // preventing url from being parsed

app.use(cors()); // calling cors method with express

app.get('/', (req, res) => res.send('Hello! I am from the backend'));

mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@cluster0.${config.MONGO_CLUSTER_NAME}.mongodb.net/${config.MONGO_DBNAME}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("DB connected"))
    .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
    }); 

app.listen(port, () => console.log(`My full stack application is listening on port ${port}`))

// post a product to the database
app.post('/addProduct', (req, res) => {
    const dbProduct = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
        image_url: req.body.img_url
    });

    // save to the database & notify the user
    dbProduct.save().then(result => {
        res.send(result);
    })
    .catch(err => res.send(err))
}); // post product

// update product
app.patch('/updateProduct/:id', (req,res) => {
    const idParam = req.params.id;
    Product.findById(idParam, (err,product) => {
        const updatedProduct = {
          name : req.body.name,
          price : req.body.price,
          image_url:req.body.image_url
        }
        Product.updateOne({_id:idParam}, updatedProduct).
        then(result => {
          res.send(result);
        }).catch(err => res.send(err));
    })
}); //update product

// Delete Product from db
app.delete('/deleteProduct/:id',(req,res)=>{
    const idParam = req.params.id;
    Product.findOne({_id:idParam}, (err,product)=>{
      if(product){
        Product.deleteOne({_id:idParam},err=>{
            console.log('deleted on backend request');
      });
      } else {
        alert('not found');
      }
    }).catch(err=> res.send(err));
});//delete product

//Register User
app.post('/registerUser',(req,res)=>{
    //checking if user is in the db already
    User.findOne({username:req.body.username},(err,userResult)=>{
      if (userResult){
        res.send('username taken already. Please try another name');
      } else {
        const hash = bcrypt.hashSync(req.body.password);//encrypt user Password
        const user = new User({
          _id: new mongoose.Types.ObjectId,
          username: req.body.username,
          email : req.body.email,
          password : hash
        });
        //save to dtabase and notify userResult
        user.save().then(result=>{
          res.send(result);
        }).catch(err=>res.send(err));
      }
    })
})// end of register user

// get all products from the database
app.get('/allProductsFromDB', (req, res) => {
    Product.find().then(result => {
        res.send(result);
    })
}); // get
