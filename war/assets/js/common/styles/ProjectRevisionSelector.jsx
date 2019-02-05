import React from 'react';
import styled from 'styled-components';
import DropDownButton from './DropDownButton.jsx';
import ProjectEndpoint from '../../common/endpoints/ProjectEndpoint';

const StyledInput = styled.div`
	padding-top: 3px;
	padding-bottom: 3px;
	display: flex;
	justify-content: center;
	& > label {
		margin-left: 5px;
		margin-right: 5px;
		width: 35%;
		text-align: right;
	}
	& > input {
		margin-left: 5px;
		margin-right: 5px;
		width: 55%;
	}
	& > div {
		margin-left: 5px;
		margin-right: 5px;
		width: 55%;
	}
	& > textarea {
		margin-left: 5px;
		margin-right: 5px;
		width: 55%;
	}
`

const ProjectDropDownContainer = styled.div`
	display: flex;
	z-index: 10000 !important;
	margin: 3px;
`;

const labelContainer = styled.div`
	display: inline-block;
	margin-right: 5px !important;
`;

export default class ProjectRevisionSelector extends React.Component {
	constructor(props) {
		super(props);

		this.revisionSelectorRef = null;
		this.state = {
			projects: this.props.projects,
			projectNameList: [],
			projectInitText: this.defineInitTextProjects(),
			revisions: [],
			revisionNameList: [],
			revisionInitText: []
		};
	}

	componentDidMount() {
		this.init();
	}

	init() {
		var _this = this;
		var projectNameList = [];
		var revisionNameList = [];
		var projects = this.props.projects;
		projects.items.forEach(function(project) {
			projectNameList.push({
				text: project.name,
				onClick: _this.projectClicked.bind(_this, project.id)
			});
		});

		ProjectEndpoint.listRevisionsExcludingValidation(
			this.props.projects.items[0].id
		).then(function(revisions) {
			revisions.items.forEach(function(revision) {
				revisionNameList.push({
					text: revision.revision,
					onClick: _this.revisionClicked.bind(_this, revision.id)
				});
			});
			_this.setState({
				revisions: revisions,
				projectNameList: projectNameList,
				revisionNameList: revisionNameList,
				revisionInitText: revisionNameList[0].text
			});
		});
	}

	projectClicked(projectID) {
		var _this = this;
		var revisionNameList = [];
		ProjectEndpoint.listRevisionsExcludingValidation(projectID).then(function(
			revisions
		) {
			revisions.items = revisions.items || [];
			revisions.items.forEach(function(revision) {
				revisionNameList.push({
					text: revision.revision,
					onClick: _this.revisionClicked.bind(_this, revision.id)
				});
			});

			_this.revisionSelectorRef.setText(revisionNameList[0].text);
			_this.setState({
				revisions: revisions,
				revisionNameList: revisionNameList
			});
		});
	}

	revisionClicked(revisionID) {
		this.props.setSelectedRevisionID(revisionID);
	}
	defineInitTextProjects() {
		var text = '';
		var _this = this;
		if (
			!(typeof this.props.projects == 'undefined') &&
			this.props.projects.items.length > 0
		) {
			text = this.props.projects.items[0].name;
			_this.setState({
				projectInitText: text
			});
		}
		return text;
	}

	render() {
		return (
			<div>
				<StyledInput>
					<label>Select a project: </label>
					<DropDownButton
						isListItemButton={true}
						items={this.state.projectNameList}
						initText={this.state.projectInitText}
					/>
				</StyledInput>
				<StyledInput>
					<label>Select a revision: </label>
					<DropDownButton id="projectRevisionDropDownBtn"
						ref={r => {
							this.revisionSelectorRef = r;
						}}
						isListItemButton={true}
						items={this.state.revisionNameList}
						initText={this.state.revisionInitText}
					/>
				</StyledInput>
			</div>
		);
	}
}
