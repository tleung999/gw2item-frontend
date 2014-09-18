"use strict";

gw2Items.factory('Datasource',
  function () {
    return {
      getWeapons:function(_onSuccess, _page, _http) {
        _http.get("http://tkl.dnsdynamic.com:3000/weapons?page=" + _page).success(function(data){
          _onSuccess(data);
        });
      },
      getGems:function(_onSuccess, _http) {
        _http.get("http://www.gw2spidy.com/api/v0.9/json/gem-price").success(function(data){
          _onSuccess(data);
        });
      },
      getWeaponCharts:function(_onSuccess, _id, _http) {
        _http.get("http://tkl.dnsdynamic.com:3000/weapons/" + _id).success(function(data){
          _onSuccess(data);
        });
      },
      getWeaponDetails:function(_onSuccess, _id, _http) {
        _http.get("https://api.guildwars2.com/v1/item_details.json?item_id=" + _id).success(function(data){
          _onSuccess(data);
        });
      }
    };
  }
);
