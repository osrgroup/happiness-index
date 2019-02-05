import React from 'react'
import styled from 'styled-components';
import Modal from './../modals/Modal.jsx';
import { FormattedMessage } from 'react-intl';
import SigninFormula from '../../pages/index/sign-in/SigninFormula.jsx';


const ChangeAccountWrapper = styled.div`
	padding: 20px 50px 20px 50px;
	margin-bottom: 20px;
	padding-bottom: 20px;
	margin-left: auto;
	margin-right: auto;
	max-width: 400px;
	opacity: 0.8;
	& > div {
		font-size: 18px;
	}
`;

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
		return(
			<Modal title={'Change Account'}
				close = {this.props.close}
				open={this.props.open}
				submit={this.submit}
				buttons='CANCEL'
			>
				<ChangeAccountWrapper className="container-fluid">
					<SigninFormula
						auth={_this.props.auth}
						onSignedIn={_this.props.onSignedIn}
					/>
				</ChangeAccountWrapper>
			</Modal>
		);
	}
}