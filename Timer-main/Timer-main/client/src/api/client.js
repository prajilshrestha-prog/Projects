const API_BASE = import.meta.env.VITE_APP_BASE_URL;
function checkStatus(response) {
  if (response.ok) {
    return response;
  } else {
    const error = new Error(`HTTP Error: ${response.statusText}`);
    error.status = response.status;
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}
const client = {
  getTimers(success) {
    return fetch(`${API_BASE}/api/timers`, {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(success);
    },
    startTimer(data) {
    return fetch(`${API_BASE}/api/timers/start`, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(checkStatus);
    },
    stopTimer(data) {
    return fetch(`${API_BASE}/api/timers/stop`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(checkStatus);
    },createTimer(data) {
    return fetch(`${API_BASE}/api/timers`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(checkStatus);
},

    deleteTimer(data) { 
        return fetch(`${API_BASE}/api/timers`, {
            method: 'DELETE',
            body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
        }).then(checkStatus);
    },
    updateTimer(data) {
  return fetch(`${API_BASE}/api/timers`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(checkStatus);
}

};

export default client;
