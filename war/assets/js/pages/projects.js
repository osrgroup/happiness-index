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
    var joined_projects;
    
    var joinable;
    
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
		         		joined_projects = resp.projects;
		         	 }
		          });
		     //$("#adminBtn").css("display", "block");
		      document.getElementById('currentUserName').innerHTML = resp.name;
		      document.getElementById('currentUserEmail').innerHTML = resp.email;
		      document.getElementById('currentUserPicture').src = resp.picture;
		      
		      $('#navAccount').show();
		      $('#navSignin').hide();
		      // INIT
		      
		      
		      gapi.client.happiness.getTeachingTerm({'id' : teaching_term}).execute(function(resp) {
		         	 if (!resp.code) {
		         		 if (resp.joinable === true){
		         			 joinable =  true;
		         			notifyRegistration();
		         		}
		         		 else joinable = false;
		              
		         	 } else {
		         		 console.log(resp.message);
		         		joinable= false;
		         	}
		         	fillProjectList(joinable);
		          });
		      
		      vex.defaultOptions.className = 'vex-theme-os';
		     
		      
		    }
		    else {
		    	 $('#navAccount').hide();
		    	 notifyLogin ();
		    	 handleError(resp.code);
		    }
		  });
		}
   
   function setJoinableFlag(){
	   
   }
   
   function notifyRegistration (){
	   $("#notificationArea").html("");
	   var html = "";
	   html += '<div class="jumbotron">';
	   html += ' <h1>Register for Your Project Now</h1>';
		   html += '<p>';
			   html += 'Registration will close at the end of the first week of the term.';
				   html += '</p>';
					   html += '</div>';
				   $("#notificationArea").append(html);
   }
   
   function notifyLogin (){
	   $("#notificationArea").html("");
	   var html = "";
	   html += '<div class="jumbotron">';
	   html += ' <h1>You need to be logged in</h1>';
		   html += '<p>';
			   html += 'log in with your Google account.';
				   html += '</p>';
					   html += '</div>';
				   $("#notificationArea").append(html);
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
        	
        	// FIXME hardcoded course as default for welcome page
        	if (teaching_term == ""){
        		teaching_term = "5736907271045120";
        	}
        	current_user_email = data[1];

        	
        	loadGAPIs(setupUI).then(
        			function (accountModule) {
        				account = accountModule;
        			}
			);
        	
        	document.getElementById('navBtnSigninGoogle').onclick = function () {
        		account.changeAccount();
        	};
        }
        
        function setupUI(){
        	if (account.isSignedIn()) {
        		$('#navAccount').show();
        		$('#navSignin').hide();
        		$('#welcomeName').html(account.getProfile().getGivenName());
        		$('#welcome').removeClass('hidden');
        		
        		current_user_email = account.getProfile().getEmail();
        		
        		gapi.client.happiness.getTeachingTerm({'id' : teaching_term}).execute(function(resp) {
		         	 if (!resp.code) {
		         		 if (resp.joinable === true){
		         			 joinable =  true;
		         			notifyRegistration();
		         		}
		         		 else joinable = false;
		              
		         	 } else {
		         		 console.log(resp.message);
		         		joinable= false;
		         	}
		         	fillProjectList(joinable);
		          });
		      
		      vex.defaultOptions.className = 'vex-theme-os';

        	} else {
        		$('#navAccount').hide();
        	}
        }

        function fillProjectList(joinable){
        	$("#projects").html("");
        	gapi.client.happiness.listProject({'teachingTerm' : teaching_term}).execute(function(resp) {
           	 if (!resp.code) {
           		resp.items = resp.items || [];
                
                for (var i=0;i<resp.items.length;i++) {
                        var project_id = resp.items[i].id;
                        var project_name = resp.items[i].name;
                        var project_desc = resp.items[i].description;
                        
                  		addProjectToProjectList(project_id, project_name, project_desc, joinable);
                }
                
           	 }
           	 
           	 
           
           	 else{
           		 console.log(resp.code)
           	}
           	 
            });
        }

        function addProjectToProjectList(projectID, projectName, projectDesc, joinable){

	        	
        	
        	var html = '<div class="col-lg-6 ">';
			html += '<div style="text-align:center;">';
			//
			html += '<div class="panel panel-default projectDesc ">';
			var projectMember = $.inArray(projectID.toString(), account.getJoinedProjects());
			if (projectMember != -1) html += '<div class="panel-heading joinedProject"> Project: '+ projectName +'</div>';
			else html += '<div class="panel-heading"> Project: '+ projectName +'</div>';
			html += '<div class="panel-body">';
			html += projectDesc;
			
			html += '<br/><br/>';
			if (joinable && (projectMember == -1)){
			html += '<span  style="padding-right:5px;">';
			html += '<button class="btn btn-default btn-lg" type="button" onclick="joinProject('+projectID+')">Join</button>';
			html += '</span>';
			} 
			html +='<a href="project-dashboard.html?'+projectID+ ',' +current_user_email+'" style="padding-left:5px;">';
			html += '<button class="btn btn-default btn-lg" type="button" >Happiness</button>';
			html +='</a>';
			
			html += '</div>';
		
			html += '</div>';
			html += '</div>';
			html += '</div>';
			
		$("#projects").append(html);

        }
        
        
window.joinProject = function(projectID){
        	//check if already registered 
        	gapi.client.happiness.getCurrentUser().execute(function(resp) {
	           	 if (!resp.code) {
	           		 // already known user, so just authorize
	           		authorizeUser(projectID);
	           	 }
	           	 else{
	           		// register first
	           		registerUser(projectID);
	           	 }
	           	 
	            });
        	
        		
        }
        
        function authorizeUser(projectID){
        	//check if already registered 
        	
        	gapi.client.happiness.joinProject({'id': projectID}).execute(function(resp) {
	           	 if (!resp.code) {
	           		 //success
	           		window.location = "project-dashboard.html?"+projectID + "," +current_user_email;
	           	 }
	           	 else{
	           	 }
	           	 
	            });
        }
        
        function registerUser(projectID){
     	   
     	   
     	   vex.dialog.open({
     		   message: 'We need some information before you can join',
     		   input: "<input name=\"givenName\" type=\"text\" placeholder=\"Given Name\" required />\n"
     			    + "<input name=\"surName\" type=\"text\" placeholder=\"Surname\" required />\n"
     			   	+ "<input name=\"email\" type=\"text\" placeholder=\"Email\" required />",
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
     		     
     		     user.givenName = data.givenName;
     		     user.surName = data.surName;
     		     user.email = data.email;
     		     
     		     // User ID and Type (=USER) will be set by server
     		     gapi.client.happiness.insertUser(user).execute(function(resp) {
     	           	 if (!resp.code) {
     	           		//success on inserting new user, now authorize
     	           		authorizeUser(projectID);
     	           	 }
     	            });
     		     
     		   }
     		 });
        }
        