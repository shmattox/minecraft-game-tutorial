/*
*       Variables
*       localTutorials          =  JSON string unique to each page
*       tutorialProgress      =  The 'xp' a user has gained by answering questions
*       userScore               = Users lvl = level and xp = experience ( visualized as 'diamonds')
*       
*
*/

//Start Tutorial
jQuery(document).ready(function(){

        //get username if none exists not currently working.
        var usernameTutorial = [
                {
                    "content": "Welcome! <span class='sub-text'>Enter your name to begin</span><input id='mc_username' name='mcusername' type='text'placeholder='your name'/>",
                    "target": "#one_xp"
                }
        ];
        
        //************************         Testing Only       *************************//
        
        //Define Local Tutorial Data ( To be done on each page uniquely )
        var localTutorials = [
                {
                    "content": "Alright! <span class='sub-text'>how'd you find us</span><input id='' name='' type='text'placeholder='your answer here'/>",
                    "target": "#one_xp"
                },
                {
                    "content": "What <span class='sub-text'>is the first rule?</span><input id='' name='' type='text'placeholder='your answer here'/>",
                    "target": "#two_xp"
                },
                {
                    "content": "Well done.<br/><span class='sub-text'>Play our site to learn and get rewards</span><label><input type='radio' name='boolean' value='true'/>True</label><label><input type='radio' name='boolean' value='false'/>False</label> ",
                    "target": "#three_xp",
                    "answer":"true"
                },
                {
                    "content": "Every Level is a larger discount. <span class='sub-text'>Let's get started!!</span>",
                    "target": "#"
                }
        ];
        localStorage.setItem('currentTutorials', JSON.stringify(localTutorials));
                        
        //Define Current Tutorial Progress
        var tutorialProgress = 0;
        localStorage.setItem('tutorialProgress', JSON.stringify(tutorialProgress));
        
        //Define Current userScore
        var userScore = { 'lvl': 1, 'xp': 0 };
        localStorage.setItem('userScore', JSON.stringify(userScore));
        
        //***************************************************************************//
        
        
        //Get Current Tutorial Progress
        var currentProgress = getData('tutorialProgress');
        if( currentProgress != undefined ) {
                var currentProgress = 0;
                localStorage.setItem('tutorialProgress', JSON.stringify(currentProgress));
        }
        
        //Get Current user Score
        var userScores = getData('userScore');
        if( userScores != undefined ) {
                var userScore = { 'lvl': 1, 'xp': 0 };
                localStorage.setItem('userScore', JSON.stringify(userScore));
        }
        
        //Custom animation Timing in milliseconds
        animationTime = 500;
        animationTimeSlow = 200;
        
        //set session data for username to be used in leaderboard.
        currentName = localStorage.getItem("userName");
        
        //Retrieve the LVL and XP from storage
        var currentLvl = getLvl();
        var currentXp = getXp();
        
        //Get Total Tutorial Count
        var theTutorials = getData('currentTutorials');
        var totalXp = theTutorials.length;

        //Build Tutorial UI
        buildUi() ;
        
        //Start Tutorial
        setTutorial();
        
        //Start Current Tutorial
        function buildUi() {
        
                //Append UI Continer
                jQuery("#skinpreview").append("<div id='user_ui'></div>");
                
                //Print XP to layout
                diamonds(currentXp);
                
                //print lvl to layout
                jQuery("#user_ui").append("<div id='user_score'><span>" + currentLvl + "</span></div>");

        }
        function diamonds(usersXp) {
        
                jQuery(".user_xp").remove();
                for ( var i = 0; i < usersXp; i++ ) {
                      // build diamonds
                      jQuery("#user_ui").prepend("<div class='user_xp'></div>");
                }
                for ( var i = usersXp; i < totalXp; i++ ) {
                      // build gray diamonds
                      jQuery("#user_ui").prepend("<div class='user_xp' style='opacity:.1;'></div>");
                }
                
        }
        function level(level) {
        
                //Print Lvl to layout
                jQuery("#user_score span").html(level);
        
        }
        //Start Current Tutorial
        function setTutorial() {
                        
                //Set the current count
                var tutorialProgress = localStorage.getItem('tutorialProgress');
                if (tutorialProgress == totalXp){
                
                        //launch reward function
                        chatBubble("Congrats! <span class='sub-text'>You beat the first lvl!</span><br/> CODE: APEX10 ","#top");
                        
                } else if (currentName == undefined) {
                
                        //Grab  Tutorial Data
                        var currentTutorial = usernameTutorial[0].content;
                        var currentTarget = usernameTutorial[0].target;

                        //Build Chat Bubble
                        chatBubble(currentTutorial,currentTarget);
                        
                } else {
                
                        //Grab Current Tutorial Data
                        var currentTutorial = theTutorials[tutorialProgress].content;
                        var currentTarget = theTutorials[tutorialProgress].target;

                        //Build Chat Bubble
                        chatBubble(currentTutorial,currentTarget);
                        
                }
        }
        
        //Cleanup Chat Bubble and Progress to Next Tutorial
        function nextTutorial() {
                
                //Remove Old
                jQuery("#chat_bubble, #chat_bubble_mini").remove();
                
                //get count
                var currentProgress = localStorage.getItem('tutorialProgress');
                
                //Increase count
                var currentProgress = parseInt(currentProgress) + 1;
                if(currentProgress < ( parseInt(totalXp) + 1 )) {
                
                        //set current progress increment
                        localStorage.setItem('tutorialProgress', currentProgress);
                        
                        //Print New XP to layout
                        diamonds(currentProgress);
                
                } else if(currentProgress == ( parseInt(totalXp) + 1 )) {
                
                        //Level Up
                        var currentLvl = getLvl();
                        var newLvl = parseInt(currentLvl) + 1;
                        
                        //Print New Lvl to layout
                        level(newLvl);
                
                        //Update Printed XP UI Data
                        var newXp = getXp();
                        diamonds(newXp);
                      
                        //Rebuild Array for new Score
                        var newScore = new Object();
                        newScore.lvl = newLvl;
                        newScore.xp = newXp;
                        
                        //Save XP to Storage
                        localStorage.setItem('userScore', JSON.stringify(newScore));
                
                        //Reset Tutorial Progress
                        localStorage.setItem('tutorialProgress', 0);
                        
                        //set session data for username to be used in leaderboard.
                        currentName = localStorage.getItem("userName");
        
                        //Post data to mysql leaderboard
                        jQuery.post( "userInfo.php", { name: currentName, lvl: newLvl });
                }
        }
        
        //Smoothly Scroll to Target Location
        function smoothScroll(target) {
                jQuery('html, body').animate({
                        scrollTop: jQuery( jQuery.attr(target, 'href') ).offset().top
                }, animationTime);
                return false;
        }
        
        //Get Data Function for Lvl and userScore
        function getLvl(){
        
                //Get Current User Score Data
                var userScores = getData('userScore');
                
                //Increase Current User XP Data
                return userScores.lvl;
        
        }
        
        //Get Data Function for Xp and userScore
        function getXp(){
        
                //Get Current User Score Data
                var userScores = getData('userScore');
                
                //Increase Current User XP Data
                return userScores.xp;
        
        }
        
        //Generic Data Get Parser for Local Storage
        function getData(data){
        
                //Get Current User Score Data
                var retrievedItem = localStorage.getItem(data);
                
                //Return the parsed item
                return JSON.parse(retrievedItem);
        
        }
        
        //Build Chat Bubble
        function chatBubble(content,link){
        

                //Animate Chat Bubble
                jQuery("#chat_bubble_mini").delay( 800 ).animate({opacity:'1',top:'154px'}, animationTimeSlow);
                jQuery("#chat_bubble").delay( 1000 ).animate({opacity:'1',bottom:'415px'}, animationTimeSlow);
                
                //Next In the Tutorial
                jQuery("#chat_bubble input[type*='text']").keydown(function (e){
                        //If user hits enter inside of the input perform action
                        if(e.keyCode == 13){
                                var answerValue = jQuery("#chat_bubble input[type*='text']").val();
                                if(!answerValue) {
                                        return false;
                        }
                        nextTutorial();
                        setTutorial();
                        smoothScroll(this);     //Scroll to the next tutorial object
                    }
                }); 
                //Chat bubble events handler
                jQuery("#chat_bubble a").on("click", function(e){
                        e.preventDefault();
                
                        //check for content in a text input and vaidate only if exists
                        var inputExists = jQuery("#chat_bubble input").length;
                        if(inputExists < 0){
                                return;
                        } else if(inputExists > 0) {
                                //check for text input value equal to JSON string answer
                                if(jQuery("#chat_bubble input[type*='text']").length > 0){
                                        var answerValue = jQuery("#chat_bubble input[type*='text']").val();
                                        if(!answerValue) {
                                                return false;
                                        }
                                        
                                        //set session data for username to be used in leaderboard.
                                        localStorage.setItem("userName", answerValue);
                                
                                //check for radio input value equal to JSON string answer        
                                }else if(jQuery("#chat_bubble input:checked").length > 0){
                                        var answerValue = jQuery("#chat_bubble input:checked").val();
                                        var tutorialProgress = localStorage.getItem('tutorialProgress');
                                        var theAnswer = theTutorials[tutorialProgress].answer;
                                        if(answerValue != theAnswer){
                                                return false;
                                        }
                                } else {
                                        return false;
                                }
                        }
                        
                        nextTutorial();
                        setTutorial();
                        smoothScroll(this);     //Scroll to the next tutorial object
                
                });
        }
});







