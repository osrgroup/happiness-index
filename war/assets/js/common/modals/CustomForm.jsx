import React from 'react'
import styled from 'styled-components';
import Modal from '../../common/modals/Modal.jsx';
import { FormattedMessage } from 'react-intl';
import DropDownButton from '../styles/DropDownButton.jsx';

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
	& > div {
		margin-left: 5px;
		margin-right: 5px;
		width: 55%;
	}
	& > textarea {
		margin-left: 5px;
		margin-right: 5px;
		width: 55%;
	}
`

export default class CustomForm extends React.Component {
	constructor(message) {
		super();
		this.state = {
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.renderElements = this.renderElements.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	onSubmit(){
		this.props.onSubmit(this.state);
		this.props.close();
	}

	handleInputChange(event, id) {
	    const target = event.target;
	    this.setState({
	      [target.name]: target.value
	    });
	  }

	renderElements(){
		const _this = this;
		if (!this.props.elements) return;
		const elements = this.props.elements.map((element, index) => {
			if (element.default && !_this.state[element.name]) _this.state[element.name] = element.default;
			switch (element.type) {
				case "INPUT":
					return (
						<StyledInput>
							<label for={element.name}>{element.label}</label>
							<input onChange={(e)=>{_this.setState({[element.name]: e.target.value});}} name={element.name} type="text" placeholder={element.label} value={_this.state[element.name]} required />
						</StyledInput>
					);
					break;
				case 'DROPDOWN':
					element.dropDownElements.forEach((el)=>{
						el.onClick = (()=>{
							_this.setState({[element.name]: el.id});
						})
					});
					return (
						<StyledInput>
							<label for={element.name}>{element.label}</label>
							<DropDownButton
								isListItemButton={true}
								items={element.dropDownElements}
								initText={element.initText}
							/>
						</StyledInput>
					);
				break;
				case "TEXTFIELD":
					return (
						<StyledInput>
							<label for={element.name}>{element.label}</label>
							<textarea  onChange={(e)=>{_this.setState({[element.name]: e.target.value});}} placeholder={element.label}  rows="15" cols="200" name={element.name} value={_this.state[element.name]} required />
						</StyledInput>
					);
					break;
				case "CHECKBOXES":
					if (!this.state[element.name]) this.state[element.name] = {};
					return (
						<StyledInput>
							<label for={element.name}>{element.label}</label>
							<div>

							{
								element.checkBoxElements.map((cbElemnent, index)=>{
									return (
										[
										<label>
											<input
												type="checkbox"
												name={element.name}
												value={cbElemnent.id}
												checked={_this.state[element.name][cbElemnent.id]}
												onChange={(e)=>{

													if (!e.target.checked){
														delete _this.state[element.name][cbElemnent.id];}
													else _this.state[element.name][cbElemnent.id] = e.target.checked;
													_this.setState({
												      [element.name]: _this.state[element.name]
												    });
												}}
											/>
											{cbElemnent.title}
										</label>,
										<br/>
										]

									);
								})
							}

							</div>
						</StyledInput>
					);
					break;
				default: // No or unknown type defined
					return;
					break;
			}
		});

		return elements;
	}

	render(){
		return(
			<Modal title={this.props.title}
				close = {this.props.close}
				open={this.props.open}
				submit={this.onSubmit}
			>
				{this.renderElements()}
			</Modal>
		);
	}
}
