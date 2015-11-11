var express = require('express');
var mongoose=require('mongoose');
var router = express.Router();

var db=mongoose.createConnection('localhost','pollsapp');
var PollSchema=require('../models/Poll.js').PollSchema;
var Poll=db.model('polls',PollSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('send . /polls/polls');
  res.render('index', { title: 'Polls' });
});

/* Polls List*/
router.get('/polls/polls', function (req,res) {
  Poll.find({},'question',function(error,polls){
    console.log('send . /polls/polls');
    res.json(polls);
  });
});
router.get('/polls/:id',function(req,res){
  var pollId=req.params.id;
  Poll.findById(pollId,'',{lean:true},function(error,poll){
    if(poll){
      var userVoted=false,userChoice,totalVotes="0";
      for(c in poll.choices){
        var choice=poll.choices[c];
        for(v in choice.votes){
          var vote=choice.votes[v];
          totalVotes++;
          if(vote.ip===(req.header('x-forwarded-for')||req.ip)){
            userVoted=true;
            userChoice={_id:choice._id,text:choice.text};
          }
        }
      }
      poll.userVoted=userVoted;
      poll.userChoice=userChoice;
      poll.totalVotes=totalVotes;
      res.json(poll);
    }else{
      res.json({error:error});
    }
  })
});

var create=function(req,res){
  var reqBody=req.body,
      choices=reqBody.choices,
      pollObj={question:reqBody.question,choices:choices};
  var poll=new Poll(pollObj);
  poll.save(function(error,doc){
    if(error||!doc){
      throw 'Error';
    }else{
      res.json(poll);
    }
  });
}

router.post('/polls',create);




module.exports = router;
