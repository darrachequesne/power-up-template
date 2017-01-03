/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var logsList = document.getElementsByClassName('details-logs-list')[0];
var progressPercentage = document.getElementsByClassName('details-progress-percentage')[0];
var progress = document.getElementsByClassName('details-progress-bar-current')[0];

function zpad(n){
  return (n > 10 ? '' : '0') + n;
}

// returns 2016-01-01 12h00 [1h30]
function formatLog(log){
  var output = '<b>';
  output += log.year + '-' + zpad(log.month) + '-' + zpad(log.day) + ' ';
  output += log.h + 'h' + zpad(log.min) + ' ';

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

t.render(function(){
  return Promise.all([
    t.get('card', 'shared', 'time-logs', []),
    t.get('card', 'shared', 'time-estimate', 0)
  ])
  .spread(function(logs, estimate){

    var duration = 0;

    for (var i = 0, l = logs.length; i < l; i++) {
      var item = document.createElement('li');
      item.innerHTML = formatLog(logs[i]);
      logsList.append(item);

      duration += logs[i].duration;
    }

    var p = estimate > 0 ? Math.min(Math.floor(duration * 100 / estimate), 100) : 0;

    progressPercentage.innerHTML = p + '%';
    progress.style.width= p + '%';

  })
  .then(function(){
    t.sizeTo('#content');
  })
});
