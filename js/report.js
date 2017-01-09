/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

var content = document.getElementById('content');

var $ = window.jsrender;
var linesTemplateContent = document.getElementById('lines-template').innerHTML;
var linesTemplate = $.templates(linesTemplateContent);

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

function displayDetails(details){
  var lines = Object.keys(details)
  .map(function(cardId){
    var card = details[cardId];
    var logs = card.logs || [];

    var duration = logs.reduce(function(sum, log){
      return sum + parseInt(log.duration, 10);
    }, 0);

    var estimate = parseInt(card.estimate, 10) || 0;
    var percentage = estimate > 0 ? Math.floor(duration * 100 / estimate) : 0;

    return {
      cardName: card.cardName,
      sizeCoeff: Math.max(estimate, duration),
      estimate: estimate > 0 ? formatDuration(estimate) : '',
      duration: formatDuration(duration),
      fullPercentage: percentage,
      safePercentage: Math.min(percentage, 100)
    };
  })
  .sort(function (a, b) {
    return -(a.sizeCoeff - b.sizeCoeff);
  });

  console.log(lines.map(function(line){
    return line.sizeCoeff;
  }))

  var maxSizeCoeff = Math.max.apply(null, lines.map(function(line){
    return line.sizeCoeff;
  }));

  lines.map(function(line){
    line.relativeWidth = Math.floor(line.sizeCoeff * 100 / maxSizeCoeff);
  })

  var html = linesTemplate.render({ lines: lines });
  content.innerHTML = html;
}

function onRender(){
  t.get('board', 'shared', 'details', {})
  .then(displayDetails);
}

t.render(onRender);

function onClick(e){
  if(e.target.tagName == 'BODY') {
    t.closeOverlay().done();
  }
}

function onKeyUp(e){
  if(e.keyCode == 27) {
    t.closeOverlay().done();
  }
}

function onClose(){
  t.closeOverlay().done();
}

// close overlay if user clicks outside our content
document.addEventListener('click', onClick);
// close overlay if user presses escape key
document.addEventListener('keyup', onKeyUp);
