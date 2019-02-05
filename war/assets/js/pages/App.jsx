import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Link,
	Redirect
} from 'react-router-dom';

import { ThemeProvider } from 'styled-components';
import Theme from '../common/styles/Theme.js';

import NavBar from '../common/NavBar.jsx';
import Index from './index/Index.jsx';
import Courses from './Courses/Courses.jsx'
import Projects from './Projects/Projects.jsx'
import Project from './Project/Project.jsx'
import CourseConfig from './CourseConfig/CourseConfig.jsx'
import ProjectConfig from './ProjectConfig/ProjectConfig.jsx'
import CourseArchive from './CourseArchive/CourseArchive.jsx'
import styled from 'styled-components';
import {DialogProvider, DialogContextConsumer} from '../common/modals/DialogProvider.jsx';
import IntlProvider from '../common/Localization/LocalizationProvider';

const MainContent = styled.div`
	margin-top: 50px;
`;

export default class App extends React.Component {
	constructor(props) {
		super(props);


		this.state = {
		};
		let _this = this;

		this.loadUser = this.loadUser.bind(this);
		this.setUser = this.setUser.bind(this);
	}

	componentDidMount(){
		let _this = this;
		this.auth2 = gapi.auth2.getAuthInstance();
		this.auth2.isSignedIn.listen((resp1)=>{
				_this.loadUser();
		});
		_this.loadUser();
	}

	loadUser(){
		let _this = this;
		gapi.client.happiness.getCurrentUser().execute(function(resp) {
			   if (!resp.code) {
				   _this.setState({
   						user: resp
					});
			   }
			   else {
				   console.log("[App] Could not load user");
			   }
			});
	}

	setUser(user){
	   this.setState({
				user: user
		});
	}

	render() {
		return (
			<IntlProvider
				app={this}
				locale={this.state.locale}
				language={this.state.language}
				messages={this.state.messages}
				isGlobal={true}
			>
				<Router>
					<ThemeProvider theme={Theme}>
						<DialogProvider>
							<DialogContextConsumer>
							{( { openNotification, openConfirm, openDecider, openCustomForm, openPrompt }) => (
							<div>
								{DialogProvider.staticNotification = openNotification}
								{DialogProvider.staticConfirmation = openConfirm}
								{DialogProvider.staticDecider = openDecider}
								{DialogProvider.openCustomForm = openCustomForm}
								{DialogProvider.staticPrompt = openPrompt}
								<Route
									path="/"
									render={props => (
										<NavBar
											client_id={this.props.apiCfg.client_id}
											scopes={this.props.apiCfg.scopes}
											user={this.state.user}
											connected={true}
											theme={Theme}
											{...props}
										/>
									)}
								/>
								<MainContent>
								<Route
									exact
									path="/"
									render={props => (
										<Index user={this.state.user} setUser={this.setUser} theme={Theme} {...props} />
									)}
								/>
								<Route
									exact
									path="/Courses"
									render={props => (
										<Courses
											user={this.state.user}
											theme={Theme}
											{...props} />
									)}
								/>
								<Route
									exact
									path="/CourseConfig"
									render={props => (
										<CourseConfig
											user={this.state.user}
											theme={Theme}
											{...props} />
									)}
								/>
								<Route
									exact
									path="/CourseArchive"
									render={props => (
										<CourseArchive
											user={this.state.user}
											theme={Theme}
											{...props} />
									)}
								/>
								<Route
									exact
									path="/Projects"
									render={props => (
										<Projects user={this.state.user} theme={Theme} {...props} />
									)}
								/>
								<Route
									exact
									path="/Project"
									render={props => (
										<Project user={this.state.user} theme={Theme} {...props} />
									)}
								/>
								<Route
									exact
									path="/ProjectConfig"
									render={props => (
										<ProjectConfig  user={this.state.user} theme={Theme} {...props} />
									)}
								/>
								</MainContent>
							</div>
							)}
						</DialogContextConsumer>
						</DialogProvider>
					</ThemeProvider>
				</Router>
			</IntlProvider>

		);
	}

}
