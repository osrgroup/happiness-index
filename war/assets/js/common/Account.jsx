import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import { BtnDefault, BtnPrimary } from './styles/Btn.jsx';

import ChangeUserModal from './modals/ChangeUserModal.jsx';

const UserImage = styled.img`
	width: 96px;
`;

export default class Account extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showChangeUserModal: false
		};
		this.authenticationProvider = props.auth.authentication;

		this.redirectToPersonalDashbaord = this.redirectToPersonalDashbaord.bind(
			this
		);

		this.onSignedIn = this.onSignedIn.bind(this);
		this.redirectToSettings = this.redirectToSettings.bind(this);
	}

	/**
	 * Redirects to the personal dashboard
	 */
	redirectToPersonalDashbaord() {
		this.props.history.push('/PersonalDashboard');
	}

	/**
	 * Redirects to the personal dashboard
	 */
	redirectToSettings() {
		this.props.history.push('/Settings');
	}

	onSignOut() {
		const _this = this;
		this.authenticationProvider.signOut().then(
			() => {
				_this.props.history.push('/');
			},
			error => {
				console.log(error);
				_this.props.history.push('/');
			}
		);
	}

	onSignedIn() {
		this.setState({
			showChangeUserModal: false
		});
		location.reload();
	}

	onChanceUser() {
		this.setState({
			showChangeUserModal: true
		});
	}

	render() {
		return (
			<div>
				<div className="navbar-content">
					<div className="row">
						<div className="col-xs-5">
							<UserImage
								id="currentUserPicture"
								src={this.props.auth.userProfile.picSrc}
								alt=""
								className="img-responsive"
							/>
							<p className="text-center small" />
						</div>
						<div className="col-xs-7">
							<span id="currentUserName">
								{this.props.auth.userProfile.name}
							</span>
							<span> </span>
							<span id="settingsIcon">
								<a href="#" onClick={this.redirectToSettings}>
									<FontAwesomeIcon icon={['fas','user-cog']} />
								</a>
							</span>
							<p id="currentUserEmail" className="text-muted small">
								{this.props.auth.userProfile.email}
							</p>
							<div className="divider" />
							<BtnPrimary onClick={this.redirectToPersonalDashbaord}>
								<FormattedMessage
									id="account.personal_dashboard"
									defaultMessage="Personal Dashboard"
								/>
							</BtnPrimary>
						</div>
					</div>
				</div>
				<div className="navbar-footer">
					<div className="navbar-footer-content">
						<div className="row">
							<div className="col-xs-6">
								<BtnDefault
									id="navBtnSwitchAccount"
									href="#"
									className="btn btn-default btn-sm"
									onClick={() => this.onChanceUser()}
								>
									<FormattedMessage
										id="account.switch_user"
										defaultMessage="Switch User"
									/>
								</BtnDefault>
							</div>
							<div className="col-xs-6">
								<BtnDefault
									id="navBtnSignOut"
									className="btn btn-default btn-sm pull-right"
									onClick={() => this.onSignOut()}
								>
									<FormattedMessage
										id="account.sign_out"
										defaultMessage="Sign Out"
									/>
								</BtnDefault>
							</div>
						</div>
					</div>
				</div>
				<ChangeUserModal
					open={this.state.showChangeUserModal}
					close={()=>{
							this.setState({
								showChangeUserModal: false
							});
						}
					}
					submit={()=>{
						let test = 4;
					}}
					auth={this.props.auth}
					onSignedIn={this.onSignedIn}/>
			</div>
		);
	}
}
