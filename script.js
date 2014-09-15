  var gw2Items = angular.module('gw2Items', ['ngRoute']);

  // configure our routes
  gw2Items.config(function($routeProvider) {
    $routeProvider
      // route for the home page
      .when('/', {
        templateUrl : 'partials/home.html',
        controller  : 'mainController'
      })

      // route for the weapon page list
      .when('/weapons', {
        templateUrl : 'partials/weapons.html',
        controller  : 'weaponController'
      })

      .when('/weapons/:id', {
        templateUrl : 'partials/weapon_detail.html',
        controller  : 'weaponDetailController'
      })
  });

  // create the controllers and inject Angular's $scope
  gw2Items.controller('mainController', function($scope) {
    // create a message to display in our view
    $scope.message = 'This is the main page';
  });

  gw2Items.controller('weaponController', ['$scope', '$http',function($scope, $http) {
    $scope.main = { page: 1 };

    //build initial page page load
    var response = $http.get("http://tkl.dnsdynamic.com:3000/weapons");

    response.success(function(data, status, headers, config) {
        $scope.weapons = data.weapon_list;
        $scope.pages = data.pages;
        $scope.rares = data.rare;
        $scope.types = data.type;
        $scope.subtypes = data.subtype;
    });

    response.error(function(data, status, headers, config) {
        alert("AJAX failed!");
    });

    //build function to trigger next page of data
    $scope.loadPage = function() {
      $http.get("http://tkl.dnsdynamic.com:3000/weapons?page=" + $scope.main.page).success(function(data, status, headers, config) {
          $scope.weapons = data.weapon_list;
      });
    };

    //increment page
    $scope.nextPage = function() {
        if ($scope.main.page < $scope.main.pages) {
            $scope.main.page++;
            $scope.loadPage();
        }
    };

    //decrement page
    $scope.previousPage = function() {
        if ($scope.main.page > 1) {
            $scope.main.page--;
            $scope.loadPage();
        }
    };
  }]);