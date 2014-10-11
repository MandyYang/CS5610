function CoursesCtrl($scope, $http) {

	$scope.message = "Course information and schedule";

	$scope.create = function () {
		$http.post("/Courses", $scope.Course)
		.success(function (response) { 
			$scope.all();
		});
	}

	$scope.renderCourses = function (response) {
		$scope.Courses = response;

	};

	$scope.remove = function (id) {
		$http.delete("/Courses/" + id)
		.success(function (response) {
			$scope.all();
		});
	};

	$scope.update = function () {
		$http.put("/Courses/" + $scope.Course._id, $scope.Course)
		.success(function(response) {
				$scope.all();
		});
	};

	$scope.select = function (id) {
		$http.get("/Courses/" + id)
		.success(function (response) {
			$scope.Course = response;
		});
	};

	$scope.all = function () {
		$http.get("/Courses")
		.success($scope.renderCourses);
	}

	$scope.all();
}