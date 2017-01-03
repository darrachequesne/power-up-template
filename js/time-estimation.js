/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

var hours = document.getElementById('time-estimation-input-hours');
var minutes = document.getElementById('time-estimation-input-minutes');

function getEstimate(){
  return parseInt(hours.value, 10) * 60 + parseInt(minutes.value, 10);
}

var onSaveEstimate = function(){
  return t.set('card', 'shared', 'time-estimate', getEstimate())
  .then(function(){
    t.closePopup();
  });
};

var onRemoveEstimate = function(){
  return t.set('card', 'shared', 'time-estimate', undefined)
  .then(function(){
    t.closePopup();
  });
};

document.getElementById('save-estimate').addEventListener('click', onSaveEstimate);
document.getElementById('remove-estimate').addEventListener('click', onRemoveEstimate);
