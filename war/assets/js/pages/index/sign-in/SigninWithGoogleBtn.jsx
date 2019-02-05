//@ts-check
import React from 'react';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import IntlProvider from '../../../common/Localization/LocalizationProvider';


import ReactLoading from '../../../common/ReactLoading.jsx';
import { DialogProvider } from 'modals/DialogProvider.jsx';
import ConfirmRegistrationData from '../../../common/modals/ConfirmRegistrationData.jsx';

import { BtnLg } from '../../../common/styles/Btn.jsx';

export default class SigninWithGoogleBtn extends React.Component {
	constructor(props) {
		super(props);
		var urlParams = URI(window.location.search).query(true);

		this.state = {
			loading: false,
			showConfirmDataModal: false,
			redirect: urlParams.redirect
		};

		this.registerAccount = this.registerAccount.bind(this);
		this.signIn = this.signIn.bind(this);
		this.registerUser = this.registerUser.bind(this);
		this.userNotRegistered = this.userNotRegistered.bind(this);
		this.onRedirect = this.onRedirect.bind(this);


	}

	componentDidMount(){
		const _this = this;
		if (this.state.redirect) {
			console.log("[SigninWithGoogleBtn] onRedirect");
			this.auth2 = gapi.auth2.getAuthInstance();
			if (this.auth2.isSignedIn.get()){
				console.log("[SigninWithGoogleBtn] isSignedIn.get() == true");
				_this.onRedirect();
			}
			else{
				console.log("[SigninWithGoogleBtn] isSignedIn.get() == false");
				console.log("[SigninWithGoogleBtn] listening for signin");
				Promise.resolve(this.auth2.signIn({
					prompt: 'none'
				})).then((resp1)=>{
					console.log("[SigninWithGoogleBtn] auth2.signIn success with prompt: none");
					if (!resp1.code) {
						_this.onRedirect();
					}
					else {
						 window.alert("signIn resolve callback error");
					}
				}).catch((err)=>{
					console.error("[SigninWithGoogleBtn] auth2.signIn failed with prompt:none " + err);
				});
			}
		}
	}

	onRedirect(user){
		const _this = this;
		this.setState({
			loading: true
		});
		gapi.client.happiness.getCurrentUser().execute(function(resp) {
			   if (!resp.code) {
				   console.log("[SigninWithGoogleBtn] loaded user from AMOS happy DB");
				   console.log("[SigninWithGoogleBtn] User type is " + resp.type);
				   _this.props.history.push('/Courses');
			   }
			   else {
				   console.log("[SigninWithGoogleBtn] User not registered");
				   const user = gapi.auth2.getAuthInstance().currentUser.get();
					_this.userNotRegistered(user);
			   }
		});
	}

	onSignedIn() {
		if (!this.props.onSignedIn) {
			console.error('No onSignedIn method given in SigninWithGoogleBtn.');
			return;
		}
		this.props.onSignedIn();
	}

	registerAccount(data) {
		const _this = this;
		if (data === false) {
			_this.setState({
				loading: false
			});
			return console.log('Cancelled');
		}
		var user = {
			givenName : data.firstName,
			surName : data.lastName,
			email : data.email
		};
		console.log('Trying to insert user');
		gapi.client.happiness.insertUser(user).execute(function(resp) {
			console.log('Got a response from insertUser call');
			 if (!resp.code) {
				_this.props.setUser(resp);
				_this.props.history.push('/Courses');
			 }
			 else{
				 console.log('Inserting user failed: ' + resp.message);
			 }
		});
	}

	registerUser(){

		var user = {};

		user.givenName = "Andreas";
		user.surName = "Kaufmann";
		user.email = "kaufmann@group.riehle.org";

		// User ID and Type (=USER) will be set by server
		gapi.client.happiness.insertUser(user).execute(function(resp) {
			 if (!resp.code) {
				//success on inserting new user, now authorize
				authorizeUser(projectID);
			 }
		});
	}

	userNotRegistered(googleProfileOrError){
		const { formatMessage } = IntlProvider.intl;
		const title= formatMessage({
			id: 'sign.in.with.google.btn.register_prompt',
			defaultMessage:
				'Your account is not yet registered'
		});
		const optionALabel= formatMessage({
			id: 'sign.in.with.google.btn.use_different',
			defaultMessage: 'Use Different Account'
		});
		const optionA= this.signIn;
		const optionBLabel= formatMessage({
			id: 'sign.in.with.google.btn.register_account',
			defaultMessage: 'Register Account'
		});
		const optionB = (()=>{
			this.setState({
				showConfirmDataModal: true,
				googleProfile: googleProfileOrError
			});
		});
		DialogProvider.staticDecider(title, optionALabel, optionA, optionBLabel, optionB);
	}

	signIn() {
		console.log("[SigninWithGoogleBtn] started Signin");
		let _this = this;
		this.setState({
			loading: true
		});
		var scopes = 'email profile';
		var client_id = '$CLIENT_ID$';
		this.auth2 = gapi.auth2.getAuthInstance();
		// Logging events for communication between auth popup & main window
		// window.addEventListener('message', function(event) {
		//   console.log(event.data);
		// });

		// parameters for redirect
		// ux_mode: 'redirect',
		// redirect_uri: '$APP_PATH$/?redirect=true'
		Promise.resolve(this.auth2.signIn({
			prompt: 'consent'
		})).then((resp1)=>{
			console.log("[SigninWithGoogleBtn] auth2.signIn success");
			if (!resp1.code) {
				gapi.client.happiness.getCurrentUser().execute(function(resp) {
					   if (!resp.code) {
						   console.log("[SigninWithGoogleBtn] loaded user from AMOS happy DB");
						   console.log("[SigninWithGoogleBtn] User type is " + resp.type);
						   _this.props.setUser(resp);
						   _this.props.history.push('/Courses');
					   }
					   else {
						   console.log("[SigninWithGoogleBtn] User not registered");
							_this.userNotRegistered(resp1);
					   }
					});
			}
			else {
				 window.alert("User did not exist");
			}
		}).catch((err)=>{
			console.error("[SigninWithGoogleBtn] auth2.signIn failed" + err);
		});
	}

	render() {
		if (this.state.loading)
			return (
				<div>
					<ReactLoading color={props => props.theme.defaultText}/>
					<ConfirmRegistrationData
					open={this.state.showConfirmDataModal}
					close={()=>{
							this.setState({
								showConfirmDataModal: false
							});
						}
					}
					submit={this.registerAccount}
					googleProfile={this.state.googleProfile}/>
				</div>);
		return (
			<BtnLg href="#" onClick={() => this.signIn()}>
				<FontAwesomeIcon icon={['fab','google']} size='2x' />
				<span>
					<FormattedMessage
						id="sign.in.with.google.btn.sign_in_with_google"
						defaultMessage="Sign in with Google"
					/>
				</span>
			</BtnLg>
		);
	}
}
