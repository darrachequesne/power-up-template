/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var hours = document.getElementById('time-estimation-input-hours');
var minutes = document.getElementById('time-estimation-input-minutes');

function getEstimate(){
  return parseInt(hours.value, 10) * 60 + parseInt(minutes.value, 10);
}

var onSaveEstimate = function(){
  return Promise.all([
    t.get('board', 'shared', 'details', {}),
    t.card('id', 'name')
  ])
  .spread(function(details, card){
    details[card.id] = details[card.id] || {};
    details[card.id].estimate = getEstimate();
    details[card.id].cardName = card.name;

    return t.set('board', 'shared', 'details', details);
  })
  .then(function(){
    t.closePopup();
  });
};

var onRemoveEstimate = function(){
  return Promise.all([
    t.get('board', 'shared', 'details', {}),
    t.card('id', 'name')
  ])
  .spread(function(details, card){
    details[card.id] = details[card.id] || {};
    delete details[card.id].estimate;
    details[card.id].cardName = card.name;

    return t.set('board', 'shared', 'details', details);
  })
  .then(function(){
    t.closePopup();
  });
};

document.getElementById('save-estimate').addEventListener('click', onSaveEstimate);
document.getElementById('remove-estimate').addEventListener('click', onRemoveEstimate);

t.render(function(){
  return Promise.all([
    t.get('board', 'shared', 'details', {}),
    t.card('id', 'name')
  ])
  .spread(function(details, card){

    var estimate = details && details[card.id] && details[card.id].estimate
      ? details[card.id].estimate
      : 30;

    hours.value = Math.floor(estimate / 60);
    minutes.value = estimate % 60;
  })
  .then(function () {
    t.sizeTo('#content');
  })
});
