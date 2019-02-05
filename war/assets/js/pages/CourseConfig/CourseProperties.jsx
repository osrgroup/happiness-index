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
		width: 200px;
	}
	&>button{
		width: 135px;
	}
`;

export default class CourseProperties extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: ''
		};
		this.changeName = this.changeName.bind(this);
	}

	setDeadlines(deadlines){
		this.setState({
			deadlines: deadlines
		})
	}

	changeName(name) {
		this.props.updateCourseProperties(name, this.props.standupArchiveEmail)
	}

	changeEmail(email) {
		this.props.updateCourseProperties(this.props.label, email)
	}

	changeInstitution(institution){
		this.props.updateInstitution(institution);
	}

	renderArchiveButton(){
		if (this.props.archived){
			return (
				<BtnDefault
					href="#"
					onClick={this.props.pullFromArchive}
				>
					<FontAwesomeIcon icon={['fas','archive']} />
					<span>{"Pull from archive"}</span>
				</BtnDefault>
			);
		} else {
			return (
				<BtnDefault
					href="#"
					onClick={this.props.archiveCourse}
				>
					<FontAwesomeIcon icon={['fas','archive']} />
					<span>{"Archive course"}</span>
				</BtnDefault>
			);
		}
	}

	renderDeleteButton(){
		return (
			<BtnDanger
				href="#"
				onClick={this.props.deleteCourse}
			>
				<FontAwesomeIcon icon={['fas','skull-crossbones']} />
				<span>{"Delete course"}</span>
			</BtnDanger>
		);
	}

	render(){
		return(
			<div>
			<Property>
				<Label>Course Name: </Label>
				<input
					type={'text'}
					required={'required'}
					value={this.props.label}
					onChange={event =>
						this.changeName(event.target.value)
					}

				/>
			</Property>
			<Property>
			<Label>Standup email address: </Label>
			<input
				type={'text'}
				required={'required'}
				value={this.props.standupArchiveEmail}
				onChange={event =>
					this.changeEmail(event.target.value)
				}

			/>
			</Property>
			<Property>
			<Label>Institution: </Label>
			<input
				type={'text'}
				required={'required'}
				value={this.props.institution}
				onChange={event =>
					this.changeInstitution(event.target.value)
				}

			/>
			</Property>
			<Property>
				{this.renderArchiveButton()}
			</Property>
			<Property>
				{this.renderDeleteButton()}
			</Property>
			</div>
		);
	}
}