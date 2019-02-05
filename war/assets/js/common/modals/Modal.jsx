import React from 'react'
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import ModalPortal from './ModalPortal.jsx';
import { BtnDefault, BtnPrimary } from '../styles/Btn.jsx';

const ModalBackground = styled.div`
	height: 100%;
	width: 100%;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1110;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(0, 0, 0, 0.5);
`

const ModalContent = styled.div`
	position: fixed;
	top: 100px;
	width: ${props => props.width ? props.width : '500px'};
	background-color: ${props => props.theme.defaultPaneBg};
	@media (max-width: 500px) {
    	width: 100% !important;
	}

`

const ModalTitle = styled.div`
	background-color: ${props => props.theme.fgPrimary};
	height:40px;
	color: white;
	font-size: 20px;
	padding-left: 10px;
	padding-top: 6px;
`

const CloseButton = styled.div`
	float: right;
	padding-right: 10px;
	cursor: pointer;
`

const YesButton = styled.div`
	display:flex;
	flex-direction: column;
	padding:8px;
	margin-top:10px;
`

const ModalButtons = styled.div`
	display:flex;
	flex-direction: row;
	justify-content: space-between;
	padding:8px;
	margin-top:10px;
`
const ModalBody = styled.div`
	display:flex;
	flex-direction: column;
	padding:8px;
	margin-top:10px;
`

const ModalButton = styled.div`
	margin-top:10px;
	display: flex;
	justify-content: center;
	padding-bottom: 8px;
`

export default class Modal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};

		this.renderButtons = this.renderButtons.bind(this);

	}

	renderOkCancelButtons(){
		return <ModalButtons>
			<BtnDefault
				id='modalCancelBtn'
				href="#"
				onClick={this.props.close}
			>
				<FormattedMessage
					id="modal.cancel"
					defaultMessage="Cancel"
				/>
			</BtnDefault>
			<BtnPrimary
				id='modalOkBtn'
				href="#"
				onClick={this.props.submit}
			>
				<FormattedMessage
					id="modal.ok"
					defaultMessage="OK"
				/>
			</BtnPrimary>
		</ModalButtons>
	}

	renderOkButton(){
		return <ModalButton>
			<BtnPrimary
				id='modalOkBtn'
				href="#"
				onClick={this.props.close}
			>
				<FormattedMessage
					id="modal.ok"
					defaultMessage="OK"
				/>
			</BtnPrimary>
		</ModalButton>
	}

	renderCancelButton(){
		return <ModalButton>
			<BtnPrimary
				id='modalCancelBtn'
				href="#"
				onClick={this.props.close}
			>
				<FormattedMessage
					id="modal.cancel"
					defaultMessage="Cancel"
				/>
			</BtnPrimary>
		</ModalButton>
	}

	renderButtons(){
		switch (this.props.buttons) {
			case 'NONE':
				return null;
			case 'OK':
				return this.renderOkButton();
			case 'CANCEL':
				return this.renderCancelButton();
			case 'PROVIDED':
				return this.props.renderButtons();
			default:
				return this.renderOkCancelButtons();
		}
	}

	renderCloseButton(){
		if(this.props.noclose) {
			return (<span></span>);
		}
		else {
			return  <CloseButton onClick={this.props.close}>X</CloseButton>
		}
	}

	renderModal(){
		let _this = this;
		return (
			<ModalPortal>
				<ModalBackground>
					<ModalContent width={this.props.width}>
						<ModalTitle><span>{this.props.title}</span>{this.renderCloseButton()} </ModalTitle>
						<ModalBody>{this.props.children}</ModalBody>
						{this.renderButtons()}
					</ModalContent>
				</ModalBackground>
			</ModalPortal>
		);
	}

	render(){
		return this.props.open ? this.renderModal() : null;
	}
}