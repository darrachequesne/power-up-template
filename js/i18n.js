
window.localizer = loadLocalizer(window.locale || 'en');

function loadLocalizer(locale) {
  switch (window.locale) {
    case 'fr':
      return {
        localize: localizeFR
      };
    default:
      return {
        localize: localizeEN
      };
  }
}

localizeFR: function(key, data){
  switch (key) {
    case 'time-spent': return 'Temps passé';
    case 'remove': return 'Supprimer';
    case 'estimate-time': return 'Estimer le temps nécessaire';
    case 'new-log': return 'Ajouter un log de temps';
    default: return '';
  }
}

localizeEN: function(key, data){
  switch (key) {
    case 'time-spent': return 'Time spent';
    case 'remove': return 'Remove';
    case 'estimate-time': return 'Estimate the completion time';
    case 'new-log': return 'Add a new time log entry';
    default: return '';
  }
}
