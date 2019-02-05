import React from 'react';
import ReactDOM from 'react-dom';

import '../../../../components/bootstrap/dist/bootstrap.min.css';


import App from '../App.jsx';

import loadGAPIs from '../../common/GAPI';

import $script from 'scriptjs';

import buildFontLibrary from '../../common/FontLibrary';

buildFontLibrary();

var chartScriptPromise = new Promise(function(resolve, reject) {
	$script('https://www.gstatic.com/charts/loader.js', () => {
		google.charts.load('current', {
			packages: ['corechart', 'bar']
		});
		google.charts.load('current', {
			packages: ['corechart', 'table']
		});
		google.charts.setOnLoadCallback(resolve);

	});
});

var account = {
	isSignedIn: () => {
		return false;
	}
};

window.onload = function() {
	googleClientPromise.then(() => {
		googlePlatformPromise.then(() => {
			init();
		});
	});
	initServiceWorker();
};

const loadapp = function(apiCfg){
	console.log("[index] Starting to render App");
	var account = {
		isSignedIn: () => {
			return false;
		}
	};
	gapi.client.happiness.getCurrentUser().execute(function(resp) {});
	ReactDOM.render(
		<App
			apiCfg={apiCfg}
			chartScriptPromise={chartScriptPromise}
			mxGraphPromise={undefined}
		/>,
		document.getElementById('indexContent')
	);
}

const init = function() {
	loadGAPIs().then(loadapp).catch((err)=>{
		console.error("Could not load and initialize APIs");
	});
};

function initServiceWorker() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register('sw.dist.js', { scope: '/' })
			.then(function() {
				console.log('Service worker registered');
				if(navigator.serviceWorker.controller === null) {
					console.log('Reload after force refresh');
					window.location.reload();
				}
			})
			.catch(function(err) {
				console.log(err);
			});
	} else {
		console.log('Browser does not support service worker');
	}
}