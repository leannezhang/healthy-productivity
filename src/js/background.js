"use strict";

var toBreakView = 'toBreakView'
var exitingBreakView = 'exitingBreakView'
var toFocusView = 'toFocusView'
var exitingFocusView = 'exitingFocusView'


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

function setExerciseURL (url) {
    exerciseURL= url;
    console.log("exceriseURL is",exerciseURL);
}

function changeNotificationStage (type) {
  if (type === toBreakView) {
    chrome.notifications.create({
      title: "Time for a break",
      message:
        "It's time for a relaxing break.",
      iconUrl: "src/images/get_started128.png",
      type: "basic"
    });
  } else if (type === exitingBreakView) {
    chrome.notifications.create({
      title: "Break is over",
      message: "Break is over. Time to focus now! Click on the timer to start.",
      iconUrl: "src/images/get_started128.png",
      type: "basic"
    });
  } else if (type === toFocusView) {
    // toFocusView
    chrome.notifications.create({
      title: "Time to focus",
      message:
        "Time to focus now. You will get a notification when its time for your break!",
      iconUrl: "src/images/get_started128.png",
      type: "basic"
    });
  } else {
    console.log(`Caught unexpected type ${type}`)
  }
}

function setFocustimeAlarm () {
    chrome.storage.sync.set(
      { view: "breakView", timerStarted: false, startTime: 0 },
      function() {
        console.log("The view is breakView");
      }
    );
    toggleNotificationText("toBreakView")
}

function setBreaktimeAlarm() {
    chrome.storage.sync.set(
      { view: "focusView", timerStarted: false, startTime: 0 },
      function() {
        console.log("The view id focusView");
      }
    );
    //chrome.notifications.create({
    //  title: "Break is over",
    //  message: "Break is over. Time to focus now! Click on the timer to start.",
    //  iconUrl: "src/images/get_started128.png",
    //  type: "basic"
    //});
    changeNotificationStage(exitingBreakView)
}

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
    changeNotificationStage(toBreakView)
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
    changeNotificationStage(exitingBreakView)
  }
  chrome.browserAction.setBadgeText({ text: "" });
});

//setInterval(function () {
//  let text = Math.random(100).toString()
//  console.log(`setting badge text to ${text} in background`)
//  chrome.browserAction.setBadgeText({ text: text });
//}, 1000);
