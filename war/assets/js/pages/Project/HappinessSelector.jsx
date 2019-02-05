import React from 'react';
import styled from 'styled-components';
import { DialogProvider } from 'modals/DialogProvider.jsx';
const StyledHappinessSelector = styled.h1`
	font-size: 55px;
	@media (max-width: 700px) {
    	font-size: 45px !important;
	}
`;

const HappinessIcon = styled.span`
	color: ${props => props.selected ? '#ff00a9' : '#333'};
	padding: 0px 3px;
	cursor: pointer;
	@media (max-width: 700px) {
    	padding: 0px 0px !important;
	}

`;

export default class HappinessSelector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
		this.promptToJoinProject = this.promptToJoinProject.bind(this);
		this.submitHappiness = this.submitHappiness.bind(this);
	}

	componentDidMount(){
		let _this = this;
		gapi.client.happiness.getCurrentHappiness({'teachingTerm' : this.props.courseId ,'projectId' : this.props.projectId}).execute(function(resp){
			_this.setState({
				currentHappiness: resp.happiness
			})
		});
	}

	promptToJoinProject(){
		const title= "You need to join the project before submitting happiness";
		const optionALabel= "Join project";
		const optionA= (()=>{
			this.props.joinProject(this.submitHappiness);
		})
		const optionBLabel= "Forget it";
		const optionB = (()=>{});
		DialogProvider.staticDecider(title, optionALabel, optionA, optionBLabel, optionB);
	}

	insertHappiness(happinessValue){
		let _this = this;
		if (!this.props.userJoined){
			this.props.joinProject(this.submitHappiness);
		}

		this.setState(
			{
				happinessValue: happinessValue
			},
			this.submitHappiness
		)
	}

	submitHappiness(){
		let _this = this;
		gapi.client.happiness.insertHapiness({'happiness' : this.state.happinessValue,'projectID' : this.props.projectId}).execute(function(resp){
			if (!resp.code) {
				console.log(" Your happiness has been submitted ");
				_this.setState({
					currentHappiness: _this.state.happinessValue
				})
				_this.props.reloadChart();
			}
			else{
				console.error("Error: happiness not submitted correctly");
				console.log(resp.code);
				if (resp.message.includes('NoCurrentSprintError')){
					DialogProvider.staticNotification("Current sprint could not be determined, maybe the sprint deadlines are not configured properly. Ask your course administrator.");
				}
			}
		})
	}

	renderHappinessIcon(icon, value){
		return (
			<HappinessIcon selected={(value === this.state.currentHappiness) && this.props.userJoined}>
				<FontAwesomeIcon icon={['fas',icon]}
					onClick={() => this.insertHappiness(value)}
				/>
			</HappinessIcon>
		);
	}

	render(){
		return(
			<StyledHappinessSelector>
				{this.renderHappinessIcon('sad-cry', -3)}
				{this.renderHappinessIcon('sad-tear', -2)}
				{this.renderHappinessIcon('frown', -1)}
				{this.renderHappinessIcon('meh', 0)}
				{this.renderHappinessIcon('smile', 1)}
				{this.renderHappinessIcon('laugh-beam', 2)}
				{this.renderHappinessIcon('grin-hearts', 3)}
			</StyledHappinessSelector>
		);
	}
}