import React from 'react';
import styled from 'styled-components';


const TimelineLabel = styled.span`
	color: white;
	background-color: #dd4b39;
	border-radius: 4px;
	display: inline-block;
	font-weight: 600;
	padding: 5px;
`

const Timeline = styled.ul`
	list-style: none;
	margin: 0 0 30px;
	padding: 0;
	position: relative;
	& > li {
		margin-bottom: 15px;
		margin-right: 10px;
		position: relative;
	}
	&:before{
		background: #ddd;
		border-radius: 2px;
		bottom: 0;
		content: "";
		left: 31px;
		margin: 0;
		position: absolute;
		top: 0;
		width: 4px;
	}
`;

const TimelineItem = styled.div`
	background: #f0f0f0;
	border-radius: 3px;
	box-shadow: 0 1px 1px rgba(0,0,0,.1);
	color: #444;
	margin-left: 60px;
	margin-right: 15px;
	margin-top: 0;
	padding: 0;
	position: relative;
	& > div {
		padding: 10px;
	}
`

const TimelineItemHeader = styled.h3`
	background: #e1e1e1;
	border-radius: 3px;
	border-bottom: 1px solid #f4f4f4;
	color: #555;
	font-size: 16px;
	line-height: 1.1;
	margin: 0;
	padding: 10px;
`


const StyledHistoryIcon = styled.div`
	background: ${props => props.color};
	border-radius: 50%;
	font-size: 15px;
	height: 30px;
	left: 18px;
	line-height: 30px ;
	position: absolute;
	text-align: center;
	top: 0;
	width: 30px;
`;

export { Timeline, TimelineItem, TimelineItemHeader, TimelineLabel, StyledHistoryIcon };
