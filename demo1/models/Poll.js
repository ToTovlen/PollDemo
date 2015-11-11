/**
 * Created by vlen on 2015/10/26.
 */
var mongoose=require('mongoose');
var voteSchema=new mongoose.Schema({ip:'String'});
var choiceSchema=new mongoose.Schema({
    text:'String',
    votes:[voteSchema]
});
exports.PollSchema=new mongoose.Schema({
    question:{type:"String",required:true},
    choices:[choiceSchema]
})