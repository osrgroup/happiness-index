import React from 'react';
import styled from 'styled-components';
import  Page from 'common/styles/Page.jsx';
import ProjectProperties from './ProjectProperties.jsx'
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
			courseId: urlParams.course,
			projectId: urlParams.project
		};
		this.redirectToCourses = this.redirectToCourses.bind(this);
		this.redirectToProjects = this.redirectToProjects.bind(this);
		this.redirectToProject = this.redirectToProject.bind(this);
		this.updateProjectProperties = this.updateProjectProperties.bind(this);
		this.loadProject = this.loadProject.bind(this);
		this.deleteProject = this.deleteProject.bind(this);

	}

	componentDidMount(){
		let _this = this;
		this.auth2 = gapi.auth2.getAuthInstance();
		this.auth2.isSignedIn.listen((resp1)=>{
			_this.loadCourse();
			_this.loadProject();
		});
		_this.loadCourse();
		_this.loadProject();

	}

	loadCourse(){
		let _this = this;
		gapi.client.happiness.getTeachingTerm({'id' : this.state.courseId}).execute(function(resp) {
			 if (!resp.code) {
				 _this.setState({
	 				courseName : resp.label
				 });
			 } else {
				 console.log(resp.message);
			}
		});
	}

	loadProject(){
		const _this = this;
		gapi.client.happiness.getProject({'id' : this.state.projectId}).execute(function(resp){
			_this.setState({
				projectName: resp.name,
				id: resp.id,
				description: resp.description,
				teachingTerm: resp.teachingTerm,
				users: resp.users,
				managerID: resp.managerID
			})
		});
	}

	updateProjectProperties(name, description){
		var project = {};

		project.id = this.state.id;
		project.name = name ? name : this.state.projectName;
		project.description = description ? description : this.state.description;
		project.teachingTerm = this.state.teachingTerm;
		project.users = this.state.users;
		project.managerID = this.state.managerID;
		gapi.client.happiness.updateProject(project).execute(function(resp) {
			if (!resp.code) {
				console.log("Project description updated");
			}
		});

		this.setState({
		   projectName : name ? name : this.state.projectName,
		   description: description ? description : this.state.description,
		});
	}

	redirectToCourses(){
		this.props.history.push('/Courses')
	}

	redirectToProjects(){
		this.props.history.push('/Projects?course='+this.state.courseId);
	}

	redirectToProject(){
		this.props.history.push('/Project?project='+this.state.projectId +'&course='+this.state.courseId);
	}

	deleteProject(){
		const _this = this;
		DialogProvider.staticConfirmation("Confirm project deletion", ()=>{
			gapi.client.happiness.removeProject({id: _this.state.projectId}).execute(function(resp) {
				 if (!resp.code) {
					console.log("Project has been deleted");
					_this.redirectToProjects();
				 }
				 else
				 {
					console.log("Project has not been deleted");
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
				<Link onClick={this.redirectToProjects}>{this.state.courseName}</Link>
				<span> / </span>
				<Link onClick={this.redirectToProject}>{this.state.projectName}</Link>
				<span> / </span>
				<span>Project settings</span>
			</Location>
			<div  className="row">
				</div>
				<div  className="row">
					<div  className="col-lg-12 ">
						<Panel>
						<h2>
							Project Settings
						</h2>
						<ProjectProperties
							projectName= {this.state.projectName}
							description= {this.state.description}
							deleteProject={this.deleteProject}
							updateProjectProperties={this.updateProjectProperties}
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