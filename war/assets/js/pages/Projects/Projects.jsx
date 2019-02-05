import React from 'react'
import styled from 'styled-components';
import { BtnDefault } from '../../common/styles/Btn.jsx';
import  Page from 'common/styles/Page.jsx';
import {Panel ,WarningPanel, AdminPanel}from 'common/styles/Panel.jsx';
import  Link from 'common/styles/Link.jsx';
import  Location from 'common/styles/Location.jsx';

import { DialogProvider } from 'modals/DialogProvider.jsx';
import ProjectList  from './ProjectList.jsx';
import 'script-loader!../../../../components/URIjs/URI.min.js';

const AdminBtn =  BtnDefault.extend`
	margin: 0px 10px;
`;


export default class Projects extends React.Component {
	constructor(props) {
		super(props);
		var urlParams = URI(window.location.search).query(true);

		this.state = {
			courseId: urlParams.course,
			projects: [],
			currentSprint: -1
		};
		this.loadProjects = this.loadProjects.bind(this);
		this.createProject = this.createProject.bind(this);
		this.redirectToCourses = this.redirectToCourses.bind(this);
		this.redirectToCourseConfig = this.redirectToCourseConfig.bind(this);
	}

	componentDidMount(){
		let _this = this;
		// this.auth2 = gapi.auth2.getAuthInstance();
		// this.auth2.isSignedIn.listen((resp1)=>{
		// 		_this.loadProjects();
		// });
		this.loadProjects();

		gapi.client.happiness.getTeachingTerm({'id' : this.state.courseId}).execute(function(resp){
			_this.setState({
				courseName: resp.label

			})
		});

		gapi.client.happiness.getCurrentSprint({'teachingTerm' : this.state.courseId}).execute(function(resp){
			_this.setState({
				currentSprint: resp.sprintNumber
			})
		});
	}

	loadProjects(){
		let _this = this;
		gapi.client.happiness.listProject({ 'teachingTerm': this.state.courseId }).execute(function(resp){
    		if (!resp.code) {
				_this.setState({
					projects: resp.items
				})
			}
    	});
	}

	createProject(){
		let _this = this;
		const elements = [
			{
				type: 'INPUT',
				name: 'name',
				label: "Project Name"
			},
			{
				type: 'TEXTFIELD',
				name: 'description',
				label: "Project Description"
			},

		];
		DialogProvider.openCustomForm('Create course', elements, (data)=>{
			var project = {};

    		project.name = data.name;
    		project.description = data.description;
    		project.teachingTerm = _this.state.courseId;

  	      gapi.client.happiness.insertProject(project).execute(function (resp) {
  	        if (!resp.code) {
			 _this.setState({
				 projects: [resp,..._this.state.projects]
			 });
  	        } else {
  	          console.log(resp.message);
  	        }
  	      });
		});
	}

	redirectToCourses(){
		this.props.history.push('/Courses')
	}

	redirectToCourseConfig(course){
		this.props.history.push('/CourseConfig?course='+this.state.courseId);
	}

	renderNoSprintWarning(){
		if (this.state.currentSprint !== undefined) return null;
		if (this.props.user && this.props.user.type != "ADMIN") return null;
		return (
			<WarningPanel>
				The course does not seem to have sprints configured. Check the <Link onClick={this.redirectToCourseConfig}>course settings</Link>.
			</WarningPanel>
		);
	}

	renderAdminPanel(){
		if (!this.props.user || this.props.user.type != "ADMIN") return null;
		return(
			<AdminPanel>
				<AdminBtn
					href="#"
					onClick={this.createProject}
				>
					<FontAwesomeIcon icon={['fas','plus']} />
					<span>{"New Project"}</span>
				</AdminBtn>

				<AdminBtn
					href="#"
					onClick={this.redirectToCourseConfig}
				>
					<FontAwesomeIcon icon={['fas','wrench']} />
					<span>{"Course Settings"}</span>
				</AdminBtn>
			</AdminPanel>
		);
	}


	render(){
		return(
			<Page>
			<div>

			<Location >
				>>
				<Link onClick={this.redirectToCourses}>Courses</Link>
				<span> / </span>
				<span>{this.state.courseName}</span>
			</Location>
			{this.renderNoSprintWarning()}
			{this.renderAdminPanel()}
				<div>
					<ProjectList courseId={this.state.courseId} projects={this.state.projects} history={this.props.history}/>
				</div>
				</div>
			</Page>
		);
	}
}