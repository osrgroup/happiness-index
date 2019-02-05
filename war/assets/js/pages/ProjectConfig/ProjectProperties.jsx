import React from 'react'
import styled from 'styled-components';
import { BtnDefault, BtnDanger } from '../../common/styles/Btn.jsx';

const Label = styled.span`
display: inline-block;
	width: 150px;
	text-align: right;

`;
const Property = styled.div`
	margin: 5px;

	&>input{
		width: 300px;
	}
	&>textarea{
		vertical-align: text-top;
		width: 300px;
		height: 150px;
	}
	&>button{
		width: 135px;
	}
`;

export default class ProjectProperties extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: ''
		};
		this.changeName = this.changeName.bind(this);
		this.changeDescription = this.changeDescription.bind(this);

	}

	setDeadlines(deadlines){
		this.setState({
			deadlines: deadlines
		})
	}

	changeName(name) {
		this.props.updateProjectProperties(name, this.props.description)
	}

	changeDescription(description) {
		this.props.updateProjectProperties(this.props.projectName, description)
	}

	renderDeleteButton(){
		return (
			<BtnDanger
				href="#"
				onClick={this.props.deleteProject}
			>
				<FontAwesomeIcon icon={['fas','skull-crossbones']} />
				<span>{"Delete project"}</span>
			</BtnDanger>
		);
	}


	render(){
		return(
			<div>
			<Property>
				<Label>Project Name: </Label>
				<input
					type={'text'}
					required={'required'}
					value={this.props.projectName}
					onChange={event =>
						this.changeName(event.target.value)
					}

				/>
			</Property>
			<Property>
			<Label>Description: </Label>
			<textarea value={this.props.description} onChange={event =>
				this.changeDescription(event.target.value)
			}/>

			</Property>
			<Property>
				{this.renderDeleteButton()}
			</Property>
			</div>
		);
	}
}