  var gw2Items = angular.module('gw2Items', ['ngRoute','angles']);

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

      .otherwise({
                redirectTo:'/'
      });
  });

  // create the controllers and inject Angular's $scope
  gw2Items.controller('mainController', ['$scope','Datasource','$http',function($scope, Datasource, $http) {

    Datasource.getGems(function(data) {
      $scope.quantity = data.result;
    }, $http);
  }]);

  gw2Items.controller('weaponController', ['$scope', 'Datasource', '$http',function($scope, Datasource, $http) {

    //initialize page if its null
    if($scope.main == null) {
      $scope.main = { page: 1 };
    }

    $scope.loadPage = function() {
      Datasource.getWeapons(function(data) {
        $scope.weapons = data.weapon_list;
        $scope.main.totalPages = data.pages;
        $scope.main.page = data.current_page;
        $scope.rares = data.rare;
        $scope.types = data.type;
        $scope.subtypes = data.subtype;
      }, $scope.main.page, $http);
    };

    //increment page
    $scope.nextPage = function() {
        if ($scope.main.page < $scope.main.totalPages) {
            $scope.main.page++;
            $scope.loadPage($scope.main.page);
        }
    };

    //decrement page
    $scope.previousPage = function() {
        if ($scope.main.page > 1) {
            $scope.main.page--;
            $scope.loadPage($scope.main.page);
        }
    };

    //initial load
    if($scope.weapons == null) {
        $scope.loadPage();
    }
  }]);

  gw2Items.controller('weaponDetailController', ['$scope', '$http', 'Datasource', '$routeParams', function($scope, $http, Datasource, $routeParams) {
    $scope.id = $routeParams.id;

    //Grab Chart Data
    Datasource.getWeaponCharts(function(data) {
        $scope.historyData = data.weapon[0];
        $scope.date_list = data.lineChart.date_list.reverse();
        $scope.sale_price_list = data.lineChart.sale_price_list.reverse();
        $scope.offer_price_list = data.lineChart.offer_price_list.reverse();

        $scope.linechart = {
          labels: $scope.date_list,
          datasets: [
            {
                label: "Sell Price",
                fillColor : "rgba(86,118,247,0.2)",
                strokeColor : "rgba(86,118,247,1)",
                pointColor : "rgba(86,118,247,1)",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "rgba(86,118,247,1)",
                data: $scope.sale_price_list
            },
            {
                label: "Buy Price",
                fillColor : "rgba(51,51,44,0.2)",
                strokeColor : "rgba(51,51,44,1)",
                pointColor : "rgba(51,51,44,1)",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "rgba(51,51,44,1)",
                data: $scope.offer_price_list
            }
          ]
        };

        $scope.piechart = [
            {
                value: $scope.historyData.offer_availability,
                color: "#b32e1f",
                highlight: "#e84735",
                label: "Demand"
            },
            {
                value: $scope.historyData.sale_availability,
                color: "#5676f7",
                highlight: "#8ca2f7",
                label: "Supply"
            }
        ];

    }, $scope.id, $http);

    //Grab Weapon Details
    Datasource.getWeaponDetails(function(data){
        $scope.weaponDetail = data;
        $scope.attributes = data.weapon.infix_upgrade.attributes;
    }, $scope.id, $http);

    //Chart Options
    $scope.options = {
      animation: true,
      animationSteps: 60,
      responsive: true
    };

  }]);