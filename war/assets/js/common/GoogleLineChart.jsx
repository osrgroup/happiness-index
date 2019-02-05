import React from 'react';

import styled from 'styled-components';

const StyledChart = styled.div`

`;

export default class GoogleLineChart extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.drawChart();
	}
	componentDidUpdate() {
		this.drawChart();
	}

	drawChart() {
		var data = this.props.data;
		var options = this.props.options;
		var domElement = document.getElementById(this.props.graphID);
		// FIXME the prop graphID is no longer needed if we set the moundpoint
		// like this
		if (this.mount){
			var chart = new google.visualization.LineChart(this.mount);
			chart.draw(data, options);
		}

	}

	render() {
		return <div>
			<StyledChart id={this.props.graphID}>
				<div ref={r => {
					if (r) this.mount = r;
				}}/>
			</StyledChart>
		</div>;
	}
}
