'use strict';
angular.module('gdo6').
service('GDORequestSrvc', function($http, GDOLoadingSrvc) {
	
	var RequestSrvc = this;
	
	RequestSrvc.sendGDO = function(module, method, data, noBusy) {
		var url = window.GDO_WEB_ROOT + 'index.php?mo=' + module + '&me=' + method + '&_ajax=1&_fmt=json';
		return RequestSrvc.send(url, data, noBusy);
	};

	RequestSrvc.send = function(url, data, noBusy) {
		console.log('RequestSrvc.send()', url, data, noBusy);
		if (!noBusy) {
			GDOLoadingSrvc.addTask('http');
		}
		return $http({
			method: 'POST',
			url: url,
			data: data,
			withCredentials: true,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'	
			},
			transformRequest: RequestSrvc.transformPostData
		})['finally'](function() {
			GDOLoadingSrvc.removeTask('http');
		});
	};
	
	RequestSrvc.transformPostData = function(obj) {
		var str = [];
		for(var p in obj) {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
		return str.join("&");
	};
	
});
