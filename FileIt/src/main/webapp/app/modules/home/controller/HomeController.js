fileItApp.controller('HomeController', [
		'$rootScope',
		'$scope',
		'$location',
		'HeaderSvc',
		'$sessionStorage',
		'Idle',
		'AesEncoder',
		'BINDER_NAME',
		function($rootScope, $scope, $location, headerSvc, $sessionStorage,
				Idle, AesEncoder, BINDER_NAME) {
			$rootScope.$broadcast('loginSuccess');
			$scope.openModal = function() {
				$('#createNew').modal('show');
			}

			$scope.onBinderClick = function(value) {
				BINDER_NAME.name = value;
				$location.path('/landingPage');
			}

			$scope.fileList = [];
			$scope.curFile;
			$scope.ImageProperty = {
				file : ''
			}

			$scope.setFile = function(element) {
				// get the files
				var files = element.files;
				for (var i = 0; i < files.length; i++) {
					$scope.ImageProperty.file = files[i];

					$scope.fileList.push($scope.ImageProperty);
					$scope.ImageProperty = {};
					$scope.$apply();

				}
			}
			$scope.showSubmitButton = true;
			$scope.steps = [ 'Binder Name', 'Classification', 'Upload' ];
			$scope.selection = $scope.steps[0];

			$scope.getCurrentStepIndex = function() {
				return $scope.steps.indexOf($scope.selection);
			};

			$scope.onCancelClick = function() {
				$scope.fileCHoosed = undefined;
				$scope.fileCHoosedName = undefined;
				$scope.selection = $scope.steps[0];
				$scope.executionName = '';
				$scope.files = [];
				$scope.errorMessage = '';
			};

			$scope.goToStep = function(index) {
				if (($scope.steps[index]) !== undefined) {
					$scope.selection = $scope.steps[index];
				}
			};

			$scope.hasNextStep = function() {
				var stepIndex = $scope.getCurrentStepIndex();
				var nextStep = stepIndex + 1;
				return (($scope.steps[nextStep]) !== undefined);
			};

			$scope.hasPreviousStep = function() {
				var stepIndex = $scope.getCurrentStepIndex();
				var previousStep = stepIndex - 1;
				return (($scope.steps[previousStep]) !== undefined);
			};

			$scope.incrementStep = function() {
				if ($scope.hasNextStep() && $scope.createVersionForm.$valid) {
					var stepIndex = $scope.getCurrentStepIndex();
					var nextStep = stepIndex + 1;
					$scope.selection = $scope.steps[nextStep];
				}

			};

			$scope.showButton = function(uploadFIleValue) {
				if (uploadFIleValue === true) {
					$scope.showSubmitButton = false;
				} else {
					$scope.showSubmitButton = true;
				}
			};

			$scope.fileCHoosed = undefined;

			$scope.onSubmitClick = function() {
				if ($scope.selection === "Execution Name") {
					$scope.onAddExecution();
				} else {
					$scope.uploadFIlesGeneric();
				}
			};

			$scope.changehost = function(hostname) {
				$scope.hostName = hostname;
			};

			$scope.dropText = 'Drag file here ...'

			$scope.setFiles = function(element) {
				$scope.$apply(function($scope) {
					$scope.files = []
					for (var i = 0; i < element.files.length; i++) {
						$scope.files.push(element.files[i])
					}
					$scope.progressVisible = false
				});
			};

			$scope.decrementStep = function() {
				if ($scope.hasPreviousStep()) {
					var stepIndex = $scope.getCurrentStepIndex();
					var previousStep = stepIndex - 1;
					$scope.selection = $scope.steps[previousStep];
				}
			};

			$scope.fileCHoosedName = undefined;

		} ]);