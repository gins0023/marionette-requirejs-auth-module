define(["jquery", "backbone", "marionette", "app"], function($, Backbone, Marionette, App) {
	return App.module("Authentication", function(Auth, App) {
		/**
		 * Start With Default Auth Variables
		 */
		_.extend(Auth, {
			startWithParent: false,
			ajaxMethod: 'POST',
			appRegion: 'mainRegion',
			defaultRoute: ''
		});

		/**
		 * Allowed Routes in App
		 */
		Auth.Router = Backbone.Marionette.AppRouter.extend({
			appRoutes: {
				'login(/)': 'login',
				'logout(/)': 'logout',
				'denied(/)': 'denied'
			}
		});

		/**
		 * Save the location before login to return to it after
		 * successful authentication
		 */
		Auth.setBeforeLogin = function() {
			this.beforeLogin = Backbone.history.fragment === 'login' ? this.defaultRoute : '#' + Backbone.history.fragment;
		};

		Auth.getBeforeLogin = function() {
			return this.beforeLogin;
		};


		/**
		 * Controller to Resolve Routes
		 */
		Auth.Controller = Backbone.Marionette.Controller.extend({
			initialize: function(options) {
				this.listenTo(App.vent, 'Auth:LoginView:authenticate', this.authenticate, this);
			},

			/**
			 * When 401 occurs, show login view in designated region
			 */
			login: function() {
				require(["AuthenticationModule/views/LoginView"], function(LoginView) {
					App[Auth.appRegion].show(new LoginView());
				});
			},

			logout: function() {
				$.ajax({
					url: Auth.logoutUrl,
					method: 'GET',
					success: function() {
						window.location = Auth.defaultRoute;
						window.location.reload();
					}
				});
			},

			/**
			 * When 403 occurs show denied view in designated region
			 */
			denied: function() {
				require(["AuthenticationModule/views/DeniedView"], function(DeniedView) {
					App[Auth.appRegion].show(new DeniedView());
				});
			},

			/**
			 * Upon submission of login view form attempt
			 * to login with provided url
			 */
			authenticate: function(data) {
				$.ajax({
					url: Auth.loginUrl,
					method: Auth.ajaxMethod,
					data: data,
					success: function() {
						window.location.replace(Auth.getBeforeLogin());
					},
					error: function(response) {
						var message = response.responseJSON.errorMessage;
						App.vent.trigger('Auth:LoginView:error', message);
					}
				});
			}
		});

		Auth.addInitializer(function(options) {
			_.extend(this, options);

			/**
			 *	Globally capture unauthorized and forbidden http codes
			 */
			$.ajaxSetup({
				statusCode: {
					401: function() { Auth.setBeforeLogin(); window.location.replace('#login'); },
					403: function() { window.location.replace('#denied'); }
				}
			});

			var currentRoute = Backbone.history.fragment,
				controller = new Auth.Controller(),
				router = new Auth.Router({
					controller:  controller
				});

			Auth.router = router;
			Auth.controller = controller;
			Auth.setBeforeLogin();

			/**
			 * When hitting login or denied endpoints directly
			 */
			if (currentRoute === 'login' || currentRoute === 'denied' || currentRoute === 'logout') {
				Auth.controller[currentRoute]();
			}

		});
	});

});