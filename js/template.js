/* global TrelloPowerUp */

var GRAY_ICON = './images/clock.svg';

var Promise = TrelloPowerUp.Promise;

function openTimeEstimationPopup(t){
  return t.popup({
    title: 'Time estimation',
    url: './time-estimation-popup.html'
  });
}

function openNewLogPopup(t){
  return t.popup({
    title: 'New log',
    url: './new-log-popup.html'
  });
}

function openMainPopup(t){
  return t.popup({
    title: 'TimeTracker',
    items: [
      {
        text: 'Time estimation',
        callback: openTimeEstimationPopup
      },
      {
        text: 'New log',
        callback: openNewLogPopup
      }
    ]
  });
}

function formatDuration(duration){
  var output = '';
  var hours = Math.floor(duration / 60);
  var minutes = duration % 60;
  if (hours > 0) {
    output += hours + 'h';
  }
  if (minutes > 0) {
    output += minutes + 'min';
  }
  return output;
}

TrelloPowerUp.initialize({
  'attachment-sections': function(t, options){
    return Promise.all([
      t.get('board', 'shared', 'details', {}),
      t.card('id', 'name')
    ])
    .spread(function(details, card){
      details[card.id] = details[card.id] || {};
      var logs = details[card.id].logs || [];

      if(logs.length === 0) {
        return [];
      }
      return [
        {
          icon: GRAY_ICON,
          title: 'Time logs',
          claimed: [{}],
          content: {
            type: 'iframe',
            url: t.signUrl('./details.html')
          }
        }
      ];
    });
  },
  'card-badges': function(t, card) {
    return Promise.all([
      t.get('board', 'shared', 'details', {}),
      t.card('id', 'name')
    ])
    .spread(function(details, card){
      details[card.id] = details[card.id] || {};
      var logs = details[card.id].logs || [];

      if (logs.length === 0) {
        return [];
      }
      var duration = 0;
      for (var i = 0, l = logs.length; i < l; i++) {
        duration += logs[i].duration;
      }

      return [
        {
          icon: GRAY_ICON,
          text: formatDuration(duration)
        }
      ];
    });
  },
  'card-buttons': function(t, options) {
    return [{
      icon: GRAY_ICON,
      text: 'TimeTracker',
      callback: openMainPopup
    }];
  }
});
