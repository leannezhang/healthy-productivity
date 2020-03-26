"use strict";

chrome.runtime.onMessage.addListener((message, sender, sendReponse) => {
  if (message.type === "notification") {
    chrome.notifications.create(message.options);
  }
});

chrome.alarms.onAlarm.addListener(function(alarms) {
  // When the focus alarm times up
  if (alarms.name === "focusAlarm") {
    chrome.notifications.create({
      title: "Time for a break",
      message: "It's time for a relaxing break. Pick your selected interest",
      iconUrl: "src/images/get_started128.png",
      type: "basic"
    });
    // When the break alarm times up
  } else {
    chrome.notifications.create({
      title: "Break is over",
      message: "Break is over. Time to focus now! Click on the timer to start.",
      iconUrl: "src/images/get_started128.png",
      type: "basic"
    });
  }
  chrome.browserAction.setBadgeText({ text: "" });
});
