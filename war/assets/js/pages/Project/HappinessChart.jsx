import React from 'react'
import GoogleLineChart from '../../common/GoogleLineChart.jsx'

export default class HappinessChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			users: new Set(),
			userNames: new Set(),
			sprints: new Set(),
			happinessData: {}
		};
		this.windowSmall = window.matchMedia( "(max-width: 900px)" );
		this.loadHappinessData = this.loadHappinessData.bind(this);
		this.update = this.update.bind(this);
	}

	componentDidMount(){
		window.addEventListener("resize", this.update);

		this.loadHappinessData();
	}
	componentWillUnmount() {
		window.removeEventListener("resize", this.update);
	}

	update(){
		this.forceUpdate();
	}

	loadHappinessData(){
		let _this = this;
		gapi.client.happiness.listHapiness({'teachingTerm' : this.props.courseId ,'projectId' : this.props.projectId}).execute(function(resp){
			if (!resp.code) {
				const users = new Set();
				const sprints = new Set();
				const userNames = {};
				const happinessData = {};
				resp.items.forEach((happiness) => {
					users.add(happiness.userId);
					userNames[happiness.userId] = happiness.userName;
					sprints.add(happiness.sprint);
					happinessData[happiness.userId + '_' + happiness.sprint] = happiness;
				});
				_this.setState({
					users: users,
					sprints: sprints,
					happinessData: happinessData,
					userNames: userNames
				});
			}
		});
	}

	render(){
		const data = new google.visualization.DataTable();
		const rows = [];
		for (let sprint of this.state.sprints){
			let row = [];
			row.push('Sprint ' + sprint.toString());
			for (let user of this.state.users){
				const happinessData = this.state.happinessData[user + '_' + sprint];
				row.push(happinessData ? happinessData.happiness : undefined);
			}
			rows.push(row);
		}

		if (rows.length === 0) return (
			<div>Not enough data to draw a chart.</div>
		);

		data.addColumn(
			'string',
			'Sprint'
		);
		for (let user of this.state.users){
			data.addColumn(
				'number',
				this.state.userNames[user]
			);
		}

		data.addRows(rows);

		const leftOfChart = this.windowSmall.matches ? 16 : 20;
		let rightOfChart = this.windowSmall.matches ? 0 : 230;
		let legendPos =  { position: this.windowSmall.matches ? 'bottom' : 'right' }
		if (this.props.user && this.props.user.type != "ADMIN") {
			legendPos = 'none';
			rightOfChart = this.windowSmall.matches ? 16 : 20
		}
		const options = {
			height: 400,
			lineWidth: 5,
			backgroundColor: 'transparent',
			legend: legendPos,
			chartArea: {
				top: 10,
				bottom: 80,
				right: rightOfChart,
				left: leftOfChart
			},
			hAxis: {
				slantedText: true,
				viewWindow:{
					min: 0.4,
					max: this.state.sprints.size - 0.4
				}
			},
			vAxis: {
				ticks: [-3,-2,-1,0,1,2,3],
				viewWindow: {
					min: -3.5,
					max:3.5
				}
			},
			curveType: 'function'
		};
		return(
			<div>
			<GoogleLineChart
				graphID="happinessChart"
				data={data}
				options={options}
			/>
			</div>
		);
	}
}