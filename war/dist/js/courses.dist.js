!function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return e[r].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function i(){d.isSignedIn()?($("#navAccount").show(),$("#navSignin").hide(),$("#welcomeName").html(d.getProfile().getGivenName()),$("#welcome").removeClass("hidden")):$("#navAccount").hide()}var a=n(1),o=r(a),c=n(2),s=(r(c),n(3)),u=r(s);(0,u["default"])("https://apis.google.com/js/client.js?onload=loadPlatform","client"),window.loadPlatform=function(){(0,u["default"])("https://apis.google.com/js/platform.js?onload=init","google-api")};var l,f,d;window.init=function(){$("#navAccount").hide();var e=window.location.search;"?"==e.substring(0,1)&&(e=e.substring(1));for(var t=e.split(","),n=0;n<t.length;n++)t[n]=unescape(t[n]);l=t[0],""==l&&(l="5736907271045120"),f=t[1],(0,o["default"])(i).then(function(e){d=e}),document.getElementById("navBtnSigninGoogle").onclick=function(){d.changeAccount()}}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function i(e){var t=new Promise(function(t,n){var r,i,a=function(){0==--i&&(r=ReactDOM.render(React.createElement(o["default"],{client_id:s,scopes:c,callback:e}),document.getElementById("accountView")),t(r))};i=2,gapi.client.load("happiness","v2",a,"https://2-dot-uni1-happy.appspot.com/_ah/api"),gapi.load("auth2",a)});return t}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=i;var a=n(2),o=r(a),c="https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",s="728995435943-2qqb570ukek75pvmv3i813ohecvr5rrh.apps.googleusercontent.com"},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(e){function t(e){n(this,t);var i=r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return i.setType=i.setType.bind(i),i.getJoinedProjects=i.getJoinedProjects.bind(i),i.state={name:"",email:"",picSrc:"",type:""},i.auth2=gapi.auth2.init({client_id:i.props.client_id,scope:i.props.scope}),i.signin(),i}return i(t,e),a(t,[{key:"signin",value:function(){var e=this;this.auth2.currentUser.listen(function(t){t.isSignedIn()&&(e.setUser(e.getProfile()),e.setType(),e.props.callback())})}},{key:"changeAccount",value:function(e){this.auth2.signIn({prompt:"select_account"}).then(e)}},{key:"getProfile",value:function(){return this.auth2.currentUser.get().getBasicProfile()}},{key:"isSignedIn",value:function(){return this.auth2.isSignedIn.get()}},{key:"getCurrentUser",value:function(){var e=new Promise(function(e,t){gapi.client.happiness.getCurrentUser().execute(function(n){n.code?t(n):e(n)})});return e}},{key:"isProjectOwner",value:function(e,t){var n=!1;return"undefined"!=typeof e.projects&&e.projects.forEach(function(e){e===t&&(n=!0)}),n}},{key:"getJoinedProjects",value:function(){return this.state.joinedProject}},{key:"registerCurrentUser",value:function(e,t,n){var r=new Promise(function(r,i){var a={};a.email=n,a.givenName=e,a.surName=t,gapi.client.qdacity.insertUser(a).execute(function(e){e.code?i(e):r(e)})});return r}},{key:"setType",value:function(){var e=this;this.getCurrentUser().then(function(t){e.setState({type:t.type,joinedProject:t.projects})})}},{key:"setUser",value:function(e){this.setState({name:e.getName(),email:e.getEmail(),picSrc:e.getImageUrl()})}},{key:"signout",value:function(){window.open("https://accounts.google.com/logout")}},{key:"renderAdminBtn",value:function(){return"ADMIN"==this.state.type?React.createElement("a",{href:"admin.html",className:"btn btn-danger btn-sm active"},"Admin"):""}},{key:"render",value:function(){return React.createElement("div",null,React.createElement("div",{className:"navbar-content"},React.createElement("div",{className:"row"},React.createElement("div",{className:"col-xs-5"},React.createElement("img",{id:"currentUserPicture",src:this.state.picSrc,alt:"",className:"img-responsive"}),React.createElement("p",{className:"text-center small"})),React.createElement("div",{"class":"col-xs-7"},React.createElement("span",{id:"currentUserName"},this.state.name),React.createElement("p",{id:"currentUserEmail",className:"text-muted small"},this.state.email),React.createElement("div",{"class":"divider"}),this.renderAdminBtn()))),React.createElement("div",{className:"navbar-footer"},React.createElement("div",{className:"navbar-footer-content"},React.createElement("div",{className:"row"},React.createElement("div",{className:"col-xs-6"},React.createElement("a",{id:"navBtnSwitchAccount",href:"#",className:"btn btn-default btn-sm",onClick:this.changeAccount.bind(this)},"Switch User")),React.createElement("div",{className:"col-xs-6"},React.createElement("a",{id:"navBtnSignOut",className:"btn btn-default btn-sm pull-right",onClick:this.signout.bind(this)},"Sign Out"))))))}}]),t}(React.Component);t["default"]=o},function(e,t,n){var r,i;!function(a,o){"undefined"!=typeof e&&e.exports?e.exports=o():(r=o,i="function"==typeof r?r.call(t,n,t,e):r,!(void 0!==i&&(e.exports=i)))}("$script",function(){function e(e,t){for(var n=0,r=e.length;n<r;++n)if(!t(e[n]))return s;return 1}function t(t,n){e(t,function(e){return!n(e)})}function n(a,o,c){function s(e){return e.call?e():d[e]}function l(){if(!--y){d[v]=1,g&&g();for(var n in m)e(n.split("|"),s)&&!t(m[n],s)&&(m[n]=[])}}a=a[u]?a:[a];var f=o&&o.call,g=f?o:c,v=f?a.join(""):o,y=a.length;return setTimeout(function(){t(a,function e(t,n){return null===t?l():(n||/^https?:\/\//.test(t)||!i||(t=t.indexOf(".js")===-1?i+t+".js":i+t),h[t]?(v&&(p[v]=1),2==h[t]?l():setTimeout(function(){e(t,!0)},0)):(h[t]=1,v&&(p[v]=1),void r(t,l)))})},0),n}function r(e,t){var n,r=o.createElement("script");r.onload=r.onerror=r[f]=function(){r[l]&&!/^c|loade/.test(r[l])||n||(r.onload=r[f]=null,n=1,h[e]=2,t())},r.async=1,r.src=a?e+(e.indexOf("?")===-1?"?":"&")+a:e,c.insertBefore(r,c.lastChild)}var i,a,o=document,c=o.getElementsByTagName("head")[0],s=!1,u="push",l="readyState",f="onreadystatechange",d={},p={},m={},h={};return n.get=r,n.order=function(e,t,r){!function i(a){a=e.shift(),e.length?n(a,i):n(a,t,r)}()},n.path=function(e){i=e},n.urlArgs=function(e){a=e},n.ready=function(r,i,a){r=r[u]?r:[r];var o=[];return!t(r,function(e){d[e]||o[u](e)})&&e(r,function(e){return d[e]})?i():!function(e){m[e]=m[e]||[],m[e][u](i),a&&a(o)}(r.join("|")),n},n.done=function(e){n([null],e)},n})}]);