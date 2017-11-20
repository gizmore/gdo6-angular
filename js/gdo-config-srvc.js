"use strict";
angular.module('gdo6').
service('GDOConfigSrvc', function(GDORequestSrvc) {
	
	var ConfigSrvc = this;
	ConfigSrvc.CACHE = null;
	
	ConfigSrvc.withConfig = function() {
		console.log('ConfigSrvc.withConfig()');
		return RequestSrvc.sendGWF('Core', 'Config').then(ConfigSrvc.gotConfig);
	};
	
	ConfigSrvc.gotConfig = function(config) {
		console.log('ConfigSrvc.gotConfig()', config);
		ConfigSrvc.CACHE = config.data;
	};
	
	/////////////////
	// Convinience //
	/////////////////
	ConfigSrvc.tosForced = function() {
		var result = ConfigSrvc.CACHE.Register.force_tos;
		console.log('ConfigSrvc.tosForced() === ', result);
		return result;
	};

	ConfigSrvc.emailActivation = function() {
		var result = ConfigSrvc.CACHE.Register.email_activation;
		console.log('ConfigSrvc.emailActivation() === ', result);
		return result;
	};
	
	return ConfigSrvc;
});
