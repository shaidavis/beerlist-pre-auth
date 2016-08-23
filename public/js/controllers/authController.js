app.controller('AuthCtrl', ['$scope', 'auth', function($scope, auth){
  

  $scope.register = function () {
    auth.register($scope.user);
  };

  
}]);