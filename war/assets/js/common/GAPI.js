import Account from './Account.jsx';

var scopes = 'email profile';
var client_id = '$CLIENT_ID$';
var api_version = '$API_VERSION$';
var api_path = '$API_PATH$';

export default function loadGAPIs() {

	var promise = new Promise(function(resolve, reject) {
		var apisToLoad;
		var apiCallback = function() {
			if (--apisToLoad == 0) {
				console.log("[GAPI] Both auth2 and happiness API loaded");
				resolve({
					client_id: client_id,
					scopes: scopes,
					cookie_policy: 'none'
				});
			}
		};
		apisToLoad = 2;

		let aut2Callback = function() {
			gapi.auth2.init({
			  client_id: client_id,
			  scope: scopes,
			  cookie_policy: 'none'
		  }).then(
			  apiCallback,
			  reject
		  );
		};

		//Parameters are APIName,APIVersion,CallBack function,API Root
		gapi.client.load('happiness', api_version, apiCallback, api_path);
		gapi.load('auth2', aut2Callback);
	});

	return promise;
}
