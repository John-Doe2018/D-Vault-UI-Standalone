fileItApp.controller('HeaderController', [ '$rootScope', '$scope', '$location',
		'$sessionStorage',
		function($rootScope, $scope, $location, $sessionStorage) {
	
	$scope.backtoHome = function() {
		$location.path('/home');
	}

		} ]);