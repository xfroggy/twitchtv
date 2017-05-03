$("document").ready(function(){
const placeholderLogo = "http://www.fillmurray.com/400/400";

var twitchUsers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404", "brunofin", "test_channel"];
var show = "all";
$('#userRow').empty();
twitchUsers.forEach(buildPageOfUsers);

$('#all').focus(function()
{
  show = "all";
  $('#userRow').empty();
 twitchUsers.forEach(buildPageOfUsers);
  
});

$('#online').focus(function()
{
  show = "online";
  $('#userRow').empty();
 twitchUsers.forEach(buildPageOfUsers);
  
});

$('#offline').focus(function()
{
  show = "offline";
  $('#userRow').empty();
 twitchUsers.forEach(buildPageOfUsers);
  
});

function buildPageOfUsers(user) {
var state = true; 
console.log("This is the buildPageOfUsers user:  "+ user);
//var testUser = "test_channel"; // using this to test different cases.  ESL_SC2 for online and streaming, freecodecamp for exists but offline, brunofin for doesn't exist, comster404 for used to exist but doesn't anymore.

//var state = true; // global (for now), meaning default is 'all', later I change this state depending on json call.

var streamsURL =  "https://wind-bow.glitch.me/twitch-api/streams/"+user+"?callback=?";
var usersURL = "https://wind-bow.glitch.me/twitch-api/users/"+user+"?callback=?";
var channelsURL = "https://wind-bow.glitch.me/twitch-api/channels/"+user+"?callback=?"

//Starts here with first API call - it's a users call, then sends the data to a callback function which will check to see if there is an error message (ie. doesn't exist currently)
callAPI("user", checkMessage);

  
  
function statusLink(state, game, status, url, user) {
  console.log("The status link says:  "+status + " and user is:  "+user);

  if (!state && status=== undefined) {return "<a href=\""+url+"\">"+user+"</a></td><td class=\"vert-align\">offline</td>"}//freecodecamp
  else if (!state && status !== undefined) {return user+"</td><td class=\"vert-align\">"+status+"</td>"} //burnofin comster404
  else {return "<a href=\""+url+"\">"+user+"</a></td><td class=\"vert-align\"><a href=\""+url+"\">"+game+"</a><br>"+status+"</td>"}
}
 
function buildRow(status, state, logo, url, game, show){
console.log("The buildRow status:  "+status+".   the buildRow state:  "+state+".  The url is:  "+url+" and the user is:  "+user);

$('#userRow').append("<tr><td class=\"vert-align\"><img  class=\"logo\" src='"+logo+"'></td><td class=\"vert-align\">"+statusLink(state, game, status, url, user));
} 
  

  
  
function GetUserData(result) {
  if (!state) { 
  console.log("This is the user state:  "+state+" (offline)" );
  console.log("This is the user url:  "+result.url);
   if (result.logo === null) result.logo = placeholderLogo; 
    console.log("This is the user logo link:  "+result.logo); 
   
    if (show=="all" || show =="offline")buildRow(undefined, state, result.logo, result.url)
  }
  else
    {
      console.log("This is the user state:  "+state+" (online)" );
  console.log("This is the user url:  "+result.url);
  console.log("This is the user logo link:  "+result.logo);
  console.log("This users game is:  "+result.game);
  console.log("This users is currently streaming:  "+result.status); 
    if (show == "all" || show =="online")  buildRow(result.status, state, result.logo, result.url, result.game);
    }
}

function streamStatus(result){
  if (result.stream === null) {
    
    state = false;
    console.log("This user exists, but is currently offline")
  } else {
  console.log("from streamsStatus call - this user exists and is streaming, will now call to get stream info ");};
  callAPI("channels", GetUserData);
}

//1st API call process - message y/n
function checkMessage(result){ 
  if (result.message === undefined) {
     console.log("no message - means user exists, still unsure if currently streaming or offline - will now do a streamStatus call to check...")
    //call 2nd api to check if streaming
    callAPI("streams", streamStatus); 
  } else {
    //yes - means not an active user
   console.log("The message:  "+result.message);
   
if (show =="all" || show =="offline") buildRow(result.message, false, placeholderLogo);
  };
 
};

//calls api can pass the url and which callback function to call and process data
function callAPI(callURL, callback) {
$.getJSON("https://wind-bow.glitch.me/twitch-api/"
    +callURL
    +"/"
    +user
    +"?callback=?").done(callback); 
  // for debugging, to track when and if call is successful
  console.log("json call worked"); 
}; 

function getURL(result){
  console.log("The getURL function says the url is:  "+result.url);
}
}//end buildPageOfUsers function

//testOutput(usersURL);
function testOutput(users) {
  $.getJSON(users).done(function(data) {
     console.log(data);
  });
}




});