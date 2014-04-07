define(['backbone', 'marionette', "tpl!AuthenticationModule/templates/deniedTemplate.html"], function(Backbone, Marionette, deniedTemplate) {
	var DeniedView = Backbone.Marionette.ItemView.extend({
		template: deniedTemplate
	});

	return DeniedView;
});