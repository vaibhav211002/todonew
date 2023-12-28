var express = require('express');
var app = express();
const passport = require('passport');
const localStrategy = require('passport-local');
const usersmodel = require('./users');
const tasksmodel = require('./tasks');
passport.use(new localStrategy(usersmodel.authenticate()))
const methodoverride = require('method-override');

app.use(methodoverride('_method'))


/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('signup');
});

app.get('/test', function(req, res, next) {
  res.send('hiii');
});

app.delete('/home/:id',isloggedin,async (req,res)=>{
  const {id} = req.params
  console.log(id);
  await tasksmodel.findByIdAndDelete(id);
  res.redirect('/home')
})


app.post('/home/:id', isloggedin, async function(req, res) {
  const { id } = req.params;
    // Use await to wait for the findOneAndUpdate to complete
    const updatedTask = await tasksmodel.findOneAndUpdate(
      { _id: id }, // Query condition to find the document
      { $set: { completed: true } }, // Update the 'completed' field to true
      { new: true, useFindAndModify: false } // Options: new returns the updated document, useFindAndModify set to false to use native findOneAndUpdate
    );

    res.redirect('/home')

});




app.post('/signup', function(req, res, next) {
  const {username,fullname,email,password} = req.body;
  // console.log(req.body);
    const userdata = new usersmodel({
      username,
      fullname,
      email,
    })
    console.log(userdata);
    usersmodel.register(userdata,req.body.password)
    .then(function(){
        passport.authenticate('local')(req,res,function(){
            console.log(userdata);
            res.redirect('/home')
        })
    })
    // console.log(userdata);


});



app.get('/home', isloggedin,async function(req, res, next) {
  const user = await usersmodel.findOne({
    username:req.session.passport.user
}).populate('tasks')
const count = user.tasks.length;
console.log(count);

console.log(user);
res.render('home',{user})
});



app.get('/addtask', isloggedin,async function(req, res, next) {
  // console.log(req.body);
  const user = await usersmodel.findOne({
    username:req.session.passport.user
}).populate('tasks')

  res.render('addtask',{user})
});



app.post('/addtask', isloggedin,async function(req, res, next) {
  const text = req.body.detail;
  const logger = await usersmodel.findOne({
    username:req.session.passport.user
  })
  // console.log(logger);
  

  // console.log(text);
  const postdata = await tasksmodel.create({
      postText : text,
      user : logger._id
    })
  console.log(postdata);
  

  logger.tasks.push(postdata._id)
  await logger.save()
  res.redirect('/home')


});


app.get('/login',function(req, res, next) {
  const content=req.flash('error');
  console.log(content);
  res.render('login',{content})
});

app.post('/login',passport.authenticate('local',{
  successRedirect:'/home',
  failureRedirect:'/login',
  failureFlash:true,
  successFlash:true
}),(req,res)=>{
  console.log('User successfully authenticated:', req.user);

})




app.get('/logout',(req,res)=>{
  req.logout(function(err){
      if(err) {
          return next(err)
      }
      res.redirect('/')
  })
})

function isloggedin(req,res,next){
  console.log("HI");
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login')
}
module.exports = app;
