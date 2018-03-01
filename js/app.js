var app = angular.module('angtemp',['ngRoute']);

app.config(function($routeProvider){
    $routeProvider
    .when('/',{
      templateUrl: "views/main.htm",
      controller: "mainCtrl"
    })
    .when('/clsearch',{
      templateUrl: "views/clsearch.htm",
      controller: "clsearchCtrl"
    })
    .when('/aww',{
      templateUrl: "views/aww.htm",
      controller: "awwCtrl"
    })
    .otherwise({
      templateUrl: "views/404.htm"
    });
  })
  .controller('mainCtrl', ['$scope','$filter','$http',function($scope, $filter, $http) {
    $scope.page = "Main";
    $scope.msg = "Task manager app."
    $scope.tasks = [];
    $scope.research = [];
    if (localStorage.getItem('tasks')) {
      $scope.tasks = JSON.parse(localStorage.getItem('tasks'))
    }
    if (localStorage.getItem('research')) {
      $scope.research = JSON.parse(localStorage.getItem('research'))
    }

    $scope.addTask = function(){
      if ($scope.newTask.length>0) {

        var index = $scope.tasks.indexOf($scope.newTask);
        var newTask = angular.copy($scope.newTask);
        $scope.newTask = "";
        if (index<0) {
          $scope.tasks.push(newTask);
          localStorage.setItem('tasks',JSON.stringify($scope.tasks));
        }
        else {
          alert('Task already exists');
        }
        setTimeout(function () {
          if ($scope.isDark) {
            $scope.darkToggle(true);
          }
        }, 5);
      }
    };
    $scope.removeTask = function(array,task){
      var found = false;
      var index = array.indexOf(task);
      if (index>-1) {
        array.splice(index, 1);
        localStorage.setItem('tasks',JSON.stringify($scope.tasks));
        localStorage.setItem('research',JSON.stringify($scope.research));
      }
    };
    $scope.moveTask = function(task,left){
      if (left) {
        $scope.tasks.push(task);
        localStorage.setItem('tasks',JSON.stringify($scope.tasks));
        $scope.removeTask($scope.research,task);
      }
      else {
        $scope.research.push(task);
        localStorage.setItem('research',JSON.stringify($scope.research));
        $scope.removeTask($scope.tasks,task);
      }
      setTimeout(function () {
        if ($scope.isDark) {
          $scope.darkToggle(true);
        }
      }, 5);
    };
    $scope.keyHandler = function(e){
      e = e.keyCode;
      if(e==13){
        $scope.addTask();
      }
    };
    $scope.isDark = false;
    $scope.darkToggle = function(force){
      if (!$scope.isDark || force) {
        $("body").css({backgroundColor: "rgb(51, 51, 51)", color: "rgb(222, 222, 222)"});
        $("button").css({backgroundColor: "black", color: "#d3d3d3" });
        $(".remove").css({backgroundColor: "#af1515", color: "#d3d3d3" });
        $("a").css({color: "white" });
        $("input").css({color:"black"});
        $scope.isDark = true;
      }
      else {
        $("body").css({backgroundColor: "white", color: "black"});
        $("button").css({backgroundColor: "#d3d3d3", color: "inherit" });
        $("a").css({color: "#337ab7" });

        $scope.isDark = false;
      }
    }

    // $scope.serversODD = {
    //   DBAfswsprd01: [["DBAgradformsprodextSSLFarm","8012"], ["DBAgradformsFarmSSL","8010"], ["DBAsponsorshipsFarmSSLFarm","8011"]],
    //   DBAfswsprd03: [["DBAetravelFarm","8010"], ["DBAerequestFarmSSL","8011"], ["DBAetravelFarmSSL","8010"], ["DBAereqwebsvcsFarmSSL","8012"], ["DBAoasisprdwebsvcsfinreqFarmSSL","8101"], ["DBAoasisprdwebsvcstravelFarmSSL","8100"], ["MW-oasisprdwebsvcsapi-SSL-SG","8102"]],
    //   DBAfswsprd05: [["DBAriceFarm","8000"], ["DBAfsservicesFarm","8001"], ["DBAricehrFarm","8002"]],
    //   DBAfswsprd07: [["DBAcurriculumFarmSSL","8010"], ["DBAhractionFarmSSL","8011"], ["DBAbusleaveFarmSSL","8012"]],
    //   DBAfswsprd09: [["DBAetimesheetFarmSSL","8010"], ["DBAtimewebsvcsFarm","8000"], ["DBAoasisprdwebsvcsleaveSSLFarm","8101"], ["DBAeleaveFarmSSL","8011"]],
    //   DBAwaappprd01: [["DBAoasiswaprdSSLFarm","443"]]
    // }
    //
    // $scope.serversEVEN = {
    //   DBAfswsprd02: [["DBAgradformsprodextSSLFarm","8012"], ["DBAgradformsFarmSSL","8010"], ["DBAsponsorshipsFarmSSLFarm","8011"]],
    //   DBAfswsprd04: [["DBAetravelFarm","8010"], ["DBAerequestFarmSSL","8011"], ["DBAetravelFarmSSL","8010"], ["DBAereqwebsvcsFarmSSL","8012"], ["DBAoasisprdwebsvcsfinreqFarmSSL","8101"], ["DBAoasisprdwebsvcstravelFarmSSL","8100"], ["MW-oasisprdwebsvcsapi-SSL-SG","8102"]],
    //   DBAfswsprd06: [["DBAriceFarm","8000"], ["DBAfsservicesFarm","8001"], ["DBAricehrFarm","8002"]],
    //   DBAfswsprd08: [["DBAcurriculumFarmSSL","8010"], ["DBAhractionFarmSSL","8011"], ["DBAbusleaveFarmSSL","8012"]],
    //   DBAfswsprd010: [["DBAetimesheetFarmSSL","8010"], ["DBAtimewebsvcsFarm","8000"], ["DBAoasisprdwebsvcsleaveSSLFarm","8101"], ["DBAeleaveFarmSSL","8011"]],
    //   DBAwaappprd02: [["DBAoasiswaprdSSLFarm","443"]]
    // }

  }])
  .controller('clsearchCtrl', ['$scope','$filter', '$http', '$sce','FeedService',function($scope, $filter, $http, $sce, Feed) {
    // need to add options which includes setting favorites, clearing all data, clearing filtered, clearing saved

    $scope.page = "CL Search";
    $scope.msg = "CraigsList Search.";
    $scope.showOptions = false;
    $scope.redditURL = "https://www.reddit.com/r/legodeal/new.json";
    $scope.searched = false;
    $scope.results = [];
    $scope.savedResults = [];
    $scope.savedResultsOrig = [];
    $scope.filtered = [];
    if (localStorage.getItem('filtered')) {
      $scope.filtered = JSON.parse(localStorage.getItem('filtered'))
    }
    if (localStorage.getItem('savedResults')) {
      $scope.savedResultsOrig = JSON.parse(localStorage.getItem('savedResults'))
      $scope.savedResults = angular.copy($scope.savedResultsOrig);
    }
    $scope.city = window.localStorage.city;
    $scope.pageView = "";

    $scope.keyHandler = function(e,origin){
      e = e.keyCode;
      if(e==13 && origin=='clSearch'){
        $scope.search();
      }
      if(e==13 && origin=='savedSites'){
        $scope.filterSites();
      }
    };

    $scope.getLegoDeal = function(){
      if (!$scope.searched) {
        $scope.searched = true;
      }
      $http.get($scope.redditURL)
      .then(function(response){
        var results = response.data.data.children;
        $scope.cleanRedditResults(results);
      })
      .catch(function(error){
        console.log("Get Reddit failed.");
      })
    };

    $scope.cleanRedditResults = function(results){
      var cleaned = [];
      for (var i = 0; i < results.length; i++) {
        if ($scope.filtered.indexOf(results[i].data.url)<0) {
          var date = new Date(results[i].data.created_utc*1000);
          // console.log(results[i]);
          var cleanedObj = {
            title: results[i].data.title,
            link: results[i].data.url,
            content: "Posted by: "+results[i].data.author+" "+(date),
            flair: results[i].data.link_flair_text
          }
          cleaned.push(cleanedObj);
        }
      }
      $scope.results = cleaned;
    };

    $scope.parseFlair = function(flair,i){
      if (flair) {

        flairCopy = flair.toLowerCase();
        if (flairCopy.indexOf("dead deal")>=0 || flairCopy.indexOf("price increased")>=0) {
          $("#result"+i).css({backgroundColor: 'red'});
        }
        else if (flairCopy.indexOf("ymmv")>=0) {
          $("#result"+i).css({backgroundColor: 'yellow'});
        }
        return flair;
      }
    }

    $scope.fixTitle = function(title){
      return title.replace('&#x0024;','$').replace('&amp;','&');
    }

    $scope.search = function(){
      if (!$scope.searched) {
        $scope.searched = true;
      }
      localStorage.setItem("city", $scope.city);
      var feedURL = "http://"+$scope.city+".craigslist.org/search/sss?format=rss&query="+$scope.query;
      Feed.parseFeed(feedURL)
          .then(function(result){
              $scope.results = result.data.responseData.feed.entries;
              for (var i = 0; i < $scope.results.length; i++) {
                if ($scope.filtered.indexOf($scope.results[i].link)>-1) {
                  $scope.removeResult($scope.results[i],true)
                  i--;
                }
              }
          })
    };

    $scope.searchAll = function(){
      if (!$scope.searched) {
        $scope.searched = true;
      }
      localStorage.setItem("city", $scope.city);
      $scope.favorites = ["lego","legos","lego's"];
      $scope.results = [];

          for (var i = 0; i < $scope.favorites.length; i++) {
            var feedURL = "http://"+$scope.city+".craigslist.org/search/sss?format=rss&query="+$scope.favorites[i];
            Feed.parseFeed(feedURL)
            .then(function(result){
                $scope.results = _.union($scope.results,result.data.responseData.feed.entries);
                for (var i = 0; i < $scope.results.length; i++) {
                  if ($scope.filtered.indexOf($scope.results[i].link)>-1) {
                    $scope.removeResult($scope.results[i],true)
                    i--;
                  }
                }
            })

          }
    }

    $scope.forget = function(){
      $scope.city = "";
      localStorage.setItem("city", $scope.city);
    }

    $scope.removeResult = function(result,origin){
      if (origin=='savedResults') {
        var found = false;
        var index = -1;
        for (var i = 0; i < $scope.savedResultsOrig.length && !found; i++) {
          if ($scope.savedResultsOrig[i].title==result.title) {
            index = i;
          }
        }
        if (index>-1) {
          $scope.savedResultsOrig.splice(index,1);
          localStorage.setItem('savedResults',JSON.stringify($scope.savedResultsOrig));
          $scope.savedResults = angular.copy($scope.savedResultsOrig);
        }
      }
      else {
        var index = $scope.results.indexOf(result);
        if (index>-1) {
          if (origin=='results') {
            $scope.filtered.push(result.link);
            localStorage.setItem('filtered',JSON.stringify($scope.filtered));
          }
          $scope.results.splice(index, 1);
        }
      }
    };

    $scope.saveResult = function(result){
      $scope.savedResultsOrig.push(result);
      localStorage.setItem('savedResults',JSON.stringify($scope.savedResultsOrig));
      $scope.removeResult(result,'results');
      $scope.savedResults = angular.copy($scope.savedResultsOrig);
    };

    // Filters saved results
    $scope.filterSites = function(){
      if ($scope.filterTerm.length > 0) {
        $scope.savedResults = _.filter($scope.savedResultsOrig, function(result){ return (result.title.toLowerCase().indexOf($scope.filterTerm.toLowerCase()) >=0) || (result.content.toLowerCase().indexOf($scope.filterTerm.toLowerCase()) >=0); });
      }
      else {
        $scope.resetFilter();
      }
    };
    $scope.resetFilter = function(){
      $scope.savedResults = angular.copy($scope.savedResultsOrig);
      $scope.filterTerm = "";
    };

    $scope.openOptions = function(){
      $scope.showOptions = true;
    }

    $scope.closeOptions = function(){
      $scope.showOptions = false;
    }

    $scope.setPageView = function(link){
      $scope.pageView = $sce.trustAsResourceUrl(link);
    };
  }])
  .controller('awwCtrl', ['$scope','$filter', '$http', '$sce','FeedService',function($scope, $filter, $http, $sce, Feed) {
    $scope.searched = false;
    $scope.results = [];
    $scope.filtered = [];
    $scope.redditURL = "https://www.reddit.com/r/aww/hot.json";

    $scope.getAww = function(){
      if (!$scope.searched) {
        $scope.searched = true;
      }
      $http.get($scope.redditURL)
      .then(function(response){
        var results = response.data.data.children;
        $scope.cleanRedditResults(results);
        // $scope.results = results;
      })
      .catch(function(error){
        console.log("Get Reddit failed.");
      })
    };

    $scope.cleanRedditResults = function(results){
      var cleaned = [];
      for (var i = 0; i < results.length; i++) {
        if ($scope.filtered.indexOf(results[i].data.url)<0) {
          var date = new Date(results[i].data.created_utc*1000);
          // console.log(results[i]);
          var cleanedObj = {
            title: results[i].data.title,
            permalink: "https://reddit.com"+results[i].data.permalink,
            link: results[i].data.url,
            // content: "Posted by: "+results[i].data.author+" "+(date),
            // flair: results[i].data.link_flair_text
          }
          if (cleanedObj.link.indexOf("gifv")>=0) {
            if (results[i].data.preview && results[i].data.preview.images && results[i].data.preview.images.variants && results[i].data.preview.images.variants.gif) {
              cleanedObj.link=results[i].data.preview.images.variants.gif.source.url;
            }
            else {
              cleanedObj.link = cleanedObj.link.substr(0,cleanedObj.link.length-1);
            }
          }
          else if (cleanedObj.link.indexOf("imgur")>=0) {
            cleanedObj.link+=".gif"
          }
          else if (results[i].data.preview.images.variants) {
            cleanedObj.link=results[i].data.preview.images.variants.gif.source.url;
          }
          cleaned.push(cleanedObj);
        }
      }
      $scope.results = cleaned;
    };
  }])
  .filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1) : '';
    }
  })
  .factory('FeedService',['$http',function($http){
		return {
			parseFeed : function(url){
				return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
			}
		}}]);
