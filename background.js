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

// Function to create a reminder notification
function createReminder(reminderType) {
  const options = {
    type: 'basic',
    iconUrl: 'water.png',
    title: 'Health Mate Reminder',
    message: '',
  };

  switch (reminderType) {
    case 'hydration':
      options.message = 'Time to drink water!';
      break;
    case 'posture':
      options.message = 'Check your posture!';
      break;
    case 'eye':
      options.message = 'Take a break and rest your eyes!';
      break;
    default:
      break;
  }

  chrome.notifications.create(options);
}

// Function to update the browser action badge
function updateBrowserActionBadge(remindersRunning) {
  const badgeText = remindersRunning ? 'ON' : '';
  const badgeBackgroundColor = remindersRunning ? '#4CAF50' : '#F44336';
  chrome.action.setBadgeText({ text: badgeText });
  chrome.action.setBadgeBackgroundColor({ color: badgeBackgroundColor });
}

// Flag to track if reminders are running
let remindersRunning = false;

// Function to start reminders
function startReminders(selectedReminders, intervals) {
  // Request notifications permission
  chrome.permissions.request(
    { permissions: ['notifications'] },
    (granted) => {
      if (granted) {
        console.log('Notification permission granted.');
        // Clear existing alarms
        chrome.alarms.clearAll();

        // Set up new alarms for enabled reminders
        Object.entries(selectedReminders).forEach(([reminderType, enabled]) => {
          if (enabled) {
            const intervalMinutes = parseInt(intervals[reminderType], 10);
            const intervalMilliseconds = intervalMinutes * 60000; // Convert minutes to milliseconds
            console.log(`Setting up ${reminderType} reminder interval for ${intervalMinutes} minutes.`);
            chrome.alarms.create(`${reminderType}Alarm`, {
              delayInMinutes: intervalMinutes,
              periodInMinutes: intervalMinutes,
            });
          }
        });

        remindersRunning = true; // Set the flag to indicate reminders are running
        updateBrowserActionBadge(remindersRunning); // Update the browser action badge
      } else {
        console.error('Notification permission denied.');
      }
    }
  );
}

// Function to stop reminders
function stopReminders() {
  chrome.alarms.clearAll();
  remindersRunning = false; // Set the flag to indicate reminders are not running
  updateBrowserActionBadge(remindersRunning); // Update the browser action badge
}

// Function to check if reminders are running
function checkRemindersStatus() {
  chrome.alarms.getAll((alarms) => {
    remindersRunning = alarms.length > 0;
    updateBrowserActionBadge(remindersRunning); // Update the browser action badge
  });
}

// Function to get the next reminder times
function getNextReminders(sendResponse) {
  const nextReminders = {
    hydrationTime: null,
    postureTime: null,
    eyeTime: null,
  };

  chrome.alarms.getAll((alarms) => {
    if (alarms.length > 0) {
      alarms.forEach((alarm) => {
        const reminderType = alarm.name.replace('Alarm', '');
        const nextReminderTime = alarm.scheduledTime;

        switch (reminderType) {
          case 'hydration':
            nextReminders.hydrationTime = nextReminderTime;
            break;
          case 'posture':
            nextReminders.postureTime = nextReminderTime;
            break;
          case 'eye':
            nextReminders.eyeTime = nextReminderTime;
            break;
          default:
            break;
        }
      });
    } else {
      // No alarms set, initialize next reminder times based on current time and intervals
      const intervals = getIntervals();
      const now = new Date().getTime();
      nextReminders.hydrationTime = now + intervals.hydration * 60000;
      nextReminders.postureTime = now + intervals.posture * 60000;
      nextReminders.eyeTime = now + intervals.eye * 60000;
    }
    console.log('nextReminders:', nextReminders);
    sendResponse({ nextReminders });
  });
}
// Call checkRemindersStatus when the extension is first loaded or installed
checkRemindersStatus();

// Alarm listener to handle reminders
chrome.alarms.onAlarm.addListener((alarm) => {
  const reminderType = alarm.name.replace('Alarm', '');
  createReminder(reminderType);
});

// Message listener to handle requests from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    switch (request.action) {
      case 'startReminders':
        startReminders(request.selectedReminders, request.intervals);
        sendResponse({ success: true });
        break;
      case 'stopReminders':
        stopReminders();
        sendResponse({ success: true });
        break;
      case 'getRemindersStatus':
        sendResponse({ remindersRunning });
        break;
      case 'getNextReminders':
        getNextReminders(sendResponse); // Call getNextReminders with sendResponse
        break;
      default:
        sendResponse({ success: false });
        break;
    }
  } catch (error) {
    console.error('Error handling message from popup.js:', error);
    sendResponse({ success: false });
  }
  return true; // This is important for async messaging
});

// Listen for extension startup or reactivation
chrome.runtime.onStartup.addListener(() => {
  checkRemindersStatus();
});

chrome.runtime.onInstalled.addListener(() => {
  checkRemindersStatus();
});