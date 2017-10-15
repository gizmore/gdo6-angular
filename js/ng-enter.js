/**
 * http://stackoverflow.com/a/17364716
 */
angular.module('gdo6').directive('ngEnter', function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if(event.which === 13) {
				scope.$apply(function(){
					scope.$eval(attrs.ngEnter, {'event': event});
				});
				event.preventDefault();
			}
		});
	};
});
