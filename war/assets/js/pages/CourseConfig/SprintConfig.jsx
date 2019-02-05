import React from 'react'
import styled from 'styled-components';
import Deadline from './Deadline.jsx'
import { BtnDefault } from '../../common/styles/Btn.jsx';


export default class SprintConfig extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			deadlines: [],
			time: '23:59',
			hours: '23',
			minutes: '59'
		};
		this.createDeadline = this.createDeadline.bind(this);
		this.getSprints = this.getSprints.bind(this);
	}

	setDeadlines(deadlines){
		if (deadlines.length > 0){
			const hours = deadlines[0].getHours().toString();
			const minutes = deadlines[0].getMinutes().toString();
			const timestring = (hours[1] ? hours : '0' + hours[0]) + ':' +  (minutes[1] ? minutes : '0' + minutes[0])
			this.setState({
				time: timestring,
				hours: hours,
				minutes: minutes
			});
		}
		this.setState({
			deadlines: deadlines
		});
	}

	changeDeadline(index, value) {
		if (value instanceof Date && !isNaN(value)) {
			const newDeadlines = [...this.state.deadlines];
			newDeadlines[index] = value;
			this.setState({
				deadlines: newDeadlines
			});
			console.log("new date "+ value);
			this.props.updateSprints(this.createSprints(newDeadlines));
		}
	}

	getSprints(){
		return this.createSprints(this.state.deadlines);
	}

	createSprints(newDeadlines){
		let sprints = newDeadlines.map((deadline, index)=>{
			deadline.setHours(this.state.hours);
			deadline.setMinutes(this.state.minutes);
			var sprint = {};
			sprint.deadline = deadline.toISOString();
			sprint.sprintNumber = index;
			return sprint;
		});
		return sprints;
	}

	createDeadline(){
		this.setState({
			deadlines: [...this.state.deadlines, new Date()]
		}, ()=>{
			this.props.updateSprints(this.createSprints(this.state.deadlines));
		})

	}

	changeTime(value){
		this.setState({
			time: value,
			hours: value.split(':')[0],
			minutes: value.split(':')[1]
		}, ()=>{
			this.props.updateSprints(this.createSprints(this.state.deadlines));
		});
	}

	render(){
		return(
			<div>
			Time of day:
			<br/>
			<input
				type="time"
				value={this.state.time}
				onChange={event =>
				this.changeTime(event.target.value)
				}
			/>

			<br/>
			Enddate of sprints:
			{
				this.state.deadlines.map((deadline, i) =>
					<Deadline date={deadline} changeDeadline={this.changeDeadline.bind(this, i)}/>
				)
			}
			<BtnDefault
				href="#"
				onClick={this.createDeadline}
			>
				<FontAwesomeIcon icon={['fas','plus']} />
				<span>{"Add Sprint"}</span>
			</BtnDefault>
			</div>
		);
	}
}