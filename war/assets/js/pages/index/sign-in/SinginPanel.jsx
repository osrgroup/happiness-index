//@ts-check
import React from 'react';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';

import SignInFormula from './SigninFormula.jsx';

import { BtnLg, BtnDefault, BtnPrimary } from '../../../common/styles/Btn.jsx';

const PanelWrapper = styled.div`
	border: 1px solid ${props => props.theme.borderPrimaryHighlight};
	margin-top: 50px;
	padding: 20px 50px 20px 50px;
	margin-bottom: 20px;
	padding-bottom: 20px;
	background-color: ${props => props.theme.defaultPaneBg};
	color: ${props => props.theme.defaultText};
	margin-left: auto;
	margin-right: auto;
	width: 90%;
	max-width: 400px;
	opacity: 0.8;
	& > div {
		font-size: 18px;
	}
`;

const UserThumbnail = styled.img`
	height: 80px;
	width: 80px;

	margin-top: 20px;
	margin-bottom: 7px;
`;

const ButtonGroupWrapper = styled.div`
	& > button {
		margin: 3px 10px;
	}
`;

export default class SigninPanel extends React.Component {
	constructor(props) {
		super(props);

		this.onSignedIn = this.onSignedIn.bind(this);
	}

	async onSignOut() {
		await this.props.auth.authentication.signOut();
		this.props.history.push('/');
	}

	onSignedIn() {
		this.props.history.push('/PersonalDashboard');
	}

	render() {
		return (
			<PanelWrapper className="container-fluid">
				<SignInFormula setUser={this.props.setUser} auth={this.props.auth} onSignedIn={this.onSignedIn} history={this.props.history} />
			</PanelWrapper>
		);
	}
}
