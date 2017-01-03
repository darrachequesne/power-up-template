/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

var logs = document.getElementsByClassName('details-logs-list')[0];
var progressPercentage = document.getElementsByClassName('details-progress-percentage')[0];
var progress = document.getElementsByClassName('details-progress-bar-current')[0];

function formatLog(log){
  return '<b>' + log.h + 'h' + log.min + 'min' + '</b>';
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
      logs.append(item);

      duration += logs[i].duration;
    }

    var p = estimate > 0 ? Math.min(Math.floor(duration / estimate), 100) : 0;

    progressPercentage.innerHTML = p + '%';
    progress.style.width= p + '%';

  })
  .then(function(){
    t.sizeTo('#content');
  })
});
