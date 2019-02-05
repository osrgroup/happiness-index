import React from 'react';
import styled from 'styled-components';
import {FormattedMessage} from 'react-intl';
import IntlProvider from './Localization/LocalizationProvider';


const FixedDiv = styled.div`

	z-index: 10;
	position: fixed;
	text-align:left;
	top: 58px;
	right: 24px;
	width: 300px;
	max-height:800px;
	border: 1px solid ${props => props.theme.borderDefault};
	border-radius: 2px;
	box-shadow: 0 2px 8px 0 rgba(0,0,0,.2);
	display: ${props => (props.shouldDisplay ? 'block' : 'none')} !important;
`;

const Header = styled.div`
	padding:7px;
	background-color: ${props => props.theme.defaultPaneBg};
	border-bottom: 1px solid ${props => props.theme.borderDefault};
`;
const Header_Icons = styled.div`
	float:right;
	
`;
const Body = styled.div`
	background-color: ${props => props.theme.bgDefault};
	overflow-y:auto;
`;

const IconButton = styled.span`
margin-left:14px;
	&:hover {
    cursor: pointer;
  }
`;
const StyledOperation = styled.div`
	padding:7px;
	border-bottom: 1px solid ${props => props.theme.borderDefault};
	overflow-x:auto;
`;
const OperationId = styled.div`
	font-size: 0.9em;
`;
const OperationParams = styled.div`
	color: ${props => props.theme.fgSecondary};
	font-size: 0.9em;
`;


export default class OperationsList extends React.Component {
	constructor(props) {
		super(props);
		console.debug("[SW] props in olist", props);
		this.state = {
			visible: false,
		};
	}

	render() {
		const { formatMessage } = IntlProvider.intl;
		return (
			<FixedDiv id="operations"
					  shouldDisplay={this.props.operations.length > 0}
			>
				<Header>
					<FormattedMessage
						id="operations.title"
						defaultMessage="Operations"
					/>

					<Header_Icons>
						<IconButton title={formatMessage({
							id: 'operations.help',
							defaultMessage: 'These Operations were executed offline and will be synced on reconnect'
						})}>
							<FontAwesomeIcon icon={['fas', 'question']}/>
						</IconButton>
						<IconButton id="btn_collapseOps" onClick={function () {
							this.collapse();
						}.bind(this)}>
							<FontAwesomeIcon icon={['fas', 'chevron-up']}/>
						</IconButton>
						<IconButton id="btn_expandOps" className={"hide"} onClick={function () {
							this.expand();
						}.bind(this)}>
							<FontAwesomeIcon icon={['fas', 'chevron-down']}/>
						</IconButton>
						{/*
						<IconButton id="btn_closeOps" onClick={function () {this.close();}.bind(this)}>
							<FontAwesomeIcon icon={['fas', 'times']}/>
						</IconButton>
						*/}
					</Header_Icons>
				</Header>
				<Body id={"operationsBody"}>
				{this.props.operations.map((operation, i) =>
					<StyledOperation>
						<OperationId>{operation.id.split(".").slice(-1)[0]}</OperationId>
					</StyledOperation>)}

				</Body>

			</FixedDiv>

		);
	}

	collapse() {
		document.getElementById('btn_expandOps').classList.toggle('hide');
		document.getElementById('btn_collapseOps').classList.toggle('hide');
		document.getElementById('operationsBody').classList.toggle('hide');
	}

	expand() {
		document.getElementById('btn_expandOps').classList.toggle('hide');
		document.getElementById('btn_collapseOps').classList.toggle('hide');
		document.getElementById('operationsBody').classList.toggle('hide');
	}
}
