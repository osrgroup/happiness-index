import React from 'react'
import { BtnDefault } from '../../common/styles/Btn.jsx';
import CourseList from './CourseList.jsx';
import styled from 'styled-components';
import { DialogProvider } from 'modals/DialogProvider.jsx';
import  Page from 'common/styles/Page.jsx';
import {Panel, AdminPanel}from 'common/styles/Panel.jsx';
import  Location from 'common/styles/Location.jsx';

const AdminBtn =  BtnDefault.extend`
	margin: 0px 10px;
`;

export default class Courses extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			courses: []
		};
		this.loadCourses = this.loadCourses.bind(this);
		this.createCourse = this.createCourse.bind(this);
		this.redirectToCourseArchive = this.redirectToCourseArchive.bind(this);


	}

	componentDidMount(){
		let _this = this;
		this.auth2 = gapi.auth2.getAuthInstance();
		this.auth2.isSignedIn.listen((resp1)=>{
				_this.loadCourses();
		});
		_this.loadCourses();

	}

	loadCourses(){
		let _this = this;
		gapi.client.happiness.listTeachingTerm({'onlyNonArchived' : true}).execute(function(resp){ // FIXME Teaching Term should be configurable
    		if (!resp.code && resp.items) {
				_this.setState({
					courses: resp.items
				})
			}
    	});
	}

	createCourse(){
		const elements = [
			{
				type: 'INPUT',
				name: 'name',
				label: "Course Name"
			},
			{
				type: 'INPUT',
				name: 'institution',
				label: "Institution"
			},
			{
				type: 'INPUT',
				name: 'email',
				label: "Standup Email Address"
			},

		];
		DialogProvider.openCustomForm('Create course', elements, (data)=>{
			let _this = this;
	      var teachingTerm = {};
  	      teachingTerm.label = data.name;
  	      teachingTerm.standupArchiveEmail = data.email;
		  teachingTerm.institution = data.institution;
		  teachingTerm.joinable = true;
  	      gapi.client.happiness.insertTeachingTerm(teachingTerm).execute(function (resp) {
  	        if (!resp.code) {
			  _this.setState({
 				 courses: [resp,..._this.state.courses]
 			 })
  	        } else {
  	          console.log(resp.message);
  	        }
  	      });
		});
	}

	redirectToCourseArchive(course){
		this.props.history.push('/CourseArchive');
	}

	renderAdminPanel(){
		if (!this.props.user || this.props.user.type != "ADMIN") return null;
		return (
			<AdminPanel>
				<AdminBtn
					href="#"
					onClick={this.createCourse}
				>
					<FontAwesomeIcon icon={['fas','plus']} />
					<span>{"New Course"}</span>
				</AdminBtn>
				<AdminBtn
					href="#"
					onClick={this.redirectToCourseArchive}
				>
					<FontAwesomeIcon icon={['fas','archive']} />
					<span>{"View Course Archive"}</span>
				</AdminBtn>
			</AdminPanel>
		);
	}

	render(){
		return(
			<Page>
			<Location >
				>>
				<span>Courses</span>
			</Location>
			{this.renderAdminPanel()}

			<CourseList courses={this.state.courses} setCourse={this.props.setCourse} history={this.props.history}/>
			</Page>
		);
	}
}