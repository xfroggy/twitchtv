$("document").ready(function(){
    
const placeholderLogo = "http://www.fillmurray.com/400/400"; // logo if user has no logo
var twitchUsers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404", "brunofin", "test_channel"];

//default page load will show 'all' users
var show = "all";
$('#userRow').empty();
twitchUsers.forEach(buildPageOfUsers);

//Buttons to select all / online /offline
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

//bulk of program - builds page and links depending on all / online / offline
function buildPageOfUsers(user) {
    var state = true; 

    //First API call - then sends the data to a callback function which checks to see if there is an error message (ie. user doesn't exist currently)
    callAPI("users", checkMessage);

    //calls API taking arguments for url and which callback function to call for processing returned data
    function callAPI(callURL, callback) {
        $.getJSON("https://wind-bow.glitch.me/twitch-api/" 
        + callURL 
        + "/" 
        + user 
        + "?callback=?").done(callback); 
    } 

    //after 1st API call, data is processed here to verify if an error message exists - if so, user does not exist or no longer exists
    function checkMessage(result){ 
        if (result.message === undefined) {
            
        //call 2nd api to check if streaming
        callAPI("streams", streamStatus); 
        } else {
        
        // not an active user
        // build row if requesting 'all' or offline
        if (show =="all" || show =="offline") buildRow(result.message, false, placeholderLogo);
        }
    }
    
    //after 2nd API call, data is processed here to verify if existing user is streaming 
    function streamStatus(result){
        if (result.stream === null) {
        state = false;// user exists but is currently offline
        } 
  
        //call to 3rd API
        callAPI("channels", GetUserData);
    }
    
    // after 3rd API data is processed here, to be used for building page output  
    function GetUserData(result) {
        if (!state) { //user is offline
            if (result.logo === null) result.logo = placeholderLogo; // user has no logo
            if (show == "all" || show == "offline")buildRow(undefined, state, result.logo, result.url)
        } //builds row for user,if 'all' or offline
        else 
            {//builds page for user if 'all' or online
            if (show == "all" || show == "online")  buildRow(result.status, state, result.logo, result.url, result.game);
            }
    }
    
    // builds row as output to page for user with status 
    function buildRow(status, state, logo, url, game, show){

        $('#userRow').append("<tr><td class=\"vert-align\"><img  class=\"logo\" src='"
            +logo
            +"'></td><td class=\"vert-align\">"
            +statusLink(state, game, status, url, user)
            );
    }

    //checks to see if links should be built (ie user has page or is streaming)
    function statusLink(state, game, status, url, user) {

        if (!state && status=== undefined) { //user exists but is not streaming - ex. freecodecamp
        return "<a href=\""
        +url
        +"\" target=\"_blank\">"
        +user
        +"</a></td><td class=\"vert-align\">offline</td>";
        }
  
        else if (!state && status !== undefined) { // user either doesn't exist or no longer exists - ex. brunofin comster404
        return user
        +"</td><td class=\"vert-align\">"
        +status
        +"</td>";
        } 
      
        else { //user exists and is streaming
        return "<a href=\""
        +url
        +"\" target=\"_blank\">"
        +user
        +"</a></td><td class=\"vert-align\"><a href=\""
        +url
        +"\" target=\"_blank\">"
        +game
        +"</a><br>"
        +status
        +"</td>";
        }
    }

}//end buildPageOfUsers function

});