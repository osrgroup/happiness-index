import React from 'react'
import styled from 'styled-components';
import Modal from './../modals/Modal.jsx';
import { FormattedMessage } from 'react-intl';
import SigninFormula from '../../pages/index/sign-in/SigninFormula.jsx';
import { BtnDefault } from '../styles/Btn.jsx';


const DeciderButtons = styled.div`
	display:flex;
	flex-direction: row;
	justify-content: center;

	margin-top:10px;
	&> button{
		margin:8px 15px;
	}
`


export default class BinaryDecider extends React.Component {
	constructor(props) {
		super(props);
		this.optionA = this.optionA.bind(this);
		this.optionB = this.optionB.bind(this);

	}

	optionA(){
		this.props.optionA();
		this.props.close();
	}

	optionB(){
		this.props.optionB();
		this.props.close();
	}
	render(){
		return(
			<Modal title={this.props.title}
				close = {this.props.close}
				open={this.props.open}
				width={'400px'}
				buttons='NONE'
			>
				<DeciderButtons>
					<BtnDefault
						onClick={this.optionA}
					>
						{this.props.optionALabel}
					</BtnDefault>
					<BtnDefault
						onClick={this.optionB}
					>
						{this.props.optionBLabel}
					</BtnDefault>
				</DeciderButtons>
			</Modal>
		);
	}
}
