import React from 'react'
import styled from 'styled-components';
import Modal from './../modals/Modal.jsx';
import { FormattedMessage } from 'react-intl';

const StyledInput = styled.div`
	padding-top: 3px;
	padding-bottom: 3px;
	display: flex;
	justify-content: center;
	& > label {
		margin-left: 5px;
		margin-right: 5px;
		width: 35%;
		text-align: right;
	}
	& > input {
		margin-left: 5px;
		margin-right: 5px;
		width: 55%;
	}
`

export default class ConfirmRegistrationData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			firstName: '',
			lastName: '',
			email: ''
		};

		this.submit = this.submit.bind(this);
		this.renderForm = this.renderForm.bind(this);
	}

	submit(){
		this.props.submit(this.state);
	}

	renderForm(){
		if (!this.props.googleProfile && !this.props.facebookProfile && !this.props.twitterProfile) return null;
		let profile = this.props.googleProfile ? this.props.googleProfile : profile;
		profile = this.props.facebookProfile ? this.props.facebookProfile : profile;
		profile = this.props.twitterProfile ? this.props.twitterProfile : profile;
		//const displayNameParts = profile.name.split(' ');
		console.log("[ConfirmRegistrationData] profile" + profile);
		const lastName =  profile.w3 ? profile.w3.wea : '';
		const firstName = profile.w3 ? profile.w3.ofa  : '';
		const email = profile.w3 ? profile.w3.U3  : '';

		console.log("[ConfirmRegistrationData] w3" + profile.w3);
		console.log("[ConfirmRegistrationData] lastName" + lastName);
		console.log("[ConfirmRegistrationData] firstName" + firstName);
		console.log("[ConfirmRegistrationData] email" + email);
		if (!this.state.email && email){
			this.setState({
				firstName: firstName ? firstName : '',
				lastName: lastName ? lastName : '',
				email: email ? email : '',
			})
		}

		const firstNameLabel = 'First Name';
		const lastNameLabel =  'Last Name';
		const emailLabel = 'Email';

		return (
			<div>
				<StyledInput>
					<label for="firstName">{firstNameLabel}</label>
					<input onChange={(e)=>{this.setState({firstName: e.target.value});}} name="firstName" type="text" placeholder={firstNameLabel} value={this.state.firstName} required />
				</StyledInput>
				<StyledInput>
					<label for="lastName">{lastNameLabel}</label>
					<input onChange={(e)=>{this.setState({lastName: e.target.value});}} name="lastName" type="text" placeholder={lastNameLabel} value={this.state.lastName} required />
				</StyledInput>
				<StyledInput>
					<label for="email">{emailLabel}</label>
					<input onChange={(e)=>{this.setState({email: e.target.value});}} name="email" type="text" placeholder={emailLabel} value={this.state.email} required />
				</StyledInput>
			</div>
		);
	}

	render(){
		let _this = this;
		return(
			<Modal title={'Please confirm:'}
				width={'400px'}
				close = {this.props.close}
				open={this.props.open}
				submit={this.submit}
			>
				{this.renderForm()}
			</Modal>
		);
	}
}