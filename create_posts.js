


const posts_model = require("./Models/postsModel");

var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/Infinidreams';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var awesome_instance = new posts_model ({ 
    title: 'First', 
    tags: ['React', 'Expresss'], 
    summary:'',
    body: '',
});

awesome_instance.save(function (err) {
    if (err) {
        console.log(err);
        return err;
    }
    else {console.log('done')}
});
console.log(awesome_instance);

