require.config({
    baseUrl: 'lib/',
	paths: {
		jquery: 'jquery-min',
		underscore: 'underscore-min',
		backbone: 'backbone-min',
		marionette: 'backbone.marionette-min',
		tpl: 'tpl',
		app: '../js/app',
		AuthenticationModule: '../js/modules/AuthenticationModule'
	},
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ['jquery', 'underscore'],
			exports: 'Backbone'
		},
		marionette: {
			deps: ['jquery', 'backbone'],
			exports: 'Marionette'
		}
	}
});


define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'app'
	], function($, _, Backbone, Marionette, App) {
		App.start();
});

