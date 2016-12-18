
angular.module('ng1onsenapp')

// Controller

.controller('VideosController', function ($scope, $http, $log, VideosService) {

    init();

    function init() {
      $scope.youtube = VideosService.getYoutube();
      $scope.results = VideosService.getResults();
      $scope.history = VideosService.getHistory();
      $scope.urls = VideosService.getUrls();
    };

    $scope.isAndroid = function() {
      return ons.platform.isAndroid();
    };

    $scope.toolbarTitle = 'Search';
    $scope.updateToolbar = function(title) {
      $scope.toolbarTitle = title;
    };

    $scope.focusInput = function(platform) {
      document.getElementById(platform + '-search-input').focus();
    };

    $scope.blurInput = function(platform) {
      document.getElementById(platform + '-search-input').blur();
    };

    $scope.launch = function (video, archive) {
      VideosService.launchPlayer(video.id, video.title);
      if (archive) {
      	VideosService.archiveVideo(video);
      }
      $log.info('launched id:' + video.id + ' and title:' + video.title);
    };

    $scope.nextPageToken = '';
    $scope.labelSearch = 'Search for Angular Videos!';
    $scope.labelHistory = 'Watched Angular Videos!';
    $scope.labelExplore = 'Read these References now!'

    $scope.loading = false;

    $scope.loadMore = function(done) {
      $scope.search(false).then(done);
    };

    $scope.search = function (isNewQuery) {
      $scope.loading = true;
      return $http.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: '',
          type: 'video',
          maxResults: '10',
          pageToken: isNewQuery ? '' : $scope.nextPageToken,
          part: 'id,snippet',
          fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle,nextPageToken',
          q: this.query
        }
      })
      .success( function (data) {
        if (data.items.length === 0) {
          $scope.label = 'No results were found!';
        }
        VideosService.listResults(data, $scope.nextPageToken && !isNewQuery);
        $scope.nextPageToken = data.nextPageToken;
        $log.info(data);
        $scope.loading = false;
      })
      .error( function (e) {
        $log.info('Search error: ', e);
        $scope.loading = false;
      })
      ;
    };
});
