fileItApp
		.controller(
				'HeaderController',
				[
						'$rootScope',
						'$scope',
						'$location',
						'$sessionStorage',
						'LandingOperationsSvc',
						'BINDER_NAME',
						function($rootScope, $scope, $location,
								$sessionStorage, LandingOperationsSvc,
								BINDER_NAME) {
							$scope.adavnceSearch = function() {
								LandingOperationsSvc.advSearch().then(
										function(result) {
											$scope.people = result.data;
										});
							};
							$scope.adavnceSearch();

							$scope.localSearch = function(str, people) {
								var matches = [];
								$scope.people
										.forEach(function(person) {
											if ((person.toLowerCase().indexOf(
													str.toString()
															.toLowerCase()) >= 0)) {
												var obj = {
													"bookname" : person
												}
												matches.push(obj);
											}
										});
								return matches;
							};
							$scope.backtoHome = function() {
								$location.path('/home');
							}

							$scope.selectedBook = function(selected) {
								if (selected) {
									var selectedbook = selected.title;
									var reqObj = {
										bookName : selectedbook
									}
									LandingOperationsSvc
											.searchBook(reqObj)
											.then(
													function(result) {
														if (result.data.errorId !== undefined) {
															$rootScope
																	.$broadcast(
																			'error',
																			result.data.description);
														} else {
															BINDER_NAME.name = result.data.jsonObject[selectedbook].Name;
															$location
																	.path('/landingPage');
														}
													});

								} else {
									console.log('cleared');
								}
							};
							
							$scope.logout = function(){
								$rootScope
								.$broadcast(
										'LogoutSucess');
								$location
									.path('/login');
							}
							
							$scope.onSearch = function(selectedBook) {
							}
						} ]);