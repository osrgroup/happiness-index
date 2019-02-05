import React from 'react'
import styled from 'styled-components';
import { BtnDefault, LargeBtn } from '../../common/styles/Btn.jsx';
import  {Panel, Row} from 'common/styles/Panel.jsx';

const ProjectsBtn =  BtnDefault.extend`
	font-size: 20px;
	padding: 10px;
	margin-top: 20px;
`;



const Project = styled.div`
	border: 1px solid ${props => props.theme.borderDefault};
	border-left: 10px solid;
	border-right: 10px solid;
	padding: 20px 50px 20px 50px;
	margin 0px 50px;
	margin-bottom: 20px;
	background-color: ${props => props.theme.defaultPaneBg};
	& > h1 {
		font-size: 35px;
	}
`;

const ProjectButtons =  styled.div`
	& > button {
		margin: 10px
	}
`;
export default class ProjectList extends React.Component {
	constructor(props) {
		super(props);
	}

	redirectToProject(project){
		this.props.history.push('/Project?project='+project.id+'&course='+this.props.courseId);
	}

	joinProject(project){
		let _this = this;
		gapi.client.happiness.joinProject({ 'id': project.id }).execute(function(resp){ // FIXME Teaching Term should be configurable
    		if (!resp.code) {
				_this.redirectToProject(project);
			}
    	});
	}


	render(){
		return(
			<Row className="row">
			{
				this.props.projects.map((project, i) =>
					<div  className="col-lg-6">
						<Panel>
							<h1>{project.name}</h1>
							<div>{project.description}</div>
							<ProjectButtons>
								<LargeBtn
									href="#"
									onClick={()=>{this.redirectToProject(project)}}
								>
									<FontAwesomeIcon icon={['fas','users-class']} />
									<span>{"Select Project"}</span>
								</LargeBtn>
							</ProjectButtons>
						</Panel>
					</div>
				)
			}
			</Row>
		);
	}
}