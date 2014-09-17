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
  });

  // create the controllers and inject Angular's $scope
  gw2Items.controller('mainController', function($scope, $http) {
    // create a message to display in our view
    var response = $http.get("http://www.gw2spidy.com/api/v0.9/json/gem-price");
    response.success(function(data, status, headers, config) {
      console.log(data)
      $scope.quantity = data.result;
    })
  });

  gw2Items.controller('weaponController', ['$scope', '$http',function($scope, $http) {
    $scope.main = { page: 1 };

    //build initial page load
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

  gw2Items.controller('weaponDetailController', function($scope, $http, $routeParams) {
    $scope.id = $routeParams.id;

    var itemHistory = $http.get("http://tkl.dnsdynamic.com:3000/weapons/" + $scope.id);

    itemHistory.success(function(data, status, headers, config) {
        $scope.historyData = data.weapon[0];
        console.log($scope.historyData)
        $scope.date_list = data.lineChart.date_list.reverse();
        $scope.sale_price_list = data.lineChart.sale_price_list.reverse();
        $scope.offer_price_list = data.lineChart.offer_price_list.reverse();

        $scope.linechart = {
          labels: $scope.date_list,
          datasets: [
            {
                label: "Sale Price",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: $scope.sale_price_list
            },
            {
                label: "Buy Price",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: $scope.offer_price_list
            }
          ]
        };

        $scope.piechart = [
            {
                value: $scope.historyData.offer_availability,
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: "Demand"
            },
            {
                value: $scope.historyData.sale_availability,
                color: "#FDB45C",
                highlight: "#FFC870",
                label: "Supply"
            }
        ]

    });

    itemHistory.error(function(data, status, headers, config) {
        alert("AJAX failed!");
    });

    var itemDetail = $http.get("https://api.guildwars2.com/v1/item_details.json?item_id=" + $scope.id);

    itemDetail.success(function(data, status, headers, config) {
        console.log(data)
        $scope.weaponDetail = data;
        $scope.attributes = data.weapon.infix_upgrade.attributes;
    });

    itemDetail.error(function(data, status, headers, config) {
        alert("AJAX failed!");
    });

    $scope.options = {
      animation: true,
      animationSteps: 60,
      responsive: true
    };

  });