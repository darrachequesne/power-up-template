/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

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

$('#calendar').fullCalendar({
  customButtons: {
    close: {
      text: 'close',
      click: onClose
    }
  },
  header: {
    left: 'prev,next today',
    center: 'title',
    right: 'month,agendaWeek,agendaDay close'
  },
  height: 'parent',
  navLinks: true, // can click day/week names to navigate views
  eventLimit: true, // allow "more" link when too many events
  defaultView: 'agendaWeek',
  eventColor: '#0079BF',

  eventSources: [
    {
      events: function(start, end, timezone, callback) {
        t.get('board', 'shared', 'details', {})
        .then(function(details){

          var events = [];
          var card, logs, log, start;
          var colorHash = new ColorHash();

          for (cardId in details) {
            card = details[cardId];
            logs = card.logs || [];
            for (var i = 0, l = logs.length; i < l; i++) {
              log = logs[i];

              var start = moment([log.year, log.month - 1, log.day, log.h, log.min]);
              if (!start.isValid()) continue;

              var end = start.clone().add(parseInt(log.duration, 10) || 0, 'minutes');
              var rgb = colorHash.rgb(card.cardName);
              events.push({
                title: card.cardName,
                start: start.format(),
                end: end.format(),
                color: 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'
              });
            }
          }

          callback(events);
        });
      }
    }
  ]
});

t.render(function(){
  $('#calendar').fullCalendar('refetchEvents');
});

// close overlay if user clicks outside our content
document.addEventListener('click', onClick);
// close overlay if user presses escape key
document.addEventListener('keyup', onKeyUp);
