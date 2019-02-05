import React from 'react';
import styled from 'styled-components';

const Panel = styled.div`
	background: #fff;
	border-radius: 3px;
	border-top: 3px solid #d2d6de;
	border-top-color: #d2d6de;
	box-shadow: 0 1px 1px rgba(0,0,0,.1);
	margin-bottom: 20px;
	position: relative;
	width: 100%;
`;

const PanelBody = styled.div`
	border-bottom-left-radius: 3px;
	border-bottom-right-radius: 3px;
	border-top-left-radius: 0;
	border-top-right-radius: 0;
	padding: 10px;
`;

const PanelHeader = styled.div`
	border-bottom: 1px solid #f4f4f4;
	color: #444;
    display: block;
    padding: 10px;
    position: relative;
`;

const PanelTitle = styled.div`
	display: inline-block;
    font-size: 18px;
    line-height: 1;
    margin: 0;
`;


const PanelButton = styled.button`
	color: #d2d6de;
	background: transparent;
	position: relative;
	padding: 0px;
`;

export { Panel, PanelBody, PanelHeader, PanelTitle, PanelButton };
