import React from 'react'
import { BtnDefault } from '../../common/styles/Btn.jsx';
import styled from 'styled-components';
import { DialogProvider } from 'modals/DialogProvider.jsx';
import  Page from 'common/styles/Page.jsx';
import {Panel}from 'common/styles/Panel.jsx';
import  Link from 'common/styles/Link.jsx';
import  Location from 'common/styles/Location.jsx';

const AdminBtn =  BtnDefault.extend`
	margin: 0px 10px;
`;

export default class Courses extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			courses: []
		};
		this.loadCourses = this.loadCourses.bind(this);
		this.redirectToCourses = this.redirectToCourses.bind(this);
		this.redirectToCourseConfig = this.redirectToCourseConfig.bind(this);


	}

	componentDidMount(){
		let _this = this;
		this.auth2 = gapi.auth2.getAuthInstance();
		this.auth2.isSignedIn.listen((resp1)=>{
				_this.loadCourses();
		});
		_this.loadCourses();

	}

	loadCourses(){
		let _this = this;
		gapi.client.happiness.listTeachingTerm({'onlyArchived' : true}).execute(function(resp){ // FIXME Teaching Term should be configurable
    		if (!resp.code && resp.items) {
				_this.setState({
					courses: resp.items
				})
			}
    	});
	}

	redirectToCourses(){
		this.props.history.push('/Courses')
	}

	redirectToCourseConfig(course){
		this.props.history.push('/CourseConfig?course='+course.id);
	}

	render(){
		return(
			<Page>
			<Location >
				>>
				<Link onClick={this.redirectToCourses}>Courses</Link>
				<span> / </span>
				<span>Course Archive</span>
			</Location>
				<Panel>
					<h2>
						Course Archive
					</h2>
					{
						this.state.courses.map((course, i) =>
							<div>
								<Link onClick={()=>{this.redirectToCourseConfig(course)}}>{course.label}</Link>
							</div>
						)
					}
				</Panel>
			</Page>
		);
	}
}