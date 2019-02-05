import React from 'react'
import styled from 'styled-components';
import Modal from './Modal.jsx';
import { FormattedMessage } from 'react-intl';

export default class Notification extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}


	render(){
		return(
			<Modal title='Notification'
				width={'400px'}
				close = {this.props.close}
				open={this.props.open}
				buttons='OK'
			>
				{this.props.message}
			</Modal>
		);
	}
}