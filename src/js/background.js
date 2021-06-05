"use strict";

var toBreakView = 'toBreakView'
var exitingBreakView = 'exitingBreakView'
var toFocusView = 'toFocusView'
var exitingFocusView = 'exitingFocusView'


console.log("evaluating background")
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

function setFocusTimeAlarm() {
  chrome.storage.sync.set({ timerStarted: true, startTime: Date.now() });
  chrome.alarms.create(alarmName, { delayInMinutes: focusTimeRemaining });
  badgeText = focusTimeRemaining + "m";
  console.log(`bg is ${backgroundPage}`)
  console.log(`bg value is ${backgroundPage.toBreakView}`)
  backgroundPage.changeNotificationStage(backgroundPage.toFocusView)
};
// function setBreakTimeAlarm();

// Listening incoming messages from content scripts like options.js and popup.js
chrome.runtime.onMessage.addListener((message, sender, sendReponse) => {
  if (message.type === "notification") {
    chrome.notifications.create(message.options);
  } else if (message.exceriseURL) {
    exerciseURL= message.exceriseURL;
    console.log("exceriseURL is",exerciseURL)
  } else if (message.timerInitialDurationMin) {
    initialDurationMs = message.timerInitialDurationMin;
    console.log("timer init duration received")
    if (timerState != running){
      console.log("Setting badge")
      remainingMs = initialDurationMs * 60 * 1000 ;
      chrome.browserAction.setBadgeText({text: displayRemainingTime(remainingMs)})
    } else {
      console.log("Timer is running, not updating badge text")
    }
  } else {
    console.log("Caught unmatched message", message)

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


// timer meta
// could be one of
// running || paused || stopped 
let timerState;
let running = 'running'
let paused = 'paused'
let stopped = 'stopped'

let startTime;
let remainingMs = 0;
let initialDurationMs = 0;
//timer functions
function getTimerTime() {
  return currentTime
};

//function getCurrentSystemTime(){
//  const now = new Date()  
//  return now.getTime()
//}

function initTimer(timer_duration_ms) {
  initialDurationMs = timer_duration_ms;
  remainingMs = timer_duration_ms;
  timerState = stopped;
}

function startTimer(timer_duration_ms) {
  // startTime = getCurrentSystemTime();
  console.log(`starting timer with duration ${timer_duration_ms}`)
  remainingMs = timer_duration_ms
  timerState = running;
};

function resetTimer() {
  console.log("stopped timer")
  timerState = stopped;
  remainingMs = initialDurationMs;
};

//function pauseTimer() {
//  timerState = paused
//};
//function resumeTimer() {
//  timerState = running
//};

function displayRemainingTime(duration_ms) {
  if (duration_ms === 0) {
    return '0s'
  }
  let duration = duration_ms / 1000;
  console.log(`pretty print remaining time ${duration} in seconds`)
  let displayTime;
  if (duration < 60) {
    displayTime =  duration.toString() + "s"
    console.log(`duration is less than 60, returing ${displayTime}`)
    return displayTime
  } else {
    let minutes = Math.floor(duration / 60);
    let seconds = duration % 60;
    if (seconds == 0) {
      displayTime = minutes.toString() + "m";
      console.log(`duration is on 60, returing ${displayTime}`)
      return displayTime
    }
    // badget supports max character 4. but we can sneak in a colon here
    displayTime = minutes.toString() + ":" + seconds.toString();
    console.log(`duration is over 60, returing ${displayTime}`)
    return  displayTime
  }
}

let interval_ms = 1000
setInterval(function () {
  console.log("counting down")
  switch (timerState) {
    case running:
        remainingMs -= interval_ms
        console.log("Timer is running state, counting down")
        if (remainingMs <= 0) {
          console.log("time is up")
          timerState = stopped
        }
        break;
    case stopped:
        console.log("Timer is stopped");
        break;
  }
  let remainingTime = displayRemainingTime(remainingMs);
  chrome.browserAction.setBadgeText({ text: remainingTime.toString() });
}, interval_ms);
