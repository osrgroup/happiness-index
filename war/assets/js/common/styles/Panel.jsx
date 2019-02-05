import styled from 'styled-components';

const Panel = styled.div`
	border: 1px solid ${props => props.theme.borderDefault};
	border-left: 10px solid;
	border-right: 10px solid;
	padding: 15px 30px 15px 30px;
	margin 0px 25px;
	margin-bottom: 20px;
	@media (max-width: 700px) {
    	padding: 5px 10px !important;
	}
	@media (max-width: 500px) {
    	padding: 5px 5px !important;
		margin-left 6px !important;
		margin-right 6px !important;
		border-left: 6px solid !important;
		border-right: 6px solid !important;
	}
`;

const Row =  styled.div`
	margin: 0px;
	&> [class*="col-"] {
	    padding-right: 0;
	    padding-left: 0;
	  }
`;

const WarningPanel =  Panel.extend`
	background-color: #FFFFE0;
	border-color: #EFCC00;
`;

const AdminPanel =  Panel.extend`
	border-color: #ff8484;
`;


export {Panel, Row, WarningPanel, AdminPanel};