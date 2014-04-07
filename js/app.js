define(["jquery", "underscore", "backbone", "marionette"], function($, _, Backbone, Marionette) {
	var App = new Marionette.Application();

	App.addRegions({
		headerRegion: "#header-region",
		mainRegion: "#main-region"
	});

	App.on("initialize:after", function() {
		if (Backbone.history) {
			require(["AuthenticationModule/app"], function(AuthApp) {
				Backbone.history.start();

				AuthApp.start({
					loginUrl: 'http://127.0.0.1/login',
					logoutUrl: 'http://127.0.0.1/logout',
					appRegion: 'mainRegion'
				});
				
				//test auth module
				/*$.ajax({
					type: 'get',
					url: 'http://127.0.0.1/SOME_ENDPOINT_THAT_RETURNS_401'
				});*/
			});
		}
	});

	return App;
});