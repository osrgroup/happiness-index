import React from 'react'
import styled from 'styled-components';
import Modal from '../../../common/modals/Modal.jsx';
import { FormattedMessage } from 'react-intl';
import IntlProvider from '../../../common/Localization/LocalizationProvider';

const Separator = styled.div`
	height: 10px;
`

export default class RegisterEmailModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			firstName: '',
			lastName: '',
			email: '',
			pwd: ''
		};

		this.submit = this.submit.bind(this);
	}

	submit(){
		this.props.submit(this.state);
	}

	render(){
		let _this = this;
		const { formatMessage } = IntlProvider.intl;
		return(
			<Modal title={'Register a new QDACity Account!'}
				close = {this.props.close}
				open={this.props.open}
				submit={this.submit}
			>
				<Separator/>
				<FormattedMessage
					id="index.registeremailpwd.first_name"
					defaultMessage="First Name"
				/>
				<input
					id='regFirstName'
					value={this.state.firstName}
					onChange={(e)=>{this.setState({firstName: e.target.value});}}/>
				<Separator/>

				<FormattedMessage
					id="index.registeremailpwd.last_name"
					defaultMessage="Last Name"
				/>
				<input
					id='regLastName'
					value={this.state.lastName}
					onChange={(e)=>{this.setState({lastName: e.target.value});}}/>
				<Separator/>

				<FormattedMessage
					id="index.registeremailpwd.email"
					defaultMessage="Email"
				/>
				<input
					id='regEmail'
					value={this.state.email}
					onChange={(e)=>{this.setState({email: e.target.value});}}/>
				<Separator/>

				<FormattedMessage
					id="index.registeremailpwd.pwd"
					defaultMessage="Password"
				/>
				<input
					id='regPwd'
					type="password"
					value={this.state.pwd}
					onChange={(e)=>{this.setState({pwd: e.target.value});}}/>
				<Separator/>
			</Modal>
		);
	}
}