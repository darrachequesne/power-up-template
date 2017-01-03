/* global TrelloPowerUp */

var WHITE_ICON = './images/icon-white.svg';
var GRAY_ICON = './images/icon-gray.svg';

var openTimeEstimationPopup = function(t){
  return t.popup({
    title: "Time estimation",
    url: './time-estimation-popup.html'
  });
}

var openNewLogPopup = function(t){
  return t.popup({
    title: "New log",
    url: './new-log-popup.html'
  });
}

TrelloPowerUp.initialize({
  'attachment-sections': function(t, options){
    return t.get('card', 'shared', 'time-logs', [])
      .then(function (logs) {
        if(claimed.length === 0) {
          return [];
        }
        return [
          {
            icon: GRAY_ICON,
            title: "Time logs",
            claimed: [],
            content: {
              type: 'iframe',
              url: t.signUrl('./details.html')
            }
          }
        ];
      });
  },
  'card-buttons': function(t, options) {
    return [{
      icon: GRAY_ICON,
      text: 'Time estimation',
      callback: openTimeEstimationPopup
    }, {
      icon: GRAY_ICON,
      text: 'Add log',
      callback: openNewLogPopup
    }];
  }
});
