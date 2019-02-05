import React from 'react'

export default class Participants extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			participants: []
		};
	}

	componentDidMount(){
		let _this = this;
		this.auth2 = gapi.auth2.getAuthInstance();
		this.auth2.isSignedIn.listen((resp1)=>{
				_this.loadParticipants();
		});
		_this.loadParticipants();
	}

	loadParticipants(){
		let _this = this;
		gapi.client.happiness.listUser({ 'projectID': this.props.projectId }).execute(function(resp){
    		if (!resp.code) {
				_this.setState({
					participants: resp.items
				})
			}
    	});
	}

	render(){
		return(
			<div>
			{
				this.state.participants.map((user, i) =>
					<div>
						{user.givenName + ' ' + user.surName}
					</div>
				)
			}
			</div>
		);
	}
}