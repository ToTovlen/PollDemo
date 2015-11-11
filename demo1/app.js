var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');

var db=mongoose.createConnection('localhost','pollsapp');
var PollSchema=require('./models/Poll.js').PollSchema;
var Poll=db.model('polls',PollSchema);


var app = express();
var http=require('http').createServer(app);
var io=require('socket.io').listen(http);

http.listen(3000);


var routes = require('./routes/index');
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//socket.io ¼àÌý
io.sockets.on('connection',function(socket){
    console.log("connection socket.io .");
    var address = socket.handshake.address;
    socket.on('send:vote',function(data){
        var pollObj;
        Poll.findById(data.poll_id,'',{lean:true},function(error,poll){
            if(poll){
                var choiceObj;
                for(c in poll.choices){
                    var choice=poll.choices[c];

                    if(choice._id==data.choice){
                        choiceObj=choice;
                        break;
                    }
                }
                if(choiceObj){
                    choiceObj.votes.push({ip:address});
                    console.log( socket.handshake.address);
                    Poll.findByIdAndUpdate(data.poll_id,poll,function(error,doc){
                        if(error||!doc){
                            throw 'Error';
                        }else{ }
                    });
                    console.log(poll);

                    var userVoted=false,userChoice,totalVotes="0";
                    for(c in poll.choices){
                        var choice=poll.choices[c];
                        for(v in choice.votes){
                            var vote=choice.votes[v];
                            totalVotes++;
                            if(vote.ip===address){
                                userVoted=true;
                                userChoice={_id:choice._id,text:choice.text};
                            }
                        }
                    }
                    poll.userVoted=userVoted;
                    poll.userChoice=userChoice;
                    poll.totalVotes=totalVotes;

                    socket.emit('vote',poll);
                }
            }else{
                res.json({error:error});
            }
        });



    });
});

module.exports = app;
