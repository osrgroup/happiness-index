import loadGAPIs from '../GAPI';
import Account from '../Account.jsx';
import $script from 'scriptjs';
$script('https://apis.google.com/js/client.js?onload=loadPlatform', 'client');
window.loadPlatform = function () {
	$script('https://apis.google.com/js/platform.js?onload=init', 'google-api');
}

var scopes = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
    var client_id = '728995435943-tge9f7ffanpd5v670hgctir9u0lhglv2.apps.googleusercontent.com';
    var teaching_term = 2; //FIXME
    var current_sprint = -1;
    
    var project_id;
    
    var full_name;
    var current_user_email;
    
    var happiness_chart;
    
    var account;
	    
    function signin(mode, callback) {
      	 if (typeof current_user_email == 'undefined'){
      		 gapi.auth.authorize({client_id: client_id,scope: scopes, immediate: mode},callback);
      	 }else{
      		 gapi.auth.authorize({client_id: client_id,scope: scopes, immediate: mode,authuser: -1, user_id:current_user_email},callback);
      	 }
     }
   
   function signout(){
   	window.open("https://accounts.google.com/logout");
   }
   
   function handleAuth() {
	   
		  var request = gapi.client.oauth2.userinfo.get().execute(function(resp) {
		    if (!resp.code) {
		      current_user_name = resp.given_name;
		      current_user_id = resp.id;
		      current_user_email = resp.email;
		      gapi.client.happiness.getCurrentUser().execute(function(resp) {
		         	 if (!resp.code) {
		         		 if (resp.type == "ADMIN"){
		         			$("#adminBtn").attr('href','admin.html?,'+current_user_email);
			         		$("#adminBtn").removeClass("hidden");
		         		 }
		         		else
	         			 {
		         			$("#adminBtn").addClass("hidden");
	         			 }
		         	 }
		          });
		      
		      document.getElementById('currentUserName').innerHTML = resp.name;
		      full_name = resp.name;
		      document.getElementById('currentUserEmail').innerHTML = resp.email;
		      document.getElementById('currentUserPicture').src = resp.picture;
		      $('#navAccount').show();
		      $('#navSignin').hide();
		      // INIT
		      vex.defaultOptions.className = 'vex-theme-os';
		      
		      setJumbotron();
		      
		      fillUserList();
		      
		      
		      
		    }
		    else {
		    	 $('#navAccount').hide();
		    }
		  });
		}
   
   window.init = function () {
	   $('#navAccount').hide();
//        	$('#selectHappiness').quickselect({
//				activeButtonClass: 'btn-primary active',
//				breakOutAll: true,
//				buttonClass: 'btn btn-default',
//				selectDefaultText: '3',
//				wrapperClass: 'btn-group'
//			});
        	
        	$( "#selectHappiness" ).selectmenu();
        	$( "#selectHappiness" ).selectmenu( "refresh" );
        	
        	var query = window.location.search;
      	  // Skip the leading ?, which should always be there,
      	  // but be careful anyway
      	  if (query.substring(0, 1) == '?') {
      	    query = query.substring(1);
      	  }
      	  var data = query.split(',');
      	  for (var i = 0; (i < data.length); i++) {
      	    data[i] = unescape(data[i]);
      	  }
      	  project_id = data[0];
      	  current_user_email = data[1];

        	
        	var query = window.location.search;
        	  // Skip the leading ?, which should always be there,
        	  // but be careful anyway
        	  if (query.substring(0, 1) == '?') {
        	    query = query.substring(1);
        	  }
        	  var data = query.split(',');
        	  for (i = 0; (i < data.length); i++) {
        	    data[i] = unescape(data[i]);
        	  }
        	  project_id = data[0];

  		  	loadGAPIs(setupUI).then(
  					function (accountModule) {
  						account = accountModule;
  					}
  			);
  		  	
  		  document.getElementById('navBtnSigninGoogle').onclick = function () {
      		account.changeAccount();
      	};
        	  
//        	var apisToLoad;
//        	 var callback = function() {
//        	   if (--apisToLoad == 0) {
//        		   signin(true,handleAuth);
//        		  
//        	     //Load project settings
//        	     
//        	   }
//        	   
//        	}
//        	  
//        	apisToLoad = 2;
//        	//Parameters are APIName,APIVersion,CallBack function,API Root 
//        	//gapi.client.load('qdacity', 'v1', callback, 'https://localhost:8888/_ah/api');
//        	gapi.client.load('happiness', 'v1', callback, 'https://uni1-happy.appspot.com/_ah/api');
//        	gapi.client.load('oauth2','v2',callback);

			
			document.getElementById('submitHappinessBtn').onclick = function() {
                submitHappiness();
            }
			
			document.getElementById('submitStandupBtn').onclick = function() {
                submitStandup();
            }
			
			document.getElementById('standupDoneBtn').onclick = function() {
				showStandupModal("Done-Field","#standupDoneTxt");
            }
			
			document.getElementById('standupPlanBtn').onclick = function() {
				showStandupModal("Plan-Field","#standupPlanTxt");
            }
			
			document.getElementById('standupChallengesBtn').onclick = function() {
				showStandupModal("Challenges-Field","#standupChallengesTxt");
            }
			
        }
        
        function setupUI(){
        	if (account.isSignedIn()) {
        		$('#navAccount').show();
        		$('#navSignin').hide();
        		$('#welcomeName').html(account.getProfile().getGivenName());
        		$('#welcome').removeClass('hidden');
        		

		      
		      vex.defaultOptions.className = 'vex-theme-os';
		      
//				      gapi.client.happiness.getCurrentUser().execute(function(resp) {
//				         	 if (!resp.code) {
//				         		 if (resp.type == "ADMIN"){
//				         			$("#adminBtn").attr('href','admin.html?,'+current_user_email);
//					         		$("#adminBtn").removeClass("hidden");
//				         		 }
//				         		else
//			         			 {
//				         			$("#adminBtn").addClass("hidden");
//			         			 }
//				         	 }
//				          });
				      
				      
				      setJumbotron();
				      
				      fillUserList();
			

        	} else {
        		$('#navAccount').hide();
        	}
        }
        
        $(document).ready( function () {
        	//window.alert("test");
        	$( "#newProjectForm" ).on( "submit",function(event) {
        		event.preventDefault();	
        		createNewProject();
              });
        	
        });

        function createNewProject(){
        	
        	var requestData = {};
            requestData.project = 0;
            
            gapi.client.qdacity.codesystem.insertCodeSystem(requestData).execute(function(resp) {
                    if (!resp.code) {
                    	
                    	var requestData2 = {};
                        requestData2.codesystemID = resp.id;
                        requestData2.maxCodingID = 0;
                        requestData2.name = document.getElementById("newProjectName" ).value;
                        gapi.client.qdacity.project.insertProject(requestData2).execute(function(resp2) {
                                if (!resp2.code) {
                                	requestData.id = resp.id;
                                	requestData.project = resp2.id
                                	
                                	gapi.client.qdacity.codesystem.updateCodeSystem(requestData).execute(function(resp3) {
                                        if (!resp3.code) {
                                        	addUserToUserList(requestData.project, requestData2.name);
                                        }
                                	});
                                }
                                else{
                                	window.alert(resp.code);
                                }
                        });
                    }
                    else{
                    	window.alert(resp.code);
                    }
            });
        }

        function addProjectToUser(){
        	
        }

        function fillUserList(){
        	$("#user-list").html("");
        	gapi.client.happiness.listUser({'projectID': project_id}).execute(function(resp) {
           	 if (!resp.code) {
           		resp.items = resp.items || [];
                
                for (var i=0;i<resp.items.length;i++) {
                        var user_id = resp.items[i].id;
                        var given_name = resp.items[i].givenName;
                        var sur_name = resp.items[i].surName;
                        
                  		addUserToUserList(user_id, given_name + " " + sur_name);
                }
                var options = {
                	  valueNames: [ 'user_name', 'user_id' ]
                };

                var projectList = new List('user-section', options);

                
           	 }
           
           	 else{
           		 window.alert(resp.code)
           	}
           	 
            });
        	
        }

        function createAreaChart(){
        	
        	gapi.client.happiness.listHapiness({'teachingTerm' : teaching_term ,'projectId' : project_id}).execute(function(resp){
        		if (!resp.code) {
        			var dataArray =  []; 
        			var keylabels = [];
    				for (var i=0;i<resp.items.length;i++) {
    					var userName = resp.items[i].userName;
    					
    					var dataPoint = {};
    					dataPoint[userName] = resp.items[i].happiness.toString() ;
    					dataPoint['year'] = resp.items[i].sprint+ "";
    					dataArray.push(dataPoint);
   
			            if ($.inArray(resp.items[i].userName, keylabels) == -1){
			            	keylabels.push(resp.items[i].userName);
			            }
    			        
    				}
    				
    				if (typeof happiness_chart == 'undefined'){
    				
    	        	happiness_chart = Morris.Line({
    			        element: 'happiness-area-chart',
    			        data: 
    			        dataArray,
    			        xLabels: "year",
    			        xkey: 'year',
    			        ykeys: keylabels,
    			        ymin: -3,
    			        ymax: 3,
    			        yLabelFormat: function(y){return y != Math.round(y)?'':y;},
    			        gridTextSize: 13,
    			        labels: keylabels,
    			        xLabelFormat: function (x) { return x.getFullYear() - 1900; },    			        
    			        pointSize: 3,
    			        hideHover: 'always',
    			        resize: true
    			    });
    				} else {
    					happiness_chart.setData(dataArray);
    				}
        		}
        		
        	});
        }

        function addUserToUserList(userID, userName){

        	var html = '<li>';

        	html += '<span class="user_name">'+userName+'</span>';
        	html += '<span class="user_id hidden">'+userID;
        	html += '</span>';
        	html += '</li>';
        	$("#user-list").append(html);
        	
        	
        }
        
        function setJumbotron(){
        	
        	gapi.client.happiness.getProject({'id' : project_id}).execute(function(resp){ // FIXME teachingTerm not fixed
        		if (!resp.code) {
        			teaching_term = resp.teachingTerm;
        			gapi.client.happiness.getCurrentSprint({'teachingTerm' : resp.teachingTerm}).execute(function(resp){ // FIXME teachingTerm not fixed
                		if (!resp.code) {
                			$("#jumbotronSprintNo").html(resp.sprintNumber - 1);
                			$("#jumbotronWeekNo").html(resp.sprintNumber);
                			current_sprint = resp.sprintNumber;
                		}
                		else{
                			$("#jumbotronSprintNo").html("N/A");
                			$("#jumbotronWeekNo").html("N/A");
                		}
                	});
        			
        			createAreaChart();
        		}
        		else{
        			console.log(resp.message);
        		}
        	});
        	
        	
        	
        	
        }
        
        function inviteUser(){
        	
        	var userEmail = document.getElementById("userEmailFld" ).value;
        	
        	gapi.client.qdacity.project.inviteUser({'projectID' : project_id, 'userEmail': userEmail}).execute(function(resp){
        		if (!resp.code) {
        			alertify.success(userEmail + " has been invited");
        		}
        		else{
        			alertify.error(userEmail + " was not found");
        			console.log(resp.code);
        		}
        	});
        }
        
        function submitHappiness(){
        	var happinessValue = $( "#selectHappiness" ).val();
        	
        	gapi.client.happiness.insertHapiness({'happiness' : happinessValue,'projectID' : project_id, 'userName' : full_name}).execute(function(resp){
        		if (!resp.code) {
        			alertify.success(" Your happiness has been submitted ");
        			createAreaChart();
        		}
        		else{
        			alertify.error("Error: happiness not submitted correctly");
        			console.log(resp.code);
        		}
        	})
        }
        
        function submitStandup(){
        	var doneValue = $( "#standupDoneTxt" ).val();
        	var planValue = $( "#standupPlanTxt" ).val();
        	var challengesValue = $( "#standupChallengesTxt" ).val();
        	
        	// convert linebreaks to HTML
        	doneValue = doneValue.replace(/\n/g, "<br/>");
        	planValue = planValue.replace(/\n/g, "<br/>");
        	challengesValue = challengesValue.replace(/\n/g, "<br/>");
        	
        	var standup = {};
        	
        	standup.projectId = project_id;
        	standup.userName = full_name;
        	standup.done = doneValue;
        	standup.plan = planValue;
        	standup.challenges = challengesValue;
        	standup.sprintNumber =  current_sprint;
        	
        	
        	
        	gapi.client.happiness.insertStandup(standup).execute(function(resp){
        		if (!resp.code) {
        			alertify.success(" Your standup has been submitted ");
        		}
        		else{
        			alertify.error("Error: standup not submitted correctly");
        			console.log(resp.code);
        		}
        	})
        }
        
        function showStandupModal(title, textAreaElement){
        var oldValue = $(textAreaElement).val();
       	 var formElements =  "<textarea rows=\"15\" cols=\"200\" name=\"textBox\" type=\"text\"  >"+oldValue+"</textarea><br/>\n";
       	 
       		vex.dialog.open({
       			message : title,
       			contentCSS: { width: '600px' },
       			input : formElements,
       			buttons : [ $.extend({}, vex.dialog.buttons.YES, {
       				text : 'OK'
       			}), $.extend({}, vex.dialog.buttons.NO, {
       				text : 'Cancel'
       			}) ],
       			callback : function(data) {
       				if (data === false) {
       					return console.log('Cancelled');
       				}
       				
       				$(textAreaElement).val(data.textBox);
       			}
       		});
        }