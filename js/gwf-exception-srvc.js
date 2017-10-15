'use strict';
angular.module('gdo6')
.service('GDOExceptionSrvc', function(GDORequestSrvc) {
	
	var ExceptionSrvc = this;
	
	ExceptionSrvc.sendReport = function(exception) {
		console.log('ExceptionSrvc.sendReport()');
		var url = GDT_WEB_ROOT+'index.php?mo=GWF&me=AngularException&ajax=1';
		var data = ExceptionSrvc.reportData(exception);
		return RequestSrvc.send(url, data);
	};
	
	ExceptionSrvc.reportData = function(exception) {
		return {
			user_id: GDT_USER.id(),
			user_name: GDT_USER.displayName(),
			user_agent: navigator.userAgent || 0,
			resolution: sprintf('%dx%d', $(window).width(), $(window).height()),
			stacktrace: exception.stack,
		};
	};

	return ExceptionSrvc;

});
