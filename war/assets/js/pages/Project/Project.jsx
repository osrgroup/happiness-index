import React from 'react'
import styled from 'styled-components';
import 'script-loader!../../../../components/URIjs/URI.min.js';
import  Page from 'common/styles/Page.jsx';
import {Panel, AdminPanel, Row}from 'common/styles/Panel.jsx';
import  Location from 'common/styles/Location.jsx';
import  Link from 'common/styles/Link.jsx';
import  Participants from './Participants.jsx';
import HappinessSelector  from './HappinessSelector.jsx';
import HappinessChart from './HappinessChart.jsx'
import StandupEmails from './StandupEmails.jsx'
import { BtnDefault } from '../../common/styles/Btn.jsx';

import { LargeBtn } from 'common/styles/Btn.jsx';
const HappinessInput = Panel.extend`
	& > h1 {
		font-size: 55px;

		& > svg {
			margin: 0px 5px;
		}
	}
	& > h2 {
		margin-top: 10px;
		font-size: 35px;
	}
	& > h3 {
		margin-top: 10px;
	}
	text-align: center;

`;

const HappinessChartPanel = HappinessInput.extend`
	padding-top: 3px;
	padding-bottom: 3px;
`;

const SprintNumber = styled.div`
	border-radius: 50%;
	width: 50px;
	height: 50px;
	text-align: center;
	padding: 10px;
	border: 2px solid;
	display: inline-block;
	background-color: #333;
	color: white;
`;
const AdminBtn =  BtnDefault.extend`
	margin: 0px 10px;
`;
export default class Project extends React.Component {
	constructor(props) {
		super(props);
		this.chartRef = React.createRef();
		this.participantsRef = React.createRef();
		var urlParams = URI(window.location.search).query(true);

		this.state = {
			projectId: urlParams.project,
			courseId: urlParams.course
		};
		this.reloadChart = this.reloadChart.bind(this);
		this.redirectToProjects = this.redirectToProjects.bind(this);
		this.redirectToCourses = this.redirectToCourses.bind(this);
		this.joinProject = this.joinProject.bind(this);
		this.leaveProject = this.leaveProject.bind(this);
		this.loadProjectData = this.loadProjectData.bind(this);
		this.redirectToProjectConfig = this.redirectToProjectConfig.bind(this);

	}

	componentDidMount(){
		const _this = this;
		gapi.client.happiness.getTeachingTerm({'id' : this.state.courseId}).execute(function(resp){
			_this.setState({
				courseName: resp.label
			})
		});
		this.loadProjectData();
	}

	loadProjectData(){
		const _this = this;
		_this.participantsRef.current.loadParticipants();
		gapi.client.happiness.getProject({'id' : this.state.projectId}).execute(function(resp){
			_this.setState({
				projectName: resp.name,
				userJoined: resp.userJoined
			})
		});

		gapi.client.happiness.getCurrentSprint({'teachingTerm' : this.state.courseId}).execute(function(resp){
			_this.setState({
				currentSprint: resp.sprintNumber
			})
		});
	}


	reloadChart(){
		this.chartRef.current.loadHappinessData();
	}

	redirectToProjects(){
		this.props.history.push('/Projects?course='+this.state.courseId)
	}

	redirectToCourses(){
		this.props.history.push('/Courses')
	}

	redirectToProjectConfig(){
		this.props.history.push('/ProjectConfig?project='+this.state.projectId +'&course='+this.state.courseId);
	}

	joinProject(callback){
		let _this = this;
		gapi.client.happiness.joinProject({ 'id': this.state.projectId }).execute(function(resp){
    		if (!resp.code) {
				_this.loadProjectData();
				if (callback) callback();
			} else {
				window.alert("Something went wrong when trying to join. Please contact your supervisor.");
			}
    	});
	}

	leaveProject(){
		let _this = this;
		gapi.client.happiness.leaveProject({ 'projectID': this.state.projectId }).execute(function(resp){
    		if (!resp.code) {
				_this.loadProjectData();
			} else {
				window.alert("Something went wrong when trying to join. Please contact your supervisor.");
			}
    	});
	}


	renderJoinLeaveButton(){
		if (!this.state.userJoined) return (
			<LargeBtn
				href="#"
				onClick={()=>{this.joinProject()}}
			>
				<FontAwesomeIcon icon={['fas','user-plus']} />
				<span>{"Join"}</span>
			</LargeBtn>
		);
		else return (
			<LargeBtn
				href="#"
				onClick={()=>{this.leaveProject()}}
			>
				<FontAwesomeIcon icon={['fas','user-minus']} />
				<span>{"Leave"}</span>
			</LargeBtn>
		);
	}

	renderAdminPanel(){
		if (!this.props.user || this.props.user.type != "ADMIN") return null;
		return(
			<AdminPanel>
				<AdminBtn
					href="#"
					onClick={this.redirectToProjectConfig}
				>
					<FontAwesomeIcon icon={['fas','wrench']} />
					<span>{"Project Settings"}</span>
				</AdminBtn>
			</AdminPanel>
		);
	}

	render(){
		return(
			<Page>
				<Location >
					>>
					<Link onClick={this.redirectToCourses}>Courses</Link>
					<span> / </span>
					<Link onClick={this.redirectToProjects}>{this.state.courseName}</Link>
					<span> / </span>
					<span>{this.state.projectName}</span>
				</Location>
				{this.renderAdminPanel()}
				<Row  className="row">
					<div  className="col-lg-12 ">
						<HappinessInput>
						<HappinessSelector
							courseId={this.state.courseId}
							projectId={this.state.projectId}
							reloadChart={this.reloadChart}
							joinProject={this.joinProject}
							userJoined={this.state.userJoined}
							/>

						</HappinessInput>
					</div>
				</Row>
				<Row  className="row">
					<div  className="col-lg-9 ">
						<HappinessChartPanel>
							<HappinessChart
							ref={this.chartRef}
							courseId={this.state.courseId}
							projectId={this.state.projectId}
							user={this.props.user}
							/>
						</HappinessChartPanel>
					</div>
					<div  className="col-lg-3 ">
						<HappinessInput>
							<h2>
								Current Sprint
							</h2>
							<h3>
								<SprintNumber>{this.state.currentSprint}</SprintNumber>
							</h3>
						</HappinessInput>
						<HappinessInput>
							<h2>
								Participants
							</h2>
							<Participants ref={this.participantsRef} projectId={this.state.projectId}/>
							{this.renderJoinLeaveButton()}
						</HappinessInput>

					</div>
				</Row>
				<Row  className="row">
					<div  className="col-lg-12 ">
						<HappinessInput>
						<h2>
							Standup Emails
						</h2>
							<StandupEmails
								projectId = {this.state.projectId}
								currentSprint= {this.state.currentSprint}
							/>
						</HappinessInput>
					</div>
				</Row>
			</Page>
		);
	}
}