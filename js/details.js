/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var logsList = document.getElementsByClassName('details-logs-list')[0];
var progressPercentage = document.getElementsByClassName('details-progress-percentage')[0];
var progress = document.getElementsByClassName('details-progress-bar-current')[0];

function zpad(n){
  return (n >= 10 ? '' : '0') + n;
}

// returns 2016-01-01 12h00 [1h30]
function formatLog(log, index){
  var output = '<b>';
  output += log.year + '-' + zpad(log.month) + '-' + zpad(log.day) + ' ';
  output += zpad(log.h) + 'h' + zpad(log.min) + ' ';

  output += '[';
  var hours = Math.floor(log.duration / 60);
  var minutes = log.duration % 60;
  if (hours > 0) {
    output += hours + 'h';
  }
  if (minutes > 0) {
    output += zpad(minutes) + 'min';
  }
  output += ']';
  output += '</b>';

  return output;
}

// return '201601010915' for 2016-01-01 09h15
function hash(log){
  return '' + log.year + zpad(log.month) + zpad(log.day) + zpad(log.g) + zpad(log.min);
}

function compareLog(a, b){
  return parseInt(hash(a), 10) - parseInt(hash(b), 10);
}

t.render(function(){
  return Promise.all([
    t.get('board', 'shared', 'details', {}),
    t.card('id')
  ])
  .spread(function(details, card){
    details[card.id] = details[card.id] || {};
    var logs = details[card.id].logs || [];
    var estimate = details[card.id].estimate || 0;

    var duration = 0;

    logsList.innerHTML = '';

    // save index since it will be used for log removal
    for (var i = 0, l = logs.length; i < l; i++) {
      logs[i].index = i;
    }

    logs.sort(compareLog);

    for (var i = 0, l = logs.length; i < l; i++) {
      var item = document.createElement('li');
      item.innerHTML = formatLog(logs[i], i);

      var remove = document.createElement('a');
      remove.innerHTML = 'Remove';
      remove.className = 'details-btn-remove-log';
      remove.addEventListener('click', onRemoveLog(logs[i].index));
      item.append(remove);

      logsList.append(item);
      duration += logs[i].duration;
    }

    var p = estimate > 0 ? Math.floor(duration * 100 / estimate) : 0;

    progressPercentage.innerHTML = p + '%';
    progress.style.width= Math.min(p, 100) + '%';
    progress.className = 'details-progress-bar-current';
    if (p > 100) {
      progress.className += ' complete';
    }

  })
  .then(function(){
    t.sizeTo('#content');
  })
});

function onRemoveLog(i){
  return function _onRemoveLog(){
    return Promise.all([
      t.get('board', 'shared', 'details', {}),
      t.card('id', 'name')
    ])
    .spread(function(details, card){
      details[card.id] = details[card.id] || {};
      details[card.id].logs = details[card.id].logs || [];

      if (i >= details[card.id].logs.length) return;

      details[card.id].logs.splice(i, 1);
      details[card.id].cardName = card.name;

      return t.set('board', 'shared', 'details', details);
    });
  }
}
