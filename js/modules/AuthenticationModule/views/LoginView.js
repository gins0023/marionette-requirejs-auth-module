define(["backbone", "marionette", "AuthenticationModule/app", "tpl!AuthenticationModule/templates/loginTemplate.html"], function(Backbone, Marionette, AuthApp, loginTemplate) {
	var LoginView = Backbone.Marionette.ItemView.extend({
		template: loginTemplate,
		events: {
			"submit form": "login",
			"keydown input": "removeError"
		},
		ui: {
			errorMessage: '.error-message'
		},
		initialize: function(options) {
			_.extend(this, options);
			this.listenTo(AuthApp.app.vent, 'Auth:LoginView:error', this.showError, this);
		},
		login: function(e) {
			e.preventDefault();

			var data = $('form').serialize();
			AuthApp.app.vent.trigger('Auth:LoginView:authenticate', data);
		},
		showError: function(message) {
			this.ui.errorMessage.html(message);
		},
		removeError: function(e) {
			this.ui.errorMessage.empty();
		}
	});

	return LoginView;
});
