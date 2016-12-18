
var app = angular.module('ng1onsenapp', ['onsen']);

// Run

app.run(function () {
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

// Config

app.config( function ($httpProvider) {
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

// Service

app.service('VideosService', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {

  var service = this;

  var youtube = {
    ready: false,
    player: null,
    playerId: null,
    videoId: null,
    videoTitle: null,
    playerHeight: '100%',
    playerWidth: '100%',
    state: 'stopped'
  };
  var results = [];
  var history = [];

  $window.onYouTubeIframeAPIReady = function () {
    $log.info('YouTube API is ready');
    youtube.ready = true;
    service.bindPlayer('placeholder');
    service.loadPlayer();
    $rootScope.$apply();
  };

  this.bindPlayer = function (elementId) {
    $log.info('binding to ' + elementId);
    youtube.playerId = elementId;
  };

  this.createPlayer = function () {
    $log.info('creating a new YouTube player for DOM id ' + youtube.playerId + ' and video ' + youtube.videoId);
    return new YT.Player(youtube.playerId, {
      height: youtube.playerHeight,
      width: youtube.playerWidth,
      playerVars: {
        rel: 0,
        showinfo: 0
      }
    });
  };

  this.loadPlayer = function () {
    if (youtube.ready && youtube.playerId) {
      if (youtube.player) {
        youtube.player.destroy();
      }
      youtube.player = service.createPlayer();
    }
  };

  this.launchPlayer = function (id, title) {
    youtube.player.loadVideoById(id);
    youtube.videoId = id;
    youtube.videoTitle = title;
    return youtube;
  }

  this.listResults = function (data, append) {
    if (!append) {
      results.length = 0;
    }
    for (var i = data.items.length - 1; i >= 0; i--) {
      results.push({
        id: data.items[i].id.videoId,
        title: data.items[i].snippet.title,
        description: data.items[i].snippet.description,
        thumbnail: data.items[i].snippet.thumbnails.default.url,
        author: data.items[i].snippet.channelTitle
      });
    }
    return results;
  }

  this.archiveVideo = function (video) {
    history.unshift(video);
    return history;
  };

  this.getYoutube = function () {
    return youtube;
  };

  this.getResults = function () {
    return results;
  };

  this.getHistory = function () {
    return history;
  };

  this.getUrls = function () {
    return URLS;
  };

  const URLS = [
  { location: 'https://angular.io/', name: 'Angular 2' },
  { location: 'https://angularjs.org/', name: 'Angular 1' },
  { location: 'https://ionicframework.com/', name: 'Ionic 2' },
   { location: 'https://onsen.io/angular2/', name: 'Onsen UI 2' },
  { location: 'https://getmdl.io/', name: 'Material Design Lite' },
   { location: 'https://universal.angular.io/', name: 'Angular Universal' },
  { location: 'https://cli.angular.io/', name: 'Angular CLI' },
   { location: 'https://material.angularjs.org/latest/', name: 'Angular Material' },
  { location: 'https://material.io/guidelines/', name: 'Material Design' },
   { location: 'http://www.protractortest.org/#/', name: 'Angular Protractor' },
  { location: 'https://augury.angular.io/', name: 'Angular Augury' },
   { location: 'https://webdev.dartlang.org/angular/guide', name: 'Angular Dart' },
  { location: 'https://mobile.angular.io/', name: 'Angular Mobile' },
   { location: 'https://angularfire2.com/api/', name: 'Angular Fire 2' },
  { location: 'https://github.com/angular/code-of-conduct/blob/master/CODE_OF_CONDUCT.md', name: 'Angular Code Of Conduct' },
   { location: 'https://www.madewithangular.com/#/', name: 'Made With Angular 1' }, 
    { location: 'http://angularexpo.com/', name: 'Angular 2 Exposition' }, 
   { location: 'https://firebase.google.com/', name: 'Firebase Angular Cloud' },
   { location: 'https://ionic.io/', name: 'Ionic Cloud' },
  { location: 'https://cloud.google.com/', name: 'Google Global Cloud' },
  { location: 'https://www.android.com/intl/de_de/', name: 'Android' },
];

}]);

