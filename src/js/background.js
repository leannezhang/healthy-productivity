"use strict";

// Initialized default timers
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({
    view: "focusView",
    breakTime: 5,
    focusTime: 30,
    // Can combine timerStarted and startTime into one variable
    timerStarted: false,
    startTime: 0
  });
});

let exerciseURL = '';

// Listening incoming messages from content scripts like options.js and popup.js
chrome.runtime.onMessage.addListener((message, sender, sendReponse) => {
  if (message.type === "notification") {
    chrome.notifications.create(message.options);
  } else if (message.exceriseURL) {
    exerciseURL= message.exceriseURL;
    console.log("exceriseURL is",exerciseURL)
  }
});

chrome.alarms.onAlarm.addListener(function(alarms) {
  // When the focus alarm times up
  if (alarms.name === "focusAlarm") {
    // seems like when the windows is not closed, the notification bar would not appear
    chrome.storage.sync.set(
      { view: "breakView", timerStarted: false, startTime: 0 },
      function() {
        console.log("The view is breakView");
      }
    );
    chrome.notifications.create({
      title: "Time for a break",
      message:
        "It's time for a relaxing break.",
      iconUrl: "src/images/get_started128.png",
      type: "basic"
    });
    // Open the recommneded exercise in the new window
    window.open(exerciseURL)
  // When the break alarm times up
  } else {
    chrome.storage.sync.set(
      { view: "focusView", timerStarted: false, startTime: 0 },
      function() {
        console.log("The view id focusView");
      }
    );
    chrome.notifications.create({
      title: "Break is over",
      message: "Break is over. Time to focus now! Click on the timer to start.",
      iconUrl: "src/images/get_started128.png",
      type: "basic"
    });
  }
  chrome.browserAction.setBadgeText({ text: "" });
});
