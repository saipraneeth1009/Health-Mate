// Constants for default intervals (in minutes)
const DEFAULT_HYDRATION_INTERVAL = 60;
const DEFAULT_POSTURE_INTERVAL = 45;
const DEFAULT_EYE_INTERVAL = 30;
const MIN_INTERVAL = 5; // Minimum allowed interval in minutes
const MAX_INTERVAL = 480; // Maximum allowed interval in minutes (8 hours)

// Function to validate interval input
function validateInterval(value) {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue) || parsedValue < MIN_INTERVAL || parsedValue > MAX_INTERVAL) {
    return false;
  }
  return true;
}

// Function to load custom intervals from local storage
function loadIntervals() {
  const storedIntervals = JSON.parse(localStorage.getItem('intervals'));
  if (storedIntervals) {
    document.getElementById('hydrateInterval').value = storedIntervals.hydration;
    document.getElementById('postureInterval').value = storedIntervals.posture;
    document.getElementById('eyeInterval').value = storedIntervals.eye;
  } else {
    document.getElementById('hydrateInterval').value = DEFAULT_HYDRATION_INTERVAL;
    document.getElementById('postureInterval').value = DEFAULT_POSTURE_INTERVAL;
    document.getElementById('eyeInterval').value = DEFAULT_EYE_INTERVAL;
  }
}

// Function to save custom intervals
function saveIntervals() {
  const hydrateInterval = document.getElementById('hydrateInterval').value;
  const postureInterval = document.getElementById('postureInterval').value;
  const eyeInterval = document.getElementById('eyeInterval').value;

  // Validate input values
  if (
    validateInterval(hydrateInterval) &&
    validateInterval(postureInterval) &&
    validateInterval(eyeInterval)
  ) {
    const intervals = {
      hydration: hydrateInterval || DEFAULT_HYDRATION_INTERVAL,
      posture: postureInterval || DEFAULT_POSTURE_INTERVAL,
      eye: eyeInterval || DEFAULT_EYE_INTERVAL,
    };
    localStorage.setItem('intervals', JSON.stringify(intervals));
    alert('Settings saved!');
  } else {
    alert('Please enter valid interval values between 5 and 480 minutes.');
  }
}

// Function to reset intervals to default values
function resetToDefault() {
  const defaultIntervals = {
    hydration: DEFAULT_HYDRATION_INTERVAL,
    posture: DEFAULT_POSTURE_INTERVAL,
    eye: DEFAULT_EYE_INTERVAL,
  };

  try {
    localStorage.setItem('intervals', JSON.stringify(defaultIntervals));
    document.getElementById('hydrateInterval').value = DEFAULT_HYDRATION_INTERVAL;
    document.getElementById('postureInterval').value = DEFAULT_POSTURE_INTERVAL;
    document.getElementById('eyeInterval').value = DEFAULT_EYE_INTERVAL;
    alert('Interval settings reset to default values.');
  } catch (error) {
    console.error('Error resetting intervals to default:', error);
    alert('Failed to reset interval settings to default values.');
  }
}

// Load custom intervals on page load
window.addEventListener('load', loadIntervals);

// Event listener for Save Settings button
document.getElementById('saveBtn').addEventListener('click', saveIntervals);

// Event listener for Reset to Default button
document.getElementById('resetToDefaultBtn').addEventListener('click', resetToDefault);