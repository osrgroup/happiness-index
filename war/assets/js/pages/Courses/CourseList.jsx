import React from 'react'
import styled from 'styled-components';
import { BtnDefault } from '../../common/styles/Btn.jsx';
import {Panel}from 'common/styles/Panel.jsx';


const StyledInstitution =  styled.div`
	font-size: 18px;
`;
const CourseBtn =  BtnDefault.extend`
	font-size: 20px;
	padding: 10px;
	margin: 20px 5px 0px 5px;
`;

export default class CourseList extends React.Component {
	constructor(props) {
		super(props);
	}

	redirectToProjects(course){
		this.props.history.push('/Projects?course='+course.id);
	}

	redirectToCourseConfig(course){
		this.props.history.push('/CourseConfig?course='+course.id);
	}

	render(){
		return(
			<div>
			{
				this.props.courses.map((course, i) =>
					<Panel>
						<h1>{course.label}</h1>
						<StyledInstitution><FontAwesomeIcon icon={['fas','university']} /> {course.institution} <FontAwesomeIcon icon={['fas','university']} /></StyledInstitution>
						<CourseBtn
							href="#"
							onClick={()=>{this.redirectToProjects(course)}}
						>
							<FontAwesomeIcon icon={['fas','graduation-cap']} />
							<span>{"Select Course"}</span>
						</CourseBtn>
					</Panel>
				)
			}
			</div>
		);
	}
}