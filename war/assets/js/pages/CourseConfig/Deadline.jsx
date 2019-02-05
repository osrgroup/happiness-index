import React from 'react'
import StyledInput from '../../common/styles/Input.jsx';

const CustomStyledInput = StyledInput.extend`
	margin: 2px;
	::-webkit-inner-spin-button {
		-webkit-appearance: none;
		display: none;
	}
`;




export default class Deadline extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	static toDateString(date) {
		const year = date.getFullYear().toString();
		const month = (date.getMonth() + 1).toString();
		const day = date.getDate().toString();

		return (
			year +
			'-' +
			(month[1] ? month : '0' + month[0]) +
			'-' +
			(day[1] ? day : '0' + day[0])
		);
	}

	render(){
		return(
			<div>
				<CustomStyledInput
					type={'date'}
					required={'required'}
					value={Deadline.toDateString(
						this.props.date
					)}
					onChange={event =>
						this.props.changeDeadline(new Date(event.target.value))
					}

				/>
			</div>
		);
	}
}