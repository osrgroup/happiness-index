//import AccountView from './AccountView.jsx';

export default class Account extends React.Component {


	constructor(props) {
		super(props);
		this.setType = this.setType.bind(this);
		this.getJoinedProjects = this.getJoinedProjects.bind(this);
		
		
		this.state = {
			name: "",
			email: "",
			picSrc: "",
			type: ""
		};
		this.auth2 = gapi.auth2.init({
			client_id: this.props.client_id,
			scope: this.props.scope
		});
		this.signin();
		
		
	}


	signin() {
		var _this = this;
		this.auth2.currentUser.listen(function (googleUser) {
			if (googleUser.isSignedIn()) {
				_this.setUser(_this.getProfile());
				_this.setType();
				_this.props.callback();
			}
		});
	}


	changeAccount(callback) {
		this.auth2.signIn({
			'prompt': 'select_account'
		}).then(callback);
	}

	getProfile() {
		return this.auth2.currentUser.get().getBasicProfile();
	}

	isSignedIn() {
		return this.auth2.isSignedIn.get();
	}

	getCurrentUser() {
		var promise = new Promise(
			function (resolve, reject) {
				gapi.client.happiness.getCurrentUser().execute(function (resp) {
					if (!resp.code) {
						resolve(resp);
					} else {
						reject(resp);
					}
				});
			}
		);

		return promise;
	}

	isProjectOwner(user, prjId) {
		var isOwner = false;
		if (typeof user.projects != 'undefined') {
			user.projects.forEach(function (userPrjId) {
				if (userPrjId === prjId) isOwner = true;
			});
		}
		return isOwner;
	}
	
	getJoinedProjects(){
		return this.state.joinedProject;
	}

	registerCurrentUser(givenName, surName, email) {
		var promise = new Promise(
			function (resolve, reject) {
				var user = {};
				user.email = email;
				user.givenName = givenName;
				user.surName = surName;

				gapi.client.qdacity.insertUser(user).execute(function (resp) {
					if (!resp.code) {
						resolve(resp);
					} else {
						reject(resp);
					}
				});
			}
		);

		return promise;
	}

	setType() {
		var _this = this;
		this.getCurrentUser().then(function(user){
			_this.setState({
				type: user.type,
				joinedProject : user.projects
			});
		});
	}
	
	setUser(pProfile) {
		this.setState({
			name: pProfile.getName(),
			email: pProfile.getEmail(),
			picSrc: pProfile.getImageUrl()
		});
	}

	signout() {
		window.open("https://accounts.google.com/logout");
	}

	renderAdminBtn(){
			if (this.state.type == "ADMIN") {
				return <a href="admin.html" className="btn btn-danger btn-sm active">Admin</a>;
			} else {
				return "";
			}
	}
		
		
	render() {
		
		
	
		return (
			<div>
				<div className="navbar-content">
					<div className="row">
						<div className="col-xs-5">
							<img id="currentUserPicture" src={this.state.picSrc} alt="" className="img-responsive" />
							<p className="text-center small">
							</p>
						</div>
						<div class="col-xs-7">
							<span id="currentUserName">{this.state.name}</span>
							<p id="currentUserEmail" className="text-muted small">{this.state.email}</p>
							<div class="divider"></div>
							{this.renderAdminBtn()}
						</div>
					</div>
				</div>
				<div className="navbar-footer">
					<div className="navbar-footer-content">
						<div className="row">
							<div className="col-xs-6">
								<a id="navBtnSwitchAccount"  href="#" className="btn btn-default btn-sm" onClick={this.changeAccount.bind(this)}>Switch User</a>
							</div>
							<div className="col-xs-6">
								<a id="navBtnSignOut" className="btn btn-default btn-sm pull-right" onClick={this.signout.bind(this)}>Sign Out</a>
							</div>
						</div>
					</div>
				</div>
				</div>

		);
	}
}