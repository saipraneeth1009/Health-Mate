// Helper function to get intervals from local storage or use defaults
function getIntervals() {
  const DEFAULT_HYDRATION_INTERVAL = 60;
  const DEFAULT_POSTURE_INTERVAL = 45;
  const DEFAULT_EYE_INTERVAL = 30;
  const intervals = {
    hydration: DEFAULT_HYDRATION_INTERVAL,
    posture: DEFAULT_POSTURE_INTERVAL,
    eye: DEFAULT_EYE_INTERVAL,
  };

  try {
    const storedIntervals = JSON.parse(localStorage.getItem('intervals'));
    if (storedIntervals) {
      Object.assign(intervals, storedIntervals);
    }
  } catch (error) {
    console.error('Error retrieving intervals from local storage:', error);
  }

  return intervals;
}

// Function to start all reminders
function startAllReminders() {
  const intervals = getIntervals();
  const selectedReminders = {
    hydration: true,
    posture: true,
    eye: true,
  };
  chrome.runtime.sendMessage(
    { action: 'startReminders', selectedReminders, intervals },
    (response) => {
      if (response && response.success) {
        alert('All reminders started!');
        updateBrowserActionBadge(true); // Update the browser action badge
        updateTimers(intervals); // Update the timers
        updateTimersInterval(intervals); // Start updating timers periodically
      } else {
        alert('Failed to start reminders.');
      }
    }
  );
}

// Function to stop all reminders
function stopAllReminders() {
  chrome.runtime.sendMessage({ action: 'getRemindersStatus' }, (response) => {
    if (response && response.remindersRunning) {
      chrome.runtime.sendMessage({ action: 'stopReminders' }, (response) => {
        if (response && response.success) {
          alert('All reminders stopped.');
          updateBrowserActionBadge(false); // Update the browser action badge
          clearTimers(); // Clear the timers
          clearInterval(updateTimersIntervalId); // Stop updating timers periodically
        } else {
          alert('Failed to stop reminders.');
        }
      });
    } else {
      alert('Reminders are not currently running.');
    }
  });
}

// Function to update the browser action badge
function updateBrowserActionBadge(remindersRunning) {
  const badgeText = remindersRunning ? 'ON' : '';
  const badgeBackgroundColor = remindersRunning ? '#4CAF50' : '#F44336';
  chrome.action.setBadgeText({ text: badgeText });
  chrome.action.setBadgeBackgroundColor({ color: badgeBackgroundColor });
}

// Function to update the timers
function updateTimers(intervals) {
  console.log('updateTimers called');
  chrome.runtime.sendMessage({ action: 'getNextReminders' }, (response) => {
    console.log('getNextReminders response:', response);
    if (response && response.nextReminders) {
      const { hydrationTime, postureTime, eyeTime } = response.nextReminders;

      const hydrationTimer = document.getElementById('hydrationTimer');
      const postureTimer = document.getElementById('postureTimer');
      const eyeTimer = document.getElementById('eyeTimer');

      if (hydrationTimer && postureTimer && eyeTimer) {
        console.log('Timer elements found');
        hydrationTimer.textContent = formatTimer(hydrationTime, intervals.hydration);
        postureTimer.textContent = formatTimer(postureTime, intervals.posture);
        eyeTimer.textContent = formatTimer(eyeTime, intervals.eye);
      } else {
        console.error('One or more timer elements not found');
      }
    } else {
      console.error('Invalid response from getNextReminders');
    }
  });
}

// Function to clear the timers
function clearTimers() {
  const hydrationTimer = document.getElementById('hydrationTimer');
  const postureTimer = document.getElementById('postureTimer');
  const eyeTimer = document.getElementById('eyeTimer');

  if (hydrationTimer) hydrationTimer.textContent = '';
  if (postureTimer) postureTimer.textContent = '';
  if (eyeTimer) eyeTimer.textContent = '';
}

// Function to format the timer
function formatTimer(nextReminderTime, intervalMinutes) {
  if (!nextReminderTime) {
    return '';
  }

  const currentTime = new Date().getTime();
  const timeRemaining = nextReminderTime - currentTime;

  if (timeRemaining <= 0) {
    return 'Next reminder now!';
  }

  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
  const seconds = Math.floor((timeRemaining / 1000) % 60);

  let formattedTimer = 'Next reminder in ';

  if (hours > 0) {
    formattedTimer += `${hours}h `;
  }

  formattedTimer += `${minutes}m ${seconds}s`;

  console.log('formattedTimer:', formattedTimer);

  return formattedTimer;
}
// Function to update timers periodically
let updateTimersIntervalId = null;

function updateTimersInterval(intervals) {
  clearInterval(updateTimersIntervalId);
  updateTimersIntervalId = setInterval(() => {
    updateTimers(intervals);
  }, 1000); // Update timers every 1 second (1000 milliseconds)
}

// Event listener for Start All Reminders button
document.getElementById('startAllBtn').addEventListener('click', startAllReminders);

// Event listener for Stop All Reminders button
document.getElementById('stopAllBtn').addEventListener('click', stopAllReminders);

// Update the browser action badge and timers when the popup is opened
chrome.runtime.sendMessage({ action: 'getRemindersStatus' }, (response) => {
  if (response && response.hasOwnProperty('remindersRunning')) {
    console.log('Reminders status:', response.remindersRunning);
    updateBrowserActionBadge(response.remindersRunning);
    const intervals = getIntervals();
    if (response.remindersRunning) {
      updateTimers(intervals);
      updateTimersInterval(intervals); // Start updating timers periodically
    } else {
      clearTimers();
      clearInterval(updateTimersIntervalId); // Stop updating timers periodically
    }
  } else {
    console.error('Invalid response from getRemindersStatus');
  }
});