var express=require('express'),
 path = require('path'),
bodyParser = require('body-parser'),
ejs=require('ejs'),
mongoose=require('mongoose'),
User=require('./model.js'),
methodOverride=require('method-override');
var app=express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

var url='mongodb://localhost/myData';
mongoose.connect(url,{useUnifiedTopology: true,useNewUrlParser:true}).then(()=>{
    console.log("DataBase Connected");
});

// User.remove({},function(err){
//     if(err) console.log(err);
// })
app.get('/',function(req,res){

    User.find({},function(err,data){
        if(data){
            console.log(data);
            return res.render('Homepage',{User:data});
            
        }
        else if(!data){
            return res.redirect('/add');
        }
    });
    
});
app.get('/AllView',function(req,res){
    User.find({},function(err,data){
        if(err) console.log(err);
        else{
           return  res.render("data",{data:data});
        }
    })
    
})
var error='';
app.get('/add',function(req,res){

    res.render('AddContact');
});
app.post('/add',function(req,res){
    User.findOne({Phoneno:req.body.phoneno},function(err,data){
        if(data){
            error="Phone Number Already Exist!"
            res.render('AddContact',{error:error});
        }
        else if(err) console.log(err);
        if(!data){
            User({
                Email:req.body.email,
                Name:req.body.name,
                DOB:req.body.DOB,
                Phoneno:req.body.phoneno
            }).save((err,data)=>{
                if(err) console.log(err);
                else{
                    console.log("Saved successfully");
                    res.redirect('/');
                }
            })
        }
    });
})

app.get('/details/:id',function(req,res){
    var id=req.params.id;
    User.findOne({_id:id},function(err,data){
        if(data){
            return res.render('details',{data:data});
        }
        if(err) console.log(err);
    })
})

app.get('/edit/:id',function(req,res){
    var id=req.params.id;
    User.findOne({_id:id},function(err,data){
        if(data){
            return res.render('edit',{data:data});
        }
        if(err) console.log(err);
    })
})
app.put('/edit/:id',function(req,res){
    // User.findOne({Phoneno:req.body.phoneno},function(err,data){
    //     if(data){
    //         error="Phone Number Already Exist!"
    //         res.render('edit',{error:error},{data:req.body});
    //     }
    //     else if(err) console.log(err);
    var id=req.params.id;
    var newRecord={
        Name:req.body.name,
        Email:req.body.email,
        DOB:req.body.DOB,
        Phoneno:req.body.phoneno
    }
    User.findByIdAndUpdate(id,newRecord,function(err,updateData){
        if(err) console.log(err);
        else{
            res.redirect('/');
        }
    })
})
app.get('/delete/:id',function(req,res){
    var id=req.params.id;
    User.findByIdAndDelete(id,function(err){
        if(err) console.log(err);
        else{
            console.log("Deleted Contact");
            return res.redirect('/');
        }
    })
})
app.listen(process.env.PORT || 8080, process.env.ID, function(req,res){
    console.log("Server started...");
});