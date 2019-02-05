import React from 'react'
import styled from 'styled-components';
import { LargeBtn } from 'common/styles/Btn.jsx';
import { DialogProvider } from 'modals/DialogProvider.jsx';

const StyledTextField = styled.textarea`
	width: 100%;
	height: 250px;
	font-size: 16px;
`;

export default class StandupEmails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			done: '',
			plans: '',
			challenges: ''
		};
		this.changeDone = this.changeDone.bind(this);
		this.changePlans = this.changePlans.bind(this);
		this.changeChallenges = this.changeChallenges.bind(this);
		this.sendStandupEmail = this.sendStandupEmail.bind(this);
	}


	changeDone(event) {
		const done = event.target.value;
		this.setState({done: done});
	}

	changePlans(event) {
		const plans = event.target.value;
		this.setState({plans: plans});
	}

	changeChallenges(event) {
		const challenges = event.target.value;
		this.setState({challenges: challenges});
	}

	sendStandupEmail(){
		const _this = this;

	  var standup = {};

		standup.projectId = _this.props.projectId;
		standup.userName = "set by backend";
		standup.done = _this.state.done;
		standup.plan = _this.state.plans;
		standup.challenges = _this.state.challenges;
		standup.sprintNumber =  this.props.currentSprint;



		gapi.client.happiness.insertStandup(standup).execute(function(resp){
			if (!resp.code) {
				console.log("Your standup has been submitted");
				DialogProvider.staticNotification('Your standup has been submitted');
			}
			else{
				console.error("Error: standup not submitted correctly");
				DialogProvider.staticNotification('Error: standup could not be submitted correctly');
				console.log(resp.code);
			}
		})

	}

	render(){
		return(
			<div className="row">
				<div  className="col-lg-4">
					Done
					<StyledTextField value={this.state.done} onChange={this.changeDone} />
				</div>
				<div  className="col-lg-4">
					Plans
					<StyledTextField value={this.state.plans} onChange={this.changePlans} />
				</div>
				<div  className="col-lg-4">
					Challenges
					<StyledTextField value={this.state.challenges} onChange={this.changeChallenges} />
				</div>
				<LargeBtn
					href="#"
					onClick={()=>{this.sendStandupEmail()}}
				>
					<FontAwesomeIcon icon={['fas','paper-plane']} />
					<span>{"Send Email"}</span>
				</LargeBtn>
			</div>
		);
	}
}