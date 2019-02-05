//@ts-check
import React from 'react';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import IntlProvider from '../../../common/Localization/LocalizationProvider';
import { DialogProvider } from 'modals/DialogProvider.jsx';

import ReactLoading from '../../../common/ReactLoading.jsx';
import ConfirmRegistrationData from '../../../common/modals/ConfirmRegistrationData.jsx';

import { BtnLg } from '../../../common/styles/Btn.jsx';

export default class SigninWithFacebookBtn extends React.Component {
	constructor(props) {
		super(props);

		this.authenticationProvider = props.auth.authentication;
		this.state = {
			loading: false,
			showConfirmDataModal: false
		};
		this.registerAccount = this.registerAccount.bind(this);
		this.signIn = this.signIn.bind(this);
	}

	onSignedIn() {
		if (!this.props.onSignedIn) {
			console.error('No onSignedIn method given in signinwithtfacebookbtn.');
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
		_this.authenticationProvider
		.registerFacebookUser(data.firstName, data.lastName, data.email)
		.then(function() {
			_this.props.auth.updateUserStatus().then(function() {
				_this.onSignedIn();
			});
		});
	}

	signIn() {
		const { formatMessage } = IntlProvider.intl;

		this.setState({
			loading: true
		});

		const _this = this;
		this.authenticationProvider.signInWithFacebook().then(
			function(facebookProfile) {
				_this.onSignedIn();
			},
			function(facebookProfileOrError) {
				if (facebookProfileOrError.error) {
					// on facebook error
					_this.setState({
						loading: false
					});
					return;
				}

				const title= formatMessage({
					id: 'signinwithtfacebookbtn.register_prompt',
					defaultMessage:
						'Your account does not seem to be registered with QDAcity.'
				});
				const optionALabel= formatMessage({
					id: 'signinwithtfacebookbtn.use_different',
					defaultMessage: 'Use Different Account'
				});
				const optionA= _this.signIn;
				const optionBLabel= formatMessage({
					id: 'signinwithtfacebookbtn.register_account',
					defaultMessage: 'Register Account'
				});
				const optionB = (()=>{
					_this.setState({
						showConfirmDataModal: true,
						facebookProfile: facebookProfileOrError
					});
				});
				DialogProvider.staticDecider(title, optionALabel, optionA, optionBLabel, optionB);
			}
		);
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
				facebookProfile={this.state.facebookProfile}/>
			</div>);
		return (
			<BtnLg href="#" onClick={() => this.signIn()}>
				<FontAwesomeIcon icon={['fab','facebook']} size='2x' />
				<span>
					<FormattedMessage
						id="signinwithtfacebookbtn.sign_in_with_facebook"
						defaultMessage="Sign in with Facebook"
					/>
				</span>
			</BtnLg>
		);
	}
}
