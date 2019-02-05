import React from 'react';
import IntlProvider from './Localization/LocalizationProvider';
import styled from 'styled-components';

import CourseEndPoint from './endpoints/CourseEndpoint';

import { BtnDefault } from './styles/Btn.jsx';
import { ListMenu } from './styles/ItemList.jsx';

import { StyledSearchField } from './styles/SearchBox.jsx';
import Notification from './modals/Notification.jsx';

export default class InviteUserField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userEmail: '',
			showNotification: false,
			notificationMessage: ''
		};
		this.updateUserEmail = this.updateUserEmail.bind(this);
		this.inviteUser = this.inviteUser.bind(this);
	}

	updateUserEmail(e) {
		this.setState({
			userEmail: e.target.value
		});
	}

	handleResponse(resp) {
		const { formatMessage } = IntlProvider.intl;
		var _this = this;
		resp.then(function(resp) {
				_this.setState({
					notificationMessage: formatMessage(
						{
							id: 'inviteuserfield.invited',
							defaultMessage: '{email} has been invited'
						},
						{
							email: _this.state.userEmail
						}
					),
					showNotification: true
				});
			})
			.catch(function(resp) {
				_this.setState({
					notificationMessage: formatMessage(
						{
							id: 'inviteuserfield.not_found',
							defaultMessage: '{email} was not found'
						},
						{
							email: _this.state.userEmail
						}
					),
					showNotification: true
				});
			});
	}

	inviteUser() {
		// To be overridden in subclass!
	}

	render() {
		const { formatMessage } = IntlProvider.intl;
		const _this = this;
		const searchFieldPlaceholder = formatMessage({
			id: 'inviteuserfield.search',
			defaultMessage: 'User Email'
		});

		return (
			<ListMenu>
				<StyledSearchField
					type="text"
					className="searchfield"
					placeholder={searchFieldPlaceholder}
					value={this.state.userEmail}
					onChange={this.updateUserEmail}
					onKeyPress={e => {
						if (e.key === 'Enter') this.inviteUser();
					}}
				/>
				<BtnDefault type="button" onClick={this.inviteUser}>
					<FontAwesomeIcon icon={['fas','paper-plane']}  size='lg'/> Invite
				</BtnDefault>
				<Notification
					open={this.state.showNotification}
					close={()=>{
							this.setState({
								showNotification: false
							});
						}
					}
					message={this.state.notificationMessage}/>
			</ListMenu>
		);
	}
}
