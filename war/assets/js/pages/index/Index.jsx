import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import SigninPanel from './sign-in/SinginPanel.jsx';
import { BtnLg } from '../../common/styles/Btn.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const StyledIntroBanner = styled.div`
	// prettier-ignore
	background: url(../assets/img/smiley_compressed.cache.jpg) no-repeat center;
	background-size: cover;
	height: 100vh;
`;

const StyledFooterBanner = styled.div`
	background-color: ${props => props.theme.darkPaneBg};
	background-size: cover;
	color: white;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 60px;
`;

const StyledFooterText = styled.span`
	justify-self: center;
	text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.6);
	padding-top: 10px;
	font-size: 2em;
`;

const StyledSocialMediaButtons = styled.div`
	justify-self: start;
	display: flex;
	flex-direction: row;
	margin-bottom: 0;
	& > button {
		margin-left: 3px;
		margin-right: 3px;
	}
`;

const TitleMessage = styled.div`
	text-align: center;
	color: white;
`;

export default class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<a name="about" />
				<StyledIntroBanner className="intro-header">
					<div className="container">
						<div className="row">
							<div className="col-lg-12">
								<TitleMessage className="intro-message">
									<h1>
										<FormattedMessage
											id="index.title"
											defaultMessage="Happiness Index"
										/>
									</h1>
									<h3>
										{"We love you "}
										<FontAwesomeIcon icon={['fas','heart']} size='1x' />
										{' Give us your happiness data'}
									</h3>

									<hr className="intro-divider" />
									<SigninPanel
										setUser={this.props.setUser}
										history={this.props.history}
										auth={this.props.auth}
									/>
								</TitleMessage>
							</div>
						</div>
					</div>
				</StyledIntroBanner>
			</div>
		);
	}
}
