import React from 'react'
import Confirm from './Confirm';
import Notification from './Notification.jsx';
import Prompt from './Prompt.jsx';
import BinaryDecider from './BinaryDecider.jsx';
import CustomForm from './CustomForm.jsx';

const DialogContext = React.createContext();
export const DialogContextConsumer = DialogContext.Consumer;
export class DialogProvider extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			confirmIsOpen: false,
			confirmMessage: '',
			confirmAction: (()=>{}),
			notificationIsOpen: false,
			notificationMessage: '',
			promptIsOpen: false,
			deciderIsOpen: false,
			deciderTitle: '',
			deciderLabelA: '',
			deciderLabelB: '',
			customFormIsOpen: false,
			customFormTitle: ''
		};

		this.openConfirm = this.openConfirm.bind(this);
		this.closeConfirm = this.closeConfirm.bind(this);
		this.doConfirm = this.doConfirm.bind(this);
		this.openPrompt = this.openPrompt.bind(this);
		this.openNotification = this.openNotification.bind(this);
		this.closeNotification = this.closeNotification.bind(this);
		this.closePrompt = this.closePrompt.bind(this);
		this.openDecider = this.openDecider.bind(this);
		this.closeDecider = this.closeDecider.bind(this);
		this.openCustomForm = this.openCustomForm.bind(this);
		this.closeCustomForm = this.closeCustomForm.bind(this);
	}

	openConfirm (message, action) {
		this.setState({
			confirmMessage: message,
			confirmAction: action,
			confirmIsOpen: true,
		});
	};

	openNotification (message) {
		this.setState({
			notificationIsOpen: true,
			notificationMessage: message
		});
	};

	closeNotification () {
		this.setState({
			notificationIsOpen: false,
			notificationMessage: ''
		});
	};

	closeConfirm () {
		this.setState({
			confirmMessage: '',
			confirmAction: (()=>{}),
			confirmIsOpen: false,
		});
	};

	doConfirm(){
		this.state.confirmAction();
		this.closeConfirm();
	}

	openPrompt (title, label, onSubmit) {
		this.setState({
			promptIsOpen: true,
			promptTitle: title,
			promptLabel: label,
			promptOnSubmit: onSubmit
		});
	};

	closePrompt () {
		this.setState({
			promptIsOpen: false,
		});
	};

	closeDecider () {
		this.setState({
			deciderIsOpen: false,
		});
	};

	openDecider(title, labelA, optionA, labelB, optionB){
		this.setState({
			deciderIsOpen: true,
			deciderTitle: title,
			deciderLabelA: labelA,
			deciderOptionA: optionA,
			deciderLabelB: labelB,
			deciderOptionB: optionB
		});
	}

	openCustomForm(title, elements, callback){
		this.setState({
			customFormIsOpen: true,
			customFormTitle: title,
			customFormElements: elements,
			customFormCallback: callback
		});
	}

	closeCustomForm () {
		this.setState({
			customFormIsOpen: false
		});
	};

	render(){
		return(
			<DialogContext.Provider
				value={{
					openConfirm: this.openConfirm,
					closeConfirm: this.closeConfirm,
					doConfirm: this.doConfirm,
					confirmAction: this.confirmAction,
					confirmIsOpen: this.state.confirmIsOpen,
					confirmMessage: this.state.confirmMessage,
					openNotification: this.openNotification,
					closeNotification: this.closeNotification,
					notificationIsOpen: this.state.notificationIsOpen,
					notificationMessage: this.state.notificationMessage,
					promptIsOpen: this.state.promptIsOpen,
					closePrompt: this.closePrompt,
					openPrompt: this.openPrompt,
					promptTitle: this.state.promptTitle,
					promptLabel: this.state.promptLabel,
					promptOnSubmit: this.state.promptOnSubmit,
					deciderIsOpen: this.state.deciderIsOpen,
					closeDecider: this.closeDecider,
					deciderTitle: this.state.deciderTitle,
					deciderLabelA: this.state.deciderLabelA,
					deciderOptionA: this.state.deciderOptionA,
					deciderLabelB: this.state.deciderLabelB,
					deciderOptionB: this.state.deciderOptionB,
					openDecider: this.openDecider,
					openCustomForm: this.openCustomForm,
					customFormIsOpen: this.state.customFormIsOpen,
					closeCustomForm: this.closeCustomForm,
					customFormTitle: this.state.customFormTitle,
					customFormElements: this.state.customFormElements,
					customFormCallback: this.state.customFormCallback
				}}
			>
				<DialogContextConsumer>
					{({ confirmIsOpen, confirmMessage, confirmAction, doConfirm, closeConfirm,
						notificationIsOpen, closeNotification, notificationMessage,
						promptIsOpen, closePrompt, openPrompt, promptTitle, promptLabel, promptOnSubmit,
					 	openDecider, deciderIsOpen, closeDecider, deciderTitle, deciderLabelA, deciderOptionA, deciderLabelB, deciderOptionB,
						openCustomForm, customFormIsOpen, closeCustomForm, customFormTitle, customFormElements, customFormCallback}) => (
						<div>
							<Confirm
								open={confirmIsOpen}
								close={closeConfirm}
								message={confirmMessage}
								confirmAction={doConfirm}
							/>
							<Notification
								open={notificationIsOpen}
								close={closeNotification}
								message={notificationMessage}/>
							<Prompt
								open={promptIsOpen}
								close={closePrompt}
								title={promptTitle}
								label={promptLabel}
								onSubmit={promptOnSubmit}
							/>
							<BinaryDecider
								open={deciderIsOpen}
								close={closeDecider}
								title={deciderTitle}
								optionALabel={deciderLabelA}
								optionA={deciderOptionA}
								optionBLabel={deciderLabelB}
								optionB={deciderOptionB}
							/>
							<CustomForm
								open={customFormIsOpen}
								close={closeCustomForm}
								title={customFormTitle}
								elements={customFormElements}
								onSubmit={customFormCallback}
							/>
						</div>
					)}
				</DialogContextConsumer>
				{this.props.children}
			</DialogContext.Provider>
		);
	}
}

