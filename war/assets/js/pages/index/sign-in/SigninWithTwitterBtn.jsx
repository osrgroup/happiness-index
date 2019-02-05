//@ts-check
import React from 'react';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import IntlProvider from '../../../common/Localization/LocalizationProvider';

import ReactLoading from '../../../common/ReactLoading.jsx';
import { DialogProvider } from 'modals/DialogProvider.jsx';

import { BtnLg } from '../../../common/styles/Btn.jsx';

export default class SigninWithTwitterBtn extends React.Component {
	constructor(props) {
		super(props);

		this.authenticationProvider = props.auth.authentication;
		this.state = {
			loading: false,
			showConfirmDataModal: false
		};
		this.signIn = this.signIn.bind(this);
	}

	onSignedIn() {
		if (!this.props.onSignedIn) {
			console.error('No onSignedIn method given in SigninWithTwitterBtn.');
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
			.registerTwitterUser(data.firstName, data.lastName, data.email)
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
		this.authenticationProvider.signInWithTwitter().then(
			function(twitterProfile) {
				_this.onSignedIn();
			},
			function(twitterProfileOrError) {
				if (twitterProfileOrError.error) {
					// on twitter error
					_this.setState({
						loading: false
					});
					return;
				}

				const title= formatMessage({
					id: 'signinwithtwitterbtn.register_prompt',
					defaultMessage:
						'Your account does not seem to be registered with QDAcity.'
				});
				const optionALabel= formatMessage({
					id: 'signinwithtwitterbtn.use_different',
					defaultMessage: 'Use Different Account'
				});
				const optionA= _this.signIn;
				const optionBLabel= formatMessage({
					id: 'signinwithtwitterbtn.register_account',
					defaultMessage: 'Register Account'
				});
				const optionB = (()=>{
					_this.setState({
						showConfirmDataModal: true,
						twitterProfile: twitterProfileOrError
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
					facebookProfile={this.state.twitterProfile}/>
				</div>);
		return (
			<BtnLg href="#" onClick={() => this.signIn()}>
				<a>
					<FontAwesomeIcon icon={['fab','twitter']} size='2x'/>
				</a>
				<span>
					<FormattedMessage
						id="signinwithtwitterbtn.sign_in_with_twitter"
						defaultMessage="Sign in with Twitter"
					/>
				</span>
			</BtnLg>
		);
	}
}
