import loadGAPIs from '../GAPI';
import Account from '../Account.jsx';
import $script from 'scriptjs';
$script('https://apis.google.com/js/client.js?onload=loadPlatform', 'client');
window.loadPlatform = function () {
	$script('https://apis.google.com/js/platform.js?onload=init', 'google-api');
}

var scopes = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
    var client_id = '728995435943-tge9f7ffanpd5v670hgctir9u0lhglv2.apps.googleusercontent.com';
    
    var project_id;
    var teaching_term;
    var current_user_email;
    var joinable;
    var teachingTerm = {};
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
		      document.getElementById('currentUserEmail').innerHTML = resp.email;
		      document.getElementById('currentUserPicture').src = resp.picture;
		      
		      $('#navAccount').show();
		      $('#navSignin').hide();
		      // INIT
		      
		      // if teaching term is not specified as parameter, then load default first
		      if (teaching_term == ""){
		      gapi.client.happiness.getCurrentUser().execute(function(resp) {
 	           	 if (!resp.code) {
 	           		teaching_term = resp.defaultTeachingTerm;
 	           		fillGUI();
 	           	 }
 	           
 	           	 else{
 	           		console.log(resp.code)
 	           	}
 	           	 
 	        });
		      }
		      else{
		    	  fillGUI();
		      }
		      
		      vex.defaultOptions.className = 'vex-theme-os';
		      
		      
		     
		      
		    }
		    else {
		    	 $('#navAccount').hide();
		    	 handleError(resp.code);
		    }
		  });
		}
   
function fillGUI(){
     
     setTeachingTermSelector();
     
     fillSprintList();
     
     fillProjectList();
     
     setJoinToggle();
     
     $('#linkToProjects').attr("href", "Projects.html?"+teaching_term+","+current_user_email);
}
   
window.init = function () {
	$('#navAccount').hide();
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
      	teaching_term = data[0];
      	current_user_email = data[1];
      	  
        	
      		loadGAPIs(setupUI).then(
					function (accountModule) {
						account = accountModule;
					}
			);
      		
      		document.getElementById('navBtnSigninGoogle').onclick = function () {
        		account.changeAccount();
        	};


        	document.getElementById('searchUserBtn').onclick = function() {
        		fillUserList();
            }
        	
        	document.getElementById('updateSprintsBtn').onclick = function() {
        		updateSprintConfig();
            }
        	
            document.getElementById('createProjectBtn').onclick = function() {
        		createProject();
            }
            
            document.getElementById('createTeachingTermBtn').onclick = function() {
        		createTechingTerm();
            }
            
            document.getElementById('editTeachingTermBtn').onclick = function() {
        		renameTeachingTerm();
            }
            
            document.getElementById('deleteTeachingTermBtn').onclick = function() {
        		deleteTeachingTerm();
            }
            
            document.getElementById('btnJoinableToggle').onclick = function() {
        		switchJoinable();
            }

            
            
        }

function setupUI(){
	if (account.isSignedIn()) {
		$('#navAccount').show();
		$('#navSignin').hide();
		$('#welcomeName').html(account.getProfile().getGivenName());
		$('#welcome').removeClass('hidden');
		
		// if teaching term is not specified as parameter, then load default first
	      if (teaching_term == ""){
	      gapi.client.happiness.getCurrentUser().execute(function(resp) {
          	 if (!resp.code) {
          		teaching_term = resp.defaultTeachingTerm;
          		fillGUI();
          	 }
          
          	 else{
          		console.log(resp.code)
          	}
          	 
       });
	      }
	      else{
	    	  fillGUI();
	      }
      
		vex.defaultOptions.className = 'vex-theme-os';

	} else {
		$('#navAccount').hide();
	}
}
        
        function switchJoinable(){
        	joinable = !joinable;
        	gapi.client.happiness.teachingTerm.setJoinable({'id' : teaching_term, 'joinable' : joinable}).execute(function(resp) {
        		setJoinToggle();
        	});
        	
        	
        }
        
        function setJoinToggle(){
        	gapi.client.happiness.getTeachingTerm({'id' : teaching_term}).execute(function(resp) {
        		 $("#joinToggle").html('<i class="fa fa-toggle-off fa-2x" style="font-size: 20px;"></i>');
	         	 if (!resp.code) {
	         		joinable = resp.joinable;
	         		teachingTerm.label = resp.label;
	         		teachingTerm.standupArchiveEmail = resp.standupArchiveEmail;
	         		 if (joinable) $("#joinToggle").html('<i class="fa fa-toggle-on fa-2x" style="font-size: 20px;"></i>');
	              
	         	 } else {
	         		 console.log(resp.message);
	         		
	         	}
	          });
           
           $("#joinToggle").html('<i class="fa fa-toggle-off fa-2x" style="font-size: 20px;"></i>');
        }
        
        function fillUserList(){
        	$("#user-list").html("");
        	var searchString = document.getElementById("searchStringFld").value;
        	
        	gapi.client.happiness.findUser({'searchString': searchString}).execute(function(resp) {
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
        
        function addUserToUserList(userID, userName){

        	var html = '<li  onclick="editUser(\''+userID+'\')">';

        	html += '<span class="user_name">'+userName+'</span>';
        	html += '<span class="user_id hidden">'+userID;
        	html += '</span>';
        	html += '</li>';
        	$("#user-list").append(html);
        	
        	
        }
        
        function fillProjectList(){
        	$("#project-list").html("");
        	
        	gapi.client.happiness.listProject({'teachingTerm': teaching_term}).execute(function(resp) { // FIXME teaching term configurable
           	 if (!resp.code) {
           		resp.items = resp.items || [];
                var initialized = false;
                for (var i=0;i<resp.items.length;i++) {
                        var project_id = resp.items[i].id;
                        var project_name = resp.items[i].name;
                        
                        addProjectToProjectList(project_id, project_name);
                        
                        if (!initialized) {
        	 				setProject(project_id);
        	 				initialized = true;
        	 			}
                }
                var options = {
                	  valueNames: [ 'project_name', 'project_id' ]
                };

                var projectList = new List('project-section', options);

                
           	 }
           
           	 else{
           		 window.alert(resp.code)
           	}
           	 
            });
        	
        }
        
        function addProjectToProjectList(projectID, projectName){
        	
        	var html = '<li onclick="setProject('+projectID+');" value="'+projectID+'">';
        	html+= '<div style=" ">'
	        	html += '<span class="project_name">'+projectName+'</span>';
	        	html += '<span class="project_id hidden">'+projectID;
	        	html += '</span>';
        	html+= '</div>'
        	html+= '<div style="float:right; margin-top:-30px; ">'
	        	html +='<a onclick="deleteProject('+projectID+');" class=" btn  fa-stack fa-lg fa-cancel-stack" >';
	        	html +=' <i class="fa fa-circle fa-stack-2x fa-cancel-btn-circle fa-hover"></i>';
	        	html +='<i  class="fa fa-times fa-stack-1x fa-inverse fa-cancel-btn"></i>';
	        	html +='</a>';
	        	html +='<a onclick="editProject('+projectID+');" class=" btn  fa-stack fa-lg fa-editor-stack" >';
	        	html +=' <i class="fa fa-circle fa-stack-2x fa-editor-btn-circle fa-hover"></i>';
	        	html +='<i  class="fa fa-pencil fa-stack-1x fa-inverse fa-editor-btn"></i>';
	        	html +='</a>';
	        	html +='<a onclick="sendTeamEmail('+projectID+');" class=" btn  fa-stack fa-lg fa-editor-stack">';
	        	html +=' <i class="fa fa-circle fa-stack-2x fa-email-btn-circle fa-hover"></i>';
	        	html +='<i  class="fa fa-envelope fa-stack-1x fa-inverse fa-email-btn"></i>';
	        	html +='</a>';
        	html+= '</div>'
        	html += '</li>';
        	$("#project-list").append(html);
        	
        	
        }
        
       
        
        
 function createAreaChart(projectId){
        	
        	gapi.client.happiness.listHapiness({'teachingTerm' : teaching_term ,'projectId' : projectId}).execute(function(resp){
        		if (!resp.code) {
        			if (typeof resp.items == 'undefined') alertify.error("No data found for selected project");
        				
        			var dataArray =  []; 
        			var keylabels = [];
        			var sprintsAdded = [];
        			
    				for (var i=0;i<resp.items.length;i++) {
    					
    					// if sprint already in graph data, continue;
    					if ($.inArray(resp.items[i].sprint, sprintsAdded) != -1) continue;
    					
    					var dataPoint = {};
    					dataPoint['year'] = resp.items[i].sprint+ "";
    					sprintsAdded.push(resp.items[i].sprint)
    					// Add all users for this sprint
    					for (var j=0;j<resp.items.length;j++) {
    						if (resp.items[i].sprint == resp.items[j].sprint) {
    							var userName = resp.items[j].userName;
    							dataPoint[userName] = resp.items[j].happiness.toString() ;
    						}
    						if ($.inArray(resp.items[j].userName, keylabels) == -1){
    			            	keylabels.push(resp.items[j].userName);
    			            }
    					}
    					
    					dataArray.push(dataPoint);    
    				}
    				
    				$('#happiness-area-chart').empty();
    				
    	        	var happiness_chart = Morris.Line({
    			        element: "happiness-area-chart",
    			        data: 
    			        	dataArray,
    			        	xLabels: "year",
    			        xkey: 'year',
    			        ymin: -3,
    			        ymax: 3,
    			        yLabelFormat: function(y){return y != Math.round(y)?'':y;},
    			        gridTextSize: 13,
    			        ykeys: keylabels,
    			        labels: keylabels,
    			        xLabelFormat: function (x) { return x.getFullYear() - 1900; },
    			        pointSize: 3,
    			        hideHover: 'true',
    			        resize: true
    			    });
    				
        		}
        		else
    			{
        			alertify.error("Bad response");
        			if (typeof resp.message == 'undefined') console.log(resp.message);
    			}
        		
        		
        		
        	});
        }
 
 function createStandupChart(projectId){
 	
 	gapi.client.happiness.listStandup({'teachingTerm' : teaching_term ,'projectID' : projectId}).execute(function(resp){
 		if (!resp.code) {
 			if (typeof resp.items == 'undefined') alertify.error("No standup data found for selected project");
 				
 			var dataArray =  []; 
 			var keylabels = [];
 			
				for (var i=0;i<resp.items.length;i++) {
					
					
					var dataPoint = {};
					dataPoint['year'] = resp.items[i].sprintNumber+ "";
					
					var userNames = resp.items[i].userName;		
					var standupCounts = resp.items[i].standupCount;
					for (var index = 0; index < userNames.length; ++index) {
					    dataPoint[userNames[index]] = standupCounts[index] ;
					    if ($.inArray(userNames[index], keylabels) == -1){
			            	keylabels.push(userNames[index]);
			            }
					}
					
					
					
					dataArray.push(dataPoint);

		            
			        
				}
				
				$('#standup-bar-chart').empty();
 			
				
        	var standup_chart = Morris.Bar({
		        element: "standup-bar-chart",
		        data: 
		        	dataArray,
		        	xLabels: "year",
		        xkey: 'year',
		        ykeys: keylabels,
		        labels: keylabels,
		        yLabelFormat: function(y){return y != Math.round(y)?'':y;},
		        gridTextSize: 13,
		        pointSize: 3,
		        hideHover: 'true',
		        resize: true
		    });
				
 		}
 		else
			{
 			alertify.error("Bad response");
 			if (typeof resp.message == 'undefined') console.log(resp.message);
			}
 		
 		
 		
 	});
 }
 
 
 
 function setStandupTimeline(projectId){
	 $('#standup-timeline').empty();
	 
	 
	 
	 gapi.client.happiness.listStandupMessages({'projectID': projectId}).execute(function(resp){ // FIXME Teaching Term should be configurable
	 		if (!resp.code) {
	 			
	 			 var currentSprint = 0;
	 			 var labels = [];
	 			for (var i=0;i<resp.items.length;i++) {
	 				
	 				var standup = resp.items[i];

	 				if ($.inArray(standup.sprintNumber, labels) == -1){
	 					addTimeLabelToTimeline("Week " + standup.sprintNumber);
	 					labels.push(standup.sprintNumber);
	 				}
	 				addStandupToTimeline(standup);
	 			}
	 			var options = {
	 				    valueNames: [ 'timelineUserName', 'timelineTime' , 'timelineContent', 'timelineType' ],
	 				    page: 10,
	 				    plugins: [
	 				      ListPagination({})
	 				    ]
	 				  };

	 				  var listObj = new List('timeline', options);
	 				 listObj.sort('timelineTime', { order: "desc" });
	 				listObj.filter(function(item) {
	 				   if (item.values().timelineType == "label" || item.values().timelineType == "done") {
	 				       return true;
	 				   } else {
	 				       return false;
	 				   }
	 				});
	 				
	 				document.getElementById('timelineFilterDone').onclick = function() {
	 					listObj.filter();
	 					listObj.filter(function(item) {
	 	 				   if (item.values().timelineType == "label" || item.values().timelineType == "done") {
	 	 				       return true;
	 	 				   } else {
	 	 				       return false;
	 	 				   }
	 	 				});
	 	           	}
	 				
	 				document.getElementById('timelineFilterChallenge').onclick = function() {
	 					listObj.filter();
	 					listObj.filter(function(item) {
	 	 				   if (item.values().timelineType == "label" || item.values().timelineType == "challenges") {
	 	 				       return true;
	 	 				   } else {
	 	 				       return false;
	 	 				   }
	 	 				});
	 	           	} 
	 				
	 				document.getElementById('timelineFilterPlans').onclick = function() {
	 					listObj.filter();
	 					listObj.filter(function(item) {
	 	 				   if (item.values().timelineType == "label" || item.values().timelineType == "plans") {
	 	 				       return true;
	 	 				   } else {
	 	 				       return false;
	 	 				   }
	 	 				});
	 	           	} 
	 				
	 				document.getElementById('timelineFilterAll').onclick = function() {
	 					listObj.filter();
	 	           	} 
	 			
	 		}
	 		
	 		
	 	});
     
 }
 
 function addStandupToTimeline(standup){
	 
	 var html = '<li>';
		 html += '<i class="fa fa-comments bg-yellow"></i>';
		 html += '<span class="timelineType" style="display:none;">done</span>';
		html += '<div class="timeline-item">';
		html += '<span class="time" ><i class="fa fa-clock-o"></i><span class="timelineTime">Week '+standup.sprintNumber +'</span></span>';

		html += ' <h3 class="timeline-header timelineUserName"><b>'+standup.userName +'</b> did this </h3>';

		html += '<div class="timeline-body timelineContent">';
		html += standup.done;

		html += '</div>';

		html += '</div>';
		html += '</li>';
		 
		
		
		html += '<li>';
		 html += '<i class="fa fa-exclamation-triangle bg-red"></i>';
		 html += '<span class="timelineType" style="display:none;">challenges</span>';
		html += '<div class="timeline-item">';
		html += '<span class="time" ><i class="fa fa-clock-o"></i><span class="timelineTime">Week '+standup.sprintNumber +'</span></span>';

		html += ' <h3 class="timeline-header timelineUserName"><b>'+standup.userName +'</b> faced this challenge </h3>';

		html += '<div class="timeline-body timelineContent">';
		html += standup.challenges;

		html += '</div>';

		html += '</div>';
		html += '</li>';
		
		html += '<li>';
		 html += '<i class="fa fa-star bg-green"></i>';
		 html += '<span class="timelineType" style="display:none;">plans</span>';
		html += '<div class="timeline-item">';
		html += '<span class="time" ><i class="fa fa-clock-o"></i><span class="timelineTime">Week '+standup.sprintNumber +'</span></span>';

		html += ' <h3 class="timeline-header timelineUserName"><b>'+standup.userName +'</b> plans this </h3>';

		html += '<div class="timeline-body timelineContent">';
		html += standup.plan;

		html += '</div>';

		html += '</div>';
		html += '</li>';
		
		$("#standup-timeline").append(html);
 }
 
 function addTimeLabelToTimeline(label){
	var html = '<li class="time-label">';
	html += '<span class="timelineType" style="display:none;">label</span>';
	html += '<span class="bg-red timelineTime">';
	html += label;
	html += '</span>';
	html += '</li>';
	$("#standup-timeline").append(html);
 }
 
 window.setProject = function (projectId){
	 createAreaChart(projectId);
	 createStandupChart(projectId);
	 markActiveProject(projectId);
	 setStandupTimeline(projectId);
 }
 
 function markActiveProject(projectId){
	 $("#project-list > li").removeClass("activeProject");
	 $("#project-list > li[value="+projectId+"]").addClass("activeProject");
	 
 }
 
 function setTeachingTermSelector(){
	 
	 gapi.client.happiness.listTeachingTerm().execute(function(resp){ // FIXME Teaching Term should be configurable
 		if (!resp.code) {
 			var chartInitialized = false;
 			for (var i=0;i<resp.items.length;i++) {
 				var teachingTerm = resp.items[i];

	 			
	 			var html = "";
	 			var selected = "";
	 			if (teachingTerm.id == teaching_term) selected = 'selected="selected"'
	 				
	 			html+= '<option '+selected+' value="'+teachingTerm.id+'">'+teachingTerm.label+'</option>';
	 			$("#techingTerm-selector").append(html);
 			}
 		}
 		
 		$( "#techingTerm-selector" ).selectmenu({
 			  select: function( event, ui ) {
 				gapi.client.happiness.setDefaultTeachingTerm({'defaultTeachingTerm': ui.item.value}).execute(function(resp) {});
 				 window.location = "admin.html?"+ ui.item.value;
 			  }
 		});
 		$( "#techingTerm-selector" ).selectmenu( "refresh" );
 		
 	});

 }
 
 window.editUser = function (userId){
	   
	 gapi.client.happiness.getUser({'id' : userId }).execute(function(resp) {
       	 if (!resp.code) {
       	 
       		 var formElements = "<input name=\"givenName\" type=\"text\" placeholder=\"Given Name\"  value=\""+resp.givenName+"\" required />\n"
			    + "<input name=\"surName\" type=\"text\" placeholder=\"Surname\" value=\""+resp.surName+"\" required />\n"
			   	+ "<input name=\"email\" type=\"text\" placeholder=\"Email\" value=\""+resp.email+"\" required />\n";
       		 

       			switch(resp.type) {
       		    case "MODERATOR":
       		        formElements += 'User Group: <select name="type" id="userRole"><option value="USER">User</option><option selected="selected" value="MODERATOR">Moderator</option><option value="ADMIN">Admin</option></select>\n';
       		        break;
       		    case "ADMIN":
       		    	formElements += 'User Group: <select name="type" id="userRole"><option value="USER">User</option><option value="MODERATOR">Moderator</option><option selected="selected" value="ADMIN">Admin</option></select>\n';
    		        break;
       		    default:
       		        formElements += 'User Group: <select name="type" id="userRole"><option value="USER">User</option><option value="MODERATOR">Moderator</option><option value="ADMIN">Admin</option></select>\n';
       		} 
	   vex.dialog.open({
		   message: 'Update User Information',
		   input: formElements,
		   buttons: [
		     $.extend({}, vex.dialog.buttons.YES, {
		       text: 'Submit'
		     }), $.extend({}, vex.dialog.buttons.NO, {
		       text: 'Cancel'
		     })
		   ],
		   callback: function(data) {
		     if (data === false) {
		       return console.log('Cancelled');
		     }
		     var givenName = data.givenName;
		     var surName = data.surName;
		     var email = data.email;
		     
		     var user = {};
		     
		     user.id = userId;
		     user.type = data.type;
		     user.givenName = data.givenName;
		     user.surName = data.surName;
		     user.email = data.email;
		     user.projects = resp.projects;
		     user.defaultTeachingTerm = resp.defaultTeachingTerm;
		     
		     gapi.client.happiness.updateUser(user).execute(function(resp) {
		    	 if (!resp.code) {
		    		 alertify.success("User data updated");
		    	 }
		     });
		   }
		 });
       	 }
	 });
  }
 

 var utcOffset = 2;
 function fillSprintList(){
	 $("#list1").html("");
	 gapi.client.happiness.getTeachingTerm({'id' : teaching_term }).execute(function(resp) {
       	 if (!resp.code) {
       		 var sprints = resp.sprints;
       		 if (typeof sprints != 'undefined'){
       		for (var i=0;i<sprints.length;i++) {
       			var datetime = new  Date(sprints[i].deadline);
       			var month = (datetime.getMonth() +1 ).toString();
       			if (month.length == 1) month = "0"+month;
       			var day = (datetime.getDate()).toString();
       			if (day.length == 1) day = "0"+day;
       			var hour = (datetime.getUTCHours() + utcOffset).toString();
       			if (hour.length == 1) hour = "0"+hour;
       			var minute = (datetime.getMinutes()).toString();
       			if (minute.length == 1) minute = "0"+minute;
       			addDeadlineToSprintList(datetime.getFullYear()+"-"+month+"-"+day+"T"+hour+":"+minute);
       			//addDeadlineToSprintList(datetime.toString());
       		}
       		 } else {
       			addDeadlineToSprintList("");
       		 }
       		generateAddList();
       	 }
       	 
        });
 }
 
 function addDeadlineToSprintList(deadline){
	 var html = '<li class="list1_var">';
	 html += ' <input type="text" size="40" name="list1_0" id="list1_0" value="'+deadline+'" >';
	 html += '<button class="list1_del btn btn-sm">Delete</button>';
	 html += '</li>';
	 
	$("#list1").append(html);
 }
        
 function generateAddList(){
	 $('#list1').addInputArea({
		  after_add: function () {
			  createDateTimePicker();
			  }
			});
	 createDateTimePicker();
 }
 
 function createDateTimePicker() {
	 jQuery('.list1_var > input').datetimepicker({
		  timepicker:true,
		  formatDate:'Y-m-d',
		  onChangeDateTime:function(dp,$input){ // Change format so GAE accepts it as date time
			  	var value = $input.val();
			  	value = setCharAt(value,10,'T');
//			  	if ((value.indexOf(":00.000Z") == -1)) value += ":00.000Z";
			  	value = value.replace("/", "-"); 
			  	$input.val(value);
				  }
	  });
 }
 
 function setCharAt(str,index,chr) {
	    if(index > str.length-1) return str;
	    return str.substr(0,index) + chr + str.substr(index+1);
	}
 
 function updateSprintConfig(){
	 var i = 1;
	 var sprints = [];
	 $(".list1_var > input").each(function()
	 {
		 var sprint = {};
		 var datetime = new  Date($(this).val());
		 datetime.setUTCHours(datetime.getUTCHours());
		 sprint.deadline = datetime.toISOString();
		 
		 sprint.sprintNumber = i++;
	     // window.alert($(this).val());
	     sprints.push(sprint);
	     
	 });
	 
	 var teachingTerm= {};
	 teachingTerm.id = teaching_term;
	 teachingTerm.label = $('#techingTerm-selector option:selected').text();
	 teachingTerm.sprints = sprints;
	 gapi.client.happiness.updateTeachingTerm(teachingTerm).execute(function(resp) {
       	 if (!resp.code) {
       		alertify.success("Sprints have been updated");
       	 }
       	 else
   		 {
       		alertify.error("Sprints were not updated");
   		 }
        });
 }
 
 function createProject(){
	 var formElements = "<input name=\"projectName\" type=\"text\" placeholder=\"Project Name\"  required />\n"
	    + "<input name=\"projectDescription\" type=\"text\" placeholder=\"Project Description\" required />\n";

vex.dialog.open({
message: 'Create New Project',
input: formElements,
buttons: [
  $.extend({}, vex.dialog.buttons.YES, {
    text: 'Create'
  }), $.extend({}, vex.dialog.buttons.NO, {
    text: 'Cancel'
  })
],
callback: function(data) {
  if (data === false) {
    return console.log('Cancelled');
  }

  
  var project = {};
  
  project.name = data.projectName;
  project.description = data.projectDescription;
  project.teachingTerm = teaching_term; // FIXME teaching term configurable
  gapi.client.happiness.insertProject(project).execute(function(resp) {
 	 if (!resp.code) {
 		alertify.success("Project created");
		 fillProjectList();
 	 }
  });
}
	});
}
 
 function createTechingTerm(){
	 var formElements = "<input name=\"label\" type=\"text\" placeholder=\"Label\"  required />\n";
	 formElements += "<input name=\"standupArchiveEmail\" type=\"text\" placeholder=\"Standup Archive Email\"  required />\n";

vex.dialog.open({
message: 'Create New TeachingTerm (Group of Projects)',
input: formElements,
buttons: [
  $.extend({}, vex.dialog.buttons.YES, {
    text: 'Create'
  }), $.extend({}, vex.dialog.buttons.NO, {
    text: 'Cancel'
  })
],
callback: function(data) {
  if (data === false) {
    return console.log('Cancelled');
  }

  
  var teachingTerm = {};
  
  teachingTerm.label = data.label;
  teachingTerm.standupArchiveEmail = data.standupArchiveEmail;
  gapi.client.happiness.insertTeachingTerm(teachingTerm).execute(function(resp) {
 	 if (!resp.code) {
 		alertify.success("Teaching term created");
 		window.location = "admin.html?"+ resp.id;
 	 }
 	 else
 		 {
 		 console.log(resp.message);
 		 }
  });
}
	});
}
 
 function renameTeachingTerm(){
	 
	 var formElements = "<input name=\"label\" type=\"text\" value=\"" + teachingTerm.label+ "\"  required />\n";
	 formElements += "<input name=\"standupArchiveEmail\" type=\"text\" value=\"" + teachingTerm.standupArchiveEmail+ "\"  required />\n";

vex.dialog.open({
message: 'Rename Teaching Term (Group of Projects)',
input: formElements,
buttons: [
  $.extend({}, vex.dialog.buttons.YES, {
    text: 'Update'
  }), $.extend({}, vex.dialog.buttons.NO, {
    text: 'Cancel'
  })
],
callback: function(data) {
  if (data === false) {
    return console.log('Cancelled');
  }
  
  
  gapi.client.happiness.editTeachingTerm({'id' : teaching_term, 'label' : data.label, 'standupArchiveEmail' : data.standupArchiveEmail}).execute(function(resp) {
 	 if (!resp.code) {
 		alertify.success("Teaching term updated");
 		$('#techingTerm-selector option:selected').text(data.label);
 		$( "#techingTerm-selector" ).selectmenu( "refresh" );
 	 }
 	 else
 		 {
 		 console.log(resp.message);
 		 }
  });
}
	});
}
 
 
 function deleteTeachingTerm(){
	 vex.dialog.confirm({
		  message: 'Confirm deletion of course',
		  callback: function(value) {
			  if (value === false) {
				    return console.log('Cancelled');
			  }
			  
			  gapi.client.happiness.removeTeachingTerm({'id' : teaching_term}).execute(function(resp) {
				 	 if (!resp.code) {
				 		alertify.success("Teaching term deleted");
				 		window.location = "admin.html";
				 	 }
				 	 else
			 		 {
			 		 console.log(resp.message);
			 		 }
				  });
		  }
		});
 }

 
 window.editProject = function (projectId){
	gapi.client.happiness.getProject({'id' : projectId}).execute(function(resp) {
		if (!resp.code) {
			gapi.client.happiness.listManager().execute(function(respUser) {
				if (!resp.code) {
					var formElements = "Name: <input name=\"projectName\" type=\"text\" placeholder=\"Project Name\" value=\"" + resp.name + "\" required /><br/>\n" 
					+ "Description: <input name=\"projectDescription\" type=\"text\" placeholder=\"Project Description\" value=\"" + resp.description + "\" required /><br/>\n"
					+ createManagerSelector(respUser, resp.managerID);
					vex.dialog.open({
						message : 'Update User Information',
						input : formElements,
						buttons : [ $.extend({}, vex.dialog.buttons.YES, {
							text : 'Submit'
						}), $.extend({}, vex.dialog.buttons.NO, {
							text : 'Cancel'
						}) ],
						callback : function(data) {
							if (data === false) {
								return console.log('Cancelled');
							}
							var givenName = data.givenName;
							var surName = data.surName;
							var email = data.email;
	
							var project = {};
	
							project.id = projectId;
							project.name = data.projectName;
							project.description = data.projectDescription;
							project.teachingTerm = teaching_term; // FIXME Teaching term configurable
							project.users = resp.users;
							project.managerID = data.manager;
							gapi.client.happiness.updateProject(project).execute(function(resp) {
								if (!resp.code) {
									alertify.success("Project description updated");
									fillProjectList();
								}
							});
						}
					});
				}
			});
		}
	});
}

function createManagerSelector(managers, currentManagerID){
	var formElements = 'Manager: <select name="manager" id="managerSelector">';
	for (var i=0;i<managers.items.length;i++) {
			var user = managers.items[i];
			if (currentManagerID == user.id) formElements += '<option selected="selected" value="'+user.id+'">'+user.givenName+'</option>\n';
			else formElements += '<option value="'+user.id+'">'+user.givenName+'</option>\n';
	}
	formElements += '</select>\n';
	return formElements;
}
 
 
 window.deleteProject = function (projectId){
	 vex.dialog.confirm({
		  message: 'Are you sure you want to delete this project?',
		  callback: function(value) {
			  if (value){
				  gapi.client.happiness.removeProject({'id' : projectId }).execute(function(resp) {
				    	 if (!resp.code) {
				    		 alertify.success("Project description updated");
				    		 fillProjectList();
				    	 }
				     });
			  }
			  else{
				  console.log("canceled");
			  }
		  }
		});
 }
 
 window.sendTeamEmail = function (projectId){
	 var formElements = "Subject: <input name=\"subject\" type=\"text\" placeholder=\"Subject\" required /><br/>\n" 
		+ "Message: <textarea rows=\"15\" cols=\"200\" name=\"message\" type=\"text\" placeholder=\"Email Body\"  required /><br/>\n";
	 
		vex.dialog.open({
			message : 'Send a message to the team',
			contentCSS: { width: '600px' },
			input : formElements,
			buttons : [ $.extend({}, vex.dialog.buttons.YES, {
				text : 'Send'
			}), $.extend({}, vex.dialog.buttons.NO, {
				text : 'Cancel'
			}) ],
			callback : function(data) {
				if (data === false) {
					return console.log('Cancelled');
				}
				data.message = data.message.replace(/\n/g, "<br/>");
				gapi.client.happiness.sendTeamEmail({'projectID' : projectId, 'subject': data.subject,'message' : data.message }).execute(function(resp) {
					if (!resp.code) {
						alertify.success("Email sent");
					}
				});
			}
		});
 }