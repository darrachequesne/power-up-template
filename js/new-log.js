/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

var today = new Date();

var yearSelector = document.getElementById('new-log-select-year');
var monthSelector = document.getElementById('new-log-select-month');
var daySelector = document.getElementById('new-log-select-day');
var hours = document.getElementById('new-log-input-hours');
var minutes = document.getElementById('new-log-input-minutes');
var duration = document.getElementById('new-log-input-duration');
var unit = document.getElementById('new-log-input-unit');

function initYear(){
  var year = today.getFullYear();

  for (var i = year - 1; i <= year + 2; i++) {
    var option = document.createElement('option');
    option.value = option.text = i;
    yearSelector.add(option);
  }

  // select the current year
  yearSelector.value = year;
}

function initMonth(){
  monthSelector.value = today.getMonth() + 1;
}

function updateDaysInMonth(){
  var daysInMonth = new Date(yearSelector.value, monthSelector.value, 0).getDate();

  daySelector.options.length = 0;
  for (var i = 1; i <= daysInMonth; i++) {
    var option = document.createElement('option');
    option.value = option.text = i;
    daySelector.add(option);
  }
}

function initDay(){
  daySelector.value = today.getDate();
  hours.value = today.getHours();
  var min = today.getMinutes();
  minutes.value = min - min % 5; // round at 5 minutes
}

initYear();
initMonth();
updateDaysInMonth();
initDay();

function getDuration() {
  return (unit.value === 'h' ? 60 : 1) * parseInt(duration.value, 10);
}

function onAddLog(){
  return t.get('card', 'shared', 'time-logs', [])
    .then(function(logs){
      var newLog = {
        year: yearSelector.value,
        month: monthSelector.value,
        day: daySelector.value,
        h: hours.value,
        min: minutes.value,
        duration: getDuration()
      }
      logs.push(newLog);
      return t.set('card', 'shared', 'time-logs', logs);
    })
    .then(function(){
      t.closePopup();
    });
}

yearSelector.addEventListener('change', updateDaysInMonth);
monthSelector.addEventListener('change', updateDaysInMonth);
document.getElementById('new-log-btn-add-log').addEventListener('click', onAddLog);

t.render(function(){
  t.sizeTo('#content');
});
