import React from 'react';
import styled from 'styled-components';
import  Page from 'common/styles/Page.jsx';
import SprintConfig from './SprintConfig.jsx'
import CourseProperties from './CourseProperties.jsx'
import 'script-loader!../../../../components/URIjs/URI.min.js';
import {Panel}from 'common/styles/Panel.jsx';
import  Link from 'common/styles/Link.jsx';
import  Location from 'common/styles/Location.jsx';
import { DialogProvider } from 'modals/DialogProvider.jsx';


const ConfigPanel = styled.div`
	border: 1px solid ${props => props.theme.borderDefault};
	border-left: 10px solid;
	border-right: 10px solid;
	padding: 20px 30px 20px 30px;
	margin 0px 25px;
	margin-bottom: 20px;
	background-color: ${props => props.theme.defaultPaneBg};
	& > h1 {
		font-size: 55px;
		& > svg {
			margin: 0px 5px;
		}
	}
	& > h2 {
		font-size: 35px;
	}

`;


export default class CourseConfig extends React.Component {
	constructor(props) {
		super(props);
		this.sprintConfigRef = React.createRef();
		this.coursePropertiesRef = React.createRef();
		var urlParams = URI(window.location.search).query(true);

		this.state = {
			courseId: urlParams.course
		};

		this.updateSprints = this.updateSprints.bind(this);
		this.redirectToCourses = this.redirectToCourses.bind(this);
		this.redirectToProjects = this.redirectToProjects.bind(this);
		this.updateCourseProperties = this.updateCourseProperties.bind(this);
		this.archiveCourse = this.archiveCourse.bind(this);
		this.pullFromArchive = this.pullFromArchive.bind(this);
		this.deleteCourse = this.deleteCourse.bind(this);
		this.updateInstitution = this.updateInstitution.bind(this);
	}

	componentDidMount(){
		let _this = this;
		this.auth2 = gapi.auth2.getAuthInstance();
		this.auth2.isSignedIn.listen((resp1)=>{
				_this.loadCourse();
		});
		_this.loadCourse();
	}

	loadCourse(){
		let _this = this;
		gapi.client.happiness.getTeachingTerm({'id' : this.state.courseId}).execute(function(resp) {
			 if (!resp.code) {
				 _this.setState({
					joinable: resp.joinable,
	 				label : resp.label,
	 				standupArchiveEmail: resp.standupArchiveEmail,
					archived: resp.archived,
					institution: resp.institution,
				 });
				 resp.sprints = resp.sprints ? resp.sprints : [];
				 _this.sprintConfigRef.current.setDeadlines(resp.sprints.map(sprint => new Date(sprint.deadline)));
			 } else {
				 console.log(resp.message);
			}
		});
	}

	updateSprints(sprints){
		var teachingTerm= {};
		teachingTerm.id = this.state.courseId;
		teachingTerm.label = this.state.label;
		teachingTerm.sprints = sprints;
		teachingTerm.joinable = this.state.joinable;
		teachingTerm.standupArchiveEmail =  this.state.standupArchiveEmail;
		teachingTerm.archived =  this.state.archived;
		teachingTerm.institution = this.state.institution;

		gapi.client.happiness.updateTeachingTerm(teachingTerm).execute(function(resp) {
			 if (!resp.code) {
				console.log("Sprints have been updated");
			 }
			 else
			 {
				console.log("Sprints were not updated");
			 }
		});
	}

	updateCourseProperties(label, standupEmail){
		var teachingTerm= {};
		teachingTerm.id = this.state.courseId;
		teachingTerm.label = label ? label : this.state.label;
		teachingTerm.sprints = this.sprintConfigRef.current.getSprints();
		teachingTerm.joinable = this.state.joinable;
		teachingTerm.standupArchiveEmail = standupEmail ? standupEmail : this.state.standupArchiveEmail;
		teachingTerm.institution = this.state.institution;
		teachingTerm.archived = this.state.archived;

		this.setState({
		   label : label ? label : this.state.label,
		   standupArchiveEmail: standupEmail ? standupEmail : this.state.standupArchiveEmail,
		});
		gapi.client.happiness.updateTeachingTerm(teachingTerm).execute(function(resp) {
			 if (!resp.code) {
				console.log("Course has been updated");
			 }
			 else
			 {
				alertify.log("Course has not been updated");
			 }
		});
	}

	redirectToCourses(){
		this.props.history.push('/Courses')
	}

	redirectToProjects(course){
		this.props.history.push('/Projects?course='+this.state.courseId);
	}

	pullFromArchive(){
		this.setState({
		   archived : false
	   }, () => {
		   this.updateCourseProperties(undefined,undefined);
	   });
	   DialogProvider.staticNotification("The course is now visible to students when they log on.");
	}

	updateInstitution(institution){
		this.setState({
		   institution : institution
	   }, () => {
		   this.updateCourseProperties(undefined,undefined);
	   });
	}

	archiveCourse(){
		this.setState({
		   archived : true
	   }, () => {
		   this.updateCourseProperties(undefined,undefined);
	   });
	   DialogProvider.staticNotification("The course is now archived and no longer visible when students log on.");
	}

	deleteCourse(){
		const _this = this;
		DialogProvider.staticConfirmation("Confirm course deletion", ()=>{
			gapi.client.happiness.removeTeachingTerm({id: _this.state.courseId}).execute(function(resp) {
				 if (!resp.code) {
					console.log("Course has been deleted");
					_this.redirectToCourses();
				 }
				 else
				 {
					console.log("Course has not been deleted");
				 }
			});
		});

	}

	render(){
		return(
			<Page>
			<Location>
				>>
				<Link onClick={this.redirectToCourses}>Courses</Link>
				<span> / </span>
				<Link onClick={this.redirectToProjects}>{this.state.label}</Link>
				<span> / </span>
				<span>Course configuration</span>
			</Location>
			<div  className="row">
				</div>
				<div  className="row">
					<div  className="col-lg-6 ">
						<Panel>
						<h2>
							General
						</h2>
						<CourseProperties
							label= {this.state.label}
							standupArchiveEmail= {this.state.standupArchiveEmail}
							updateCourseProperties={this.updateCourseProperties}
							archived={this.state.archived}
							institution={this.state.institution}
							pullFromArchive={this.pullFromArchive}
							archiveCourse={this.archiveCourse}
							deleteCourse={this.deleteCourse}
							updateInstitution={this.updateInstitution}
							ref={this.coursePropertiesRef}
						/>
						</Panel>
					</div>
					<div  className="col-lg-6 ">
						<Panel>
						<h2>
							Sprints
						</h2>
						<SprintConfig
							ref={this.sprintConfigRef}
							updateSprints = {this.updateSprints}
						/>
						</Panel>
					</div>
				</div>
				<div  className="row">


				</div>
			</Page>
		);
	}
}