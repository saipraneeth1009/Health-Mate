# Health Mate

Health Mate is a browser extension that provides reminders to help users stay hydrated, maintain good posture, and take breaks for eye care. The extension is built using HTML, CSS, and JavaScript, and it utilizes various Chrome APIs such as `alarms`, `notifications`, and `storage`.

## Features

- **Hydration Reminder**: Get reminders to drink water at regular intervals.
- **Posture Alert**: Receive reminders to check and correct your posture.
- **Eye Care Prompt**: Take breaks and rest your eyes with periodic reminders.
- **Customizable Intervals**: Set your preferred intervals for each reminder type.
- **Start/Stop All Reminders**: Easily start or stop all reminders with a single click.
- **Visual Timers**: See the time remaining until the next reminder for each type.
- **Browser Action Badge**: The browser action badge indicates whether reminders are running or not.

## Installation

1. Download or clone the repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" by toggling the switch in the top-right corner.
4. Click "Load unpacked" and select the folder containing the extension files.

## Usage

1. After installing the extension, click the extension icon in the Chrome toolbar to open the popup.
2. Click the "Start All Reminders" button to enable all three reminder types (hydration, posture, and eye care).
3. The timers on the popup will display the time remaining until the next reminder for each type.
4. When a reminder is triggered, a notification will appear to remind you to take the appropriate action.
5. To stop all reminders, click the "Stop All Reminders" button in the popup.
6. To customize the reminder intervals, click the "Customize Your Settings" link in the popup, enter your desired intervals (in minutes), and click "Save Settings".
7. You can reset the intervals to their default values by clicking the "Reset to Default" button on the customization page.

## Files

- `manifest.json`: The extension manifest file containing metadata and configurations.
- `popup.html`: The HTML structure for the extension's popup user interface.
- `customize.html`: The HTML structure for the customization page.
- `popup.css`: The CSS file for styling the popup and customization pages.
- `popup.js`: The JavaScript file for managing the popup behavior and communication with the background script.
- `customize.js`: The JavaScript file for handling the customization page logic.
- `background.js`: The background script that manages the reminders, alarms, and notifications.

## Contributing

Contributions to improve the Health Mate extension are welcome and should be made via pull requests. If you find any issues or have suggestions for new features, please submit a pull request with your proposed changes.
