import React from 'react';
import styled from 'styled-components';
import IntlProvider from '../../Localization/LocalizationProvider';


const StyledValueBox = styled.div`
	padding-left: 0 !important;
	padding-right: 0!important;
	background: #fff;
	border-radius: 2px;
	box-shadow: 0 1px 1px rgba(0,0,0,.1);
	display: block;
	margin-bottom: 15px;
	min-height: 90px;
	width: 100%;
`;

const StyledValueBoxIcon = styled.div`
	width: 60px !important;
	color: white;
	background-color: ${props =>
		props.color ? props.color : 'grey'};
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 0;
    border-top-left-radius: 2px;
    border-top-right-radius: 0;
    display: block;
    float: left;
    font-size: 45px;
    height: 90px;
    line-height: 90px;
    text-align: center;
`;

const StyledValueBoxContent = styled.div`
	padding-right: 0!important;
	margin-left: 90px;
	padding: 5px 10px;
`;

const StyledValueBoxLabel = styled.span`
	font-family: sans-serif;
	font-size: 15px;
	margin-left: -35px!important;
	text-transform: none!important;
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const StyledValueBoxValue = styled.span`
	font-size: 25px;
	margin-left: -35px!important;
	display: block;
	font-weight: 700;
`;
export default class ValueBox extends React.Component {
	formatNotAvailable(value = undefined) {
		const { formatMessage } = IntlProvider.intl;
		return (
			value ||
			formatMessage({
				id: 'projectstats.not_available',
				defaultMessage: 'N/A'
			})
		);
	}

	render() {
		return (
			<StyledValueBox>
				<StyledValueBoxIcon color ={this.props.color}>
					<FontAwesomeIcon icon={this.props.icon}/>
				</StyledValueBoxIcon>
				<StyledValueBoxContent>
					<StyledValueBoxLabel>
						{this.props.label}
					</StyledValueBoxLabel>
					<StyledValueBoxValue>
						{this.formatNotAvailable(this.props.value)}
					</StyledValueBoxValue>
					{	this.props.link?
						<span
							onClick={() => this.props.link()}
							className="clickable"
						>
							{this.props.linkLabel}
						</span>
						:
						null
					}

				</StyledValueBoxContent>
			</StyledValueBox>
		);
	}
}
