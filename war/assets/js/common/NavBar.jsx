import React from 'react';

import styled from 'styled-components';
const StyledNav = styled.nav`
	background-color: ${props =>
		props.connected
			? props.theme.navDefault
			: props.theme.navOffline} !important;
`;


const StyledNavbarItem = styled.a`
	color: ${props => props.theme.defaultText} !important;
	cursor:pointer;
`;


export default class NavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};

		this.redirectToStart = this.redirectToStart.bind(
			this
		);
	}

	redirectToStart() {
		this.props.history.push('/');
	}


	render() {
		return (
			<StyledNav
				className={'navbar navbar-default navbar-fixed-top topnav '}
				role="navigation"
				connected={this.props.connected}
			>
				<div className="container topnav">
					<div className="navbar-header">
						<StyledNavbarItem
							className="navbar-brand topnav clickable"
							onClick={this.redirectToStart}
						>
							Happiness Index
						</StyledNavbarItem>
					</div>
				</div>
			</StyledNav>
		);
	}
}
