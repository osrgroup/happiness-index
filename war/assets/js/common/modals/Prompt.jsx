import React from 'react'
import styled from 'styled-components';
import Modal from '../../common/modals/Modal.jsx';

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

export default class Prompt extends React.Component {
	constructor(message) {
		super();
		this.state = {
			promptInput: ''
		};

		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(){
		this.props.onSubmit(this.state.promptInput);
		this.props.close();
	}

	render(){
		return(
			<Modal title={this.props.title}
				close = {this.props.close}
				open={this.props.open}
				submit={this.onSubmit}
			>
				<StyledInput>
					<label for="name">{this.props.label}</label>
					<input id={'promptInputElement'} onChange={(e)=>{this.setState({promptInput: e.target.value});}} name="name" type="text" placeholder={this.props.label} value={this.state.promptInput} required />
				</StyledInput>
			</Modal>
		);
	}
}
