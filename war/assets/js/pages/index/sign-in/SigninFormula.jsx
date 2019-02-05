import React from 'react';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import IntlProvider from '../../../common/Localization/LocalizationProvider';


import ReactLoading from '../../../common/ReactLoading.jsx';

import { BtnLg } from '../../../common/styles/Btn.jsx';
import StyledInput from '../../../common/styles/Input.jsx';
import SigninWithGoogleBtn from './SigninWithGoogleBtn.jsx';
import SigninWithTwitterBtn from './SigninWithTwitterBtn.jsx';
import SigninWithFacebookBtn from './SigninWithFacebookBtn.jsx';
import RegisterEmailModal from './RegisterEmailModal.jsx';
import Notification from '../../../common/modals/Notification.jsx';
import {DialogContextConsumer} from '../../../common/modals/DialogProvider.jsx';

import AuthenticationEndpoint from '../../../common/endpoints/AuthenticationEndpoint.js';

const PanelDivisor = styled.div`
	margin-top: 15px;
	margin-bottom: 15px;
	height: 1px;
	border: 1px solid;
`;

const FormulaHeading = styled.p`
	text-align: left;
	margin-bottom: 2px;
	margin-top: 5px;
	margin-left: 30px;
`;

const FormulaLink = styled.a`
	color: inherit;
	font-size: 15px;
	margin-top: 5px;
	margin-left: 10px;
	margin-right: 10px;
`;

const Spacer = styled.div`
	margin-top: 15px;
`;

const ButtonStyledWidh = styled.div`
	margin-top: 4px;
	width: 100%;
	& > button {
		width: 70%;
		border: 1px solid ${props => props.theme.borderDefault};
	}
`;

const FormulaInputWrapper = styled.div`
	width: 100%;
	& > input {
		width: 80% !important;
		height: 30px !important;
		border: 1px solid !important;
		min-height: 0px !important;
		color: ${props => props.theme.defaultText};
		margin-left: auto !important;
		margin-right: auto !important;
		display: block;
	}
`;

export default class SigninFormula extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			emailInput: '',
			passwordInput: '',
			showRegisterModal: false,
			showNotification: false,
			notificationMessage: ''
		};
		this.closeRegisterModal = this.closeRegisterModal.bind(this);
		this.submitEmailRegistration = this.submitEmailRegistration.bind(this);
	}

	async signInWithEmailPassword(openNotification) {
		const { formatMessage } = IntlProvider.intl;

		console.log('Sign in with Email and password called!');
		try {
			await this.props.auth.authentication.signInWithEmailPassword(
				this.state.emailInput,
				this.state.passwordInput
			);
		} catch (e) {
			const code = e.message.split(':')[0]; // format Code1.2: ...
			let failureMessage = formatMessage({
				id: 'signin-formula.signin.failure.genericMessage',
				defaultMessage:
					'Something went wrong! Please report to our administrators'
			});
			switch (code) {
				case 'Code1.1': // user doesn't exist.
					failureMessage = formatMessage({
						id: 'signin-formula.signin.failure.userDoesNotExist',
						defaultMessage:
							'This combination of email and password does not exist!'
					});
					break;
				case 'Code1.2': // wrong password
					failureMessage = formatMessage({
						id: 'signin-formula.signin.failure.wrongPassword',
						defaultMessage:
							'This combination of email and password does not exist!'
					});
					break;
			}

			openNotification(failureMessage);
			return;
		}
		this.props.auth.updateUserStatus();
		this.onSignedIn();
	}

	onSignedIn() {
		if (!this.props.onSignedIn) {
			console.error('No onSignedIn method given in SigninFormula.');
			return;
		}
		this.props.onSignedIn();
	}

	forgotPassword(openPrompt, openNotification) {
		const { formatMessage } = IntlProvider.intl;

		const title = formatMessage({
			id: 'signin-formula.forgotpwd.heading',
			defaultMessage: 'Get a new password for your account!'
		})

		const label = formatMessage({
			id: 'signin-formula.forgotpwd.email',
			defaultMessage: 'Email'
		});
		openPrompt(title, label, (promptInput)=>{
			gapi.client.qdacity.authentication.email
				.forgotPwd({
					email: promptInput
				})
				.execute(function(resp) {
					let resultMessage = '';
					if (!resp.code) {
						resultMessage = formatMessage({
							id: 'signin-formula.forgotpwd.success',
							defaultMessage:
								'Your password was reset. Please check your contact email account!'
						});
					} else {
						resultMessage = formatMessage({
							id: 'signin-formula.forgotpwd.failure',
							defaultMessage:
								'Something went wrong during resetting the password...'
						});
					}
					openNotification(resultMessage);
				});
			return;
		})
	}

	registerEmailPassword() {
		console.log('Register with email and password.');
		this.setState({
			showRegisterModal: true
		});
	}

	closeRegisterModal(){
		this.setState({
			showRegisterModal: false
		});
	}

	async submitEmailRegistration(data) {
		const _this = this;
		const { formatMessage } = IntlProvider.intl;
		if (data === false) {
			return console.log('Cancelled');
		}
		try {
			await _this.props.auth.authentication.registerUserEmailPassword(
				data.email,
				data.pwd,
				data.firstName,
				data.lastName
			);
			this.closeRegisterModal();
		} catch (e) {
			const code = e.message.split(':')[0]; // format Code1.2: ...
			let failureMessage = formatMessage({
				id: 'signin-formula.register.failure.genericMessage',
				defaultMessage:
					'Something went wrong! Please report to our administrators'
			});
			switch (code) {
				case 'Code2.1': // email format not ok
					failureMessage = formatMessage({
						id: 'signin-formula.register.failure.emailNotFree',
						defaultMessage:
							'There already exists an account with this email!'
					});
					break;
				case 'Code2.2': // email format not ok
					failureMessage = formatMessage({
						id: 'signin-formula.register.failure.invalidEmail',
						defaultMessage: 'This is not a valid email adress!'
					});
					break;
				case 'Code2.3': // password is empty.
					failureMessage = formatMessage({
						id: 'signin-formula.register.failure.emptyPassword',
						defaultMessage: 'The password must not be empty!'
					});
					break;
				case 'Code2.4': // password doesn't meet requirements.
					failureMessage = formatMessage({
						id: 'signin-formula.register.failure.malformedPassword',
						defaultMessage:
							'The password must have at least 7 characters and must contain only small letters, big letters and numbers. Each category has to be fulfilled with at least one character! No Whitespaces allowed.'
					});
					break;
			}

			this.setState({
				notificationMessage: failureMessage,
				showNotification: true
			});

			return;
		}

		_this.confirmEmail();
	}

	 confirmEmail(openPrompt, openNotification) {
		console.log('Confirm email.');
		const _this = this;

		const { formatMessage } = IntlProvider.intl;

		const title = formatMessage({
			id: 'signin-formula.registeremailpwd.confirmationHeading',
			defaultMessage: 'Enter the code you received with Email'
		});

		const label = formatMessage({
			id: 'signin-formula.registeremailpwd.confirmation_code',
			defaultMessage: 'Confirmation Code'
		});
		openPrompt(title, label, async (promptInput)=>{
			let resultMessage = formatMessage({
				id: 'signin-formula.registeremailpwd.confirm.success',
				defaultMessage: 'Your Email was confirmed!'
			});

			try {
				await AuthenticationEndpoint.confirmEmail(promptInput);
			} catch(e) {

				resultMessage = formatMessage({
					id: 'signin-formula.registeremailpwd.confirm.failure',
					defaultMessage: 'Could not confirm the Email. Please try again!'
				});
			}
			openNotification(resultMessage);
		})
	}

	render() {
		if (this.state.loading) return <ReactLoading />;
		return (
			<DialogContextConsumer>
			{( { openNotification, openPrompt }) => (
            <div>

                <h3>
                    <FormattedMessage
                        id="signin-formula.title"
                        defaultMessage="Sign in now!"
                    />
                </h3>
				<div id="social-signin">
					<div className="row">
						<h4>
							<FormattedMessage
								id="signin-formula.signin-social-heading"
								defaultMessage="Sign in / Register with social Account"
							/>
						</h4>
					</div>
					<div className="row">
						<ButtonStyledWidh>
							<SigninWithGoogleBtn
								setUser={this.props.setUser}
								auth={this.props.auth}
								onSignedIn={this.props.onSignedIn}
								history={this.props.history}
							/>
						</ButtonStyledWidh>
					</div>
				</div>
				<RegisterEmailModal
					open={this.state.showRegisterModal}
					close={this.closeRegisterModal}
					submit={this.submitEmailRegistration}/>
				<Notification
					open={this.state.showNotification}
					close={()=>{
							this.setState({
								showNotification: false
							});
						}
					}
					message={this.state.notificationMessage}/>


			</div>
			)}
			</DialogContextConsumer>
		);
	}
}
