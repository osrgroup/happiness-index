import Account from './Account.jsx';

var scopes = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
var client_id = '728995435943-2qqb570ukek75pvmv3i813ohecvr5rrh.apps.googleusercontent.com';

export default function loadGAPIs(allLoadedCallback) {
	var _this = this;
	var promise = new Promise(
		function (resolve, reject) {
			var account;
			var apisToLoad;
			var callback = function () {
				if (--apisToLoad == 0) {
					account = ReactDOM.render(<Account  client_id={client_id} scopes={scopes} callback={allLoadedCallback}/>, document.getElementById('accountView'));
					resolve(account);
				}
			}
			apisToLoad = 2;
			//Parameters are APIName,APIVersion,CallBack function,API Root
			//gapi.client.load('happiness', 'v1', callback, 'https://localhost:8888/_ah/api');
			gapi.client.load('happiness', 'v2', callback, 'https://2-dot-uni1-happy.appspot.com/_ah/api');
			gapi.load('auth2', callback);
		}
	);
	return promise;
}