import React from 'react'
import styled from 'styled-components';
import Modal from './Modal.jsx';
import { FormattedMessage } from 'react-intl';
import IntlProvider from '../Localization/LocalizationProvider';

export default class Confirm extends React.Component {
	constructor(message) {
		super();
		this.message = message;
	}

	render(){
		const { formatMessage } = IntlProvider.intl;
		return(
			<Modal title={'Please confirm'}
				close = {this.props.close}
				open={this.props.open}
				submit={this.props.confirmAction}
			>
				{this.props.message}
			</Modal>
		);
	}
}
