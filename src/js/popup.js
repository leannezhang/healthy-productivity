"use strict";

let alarmName = "focusAlarm";
let badgeText;
let timerStarted;
let startTime;

let focusTimeRemaining;
let focusTimeDuration;
let $focusTimeRemainingDiv = document.getElementById("focusTimeRemaining");

let breakTimeRemaining;
let breakTimeDuration;
let $breakTimeRemainingDiv = document.getElementById("breakTimeRemaining");

let activityCategory;
let activityLst;

let view;
let showView;
let hideView;

let timerId;

let backgroundPage
chrome.runtime.getBackgroundPage(function (bg) {
  console.log(`Got bg ${bg}`);
  backgroundPage = bg;
})

chrome.storage.sync.get(["timerStarted"], function(result) {
  timerStarted = result.timerStarted;
});

chrome.storage.sync.get(["startTime"], function(result) {
  startTime = result.startTime;
});

chrome.storage.sync.get(["view"], function(result) {
  view = result.view;
  if (view === "focusView") {
    hideView = document.getElementById("breakTimeDiv");
    hideView.classList.add("hide");
    showView = document.getElementById("focusTimeDiv");
    showView.classList.remove("hide");
  } else {
    showView = document.getElementById("breakTimeDiv");
    showView.classList.remove("hide");
    hideView = document.getElementById("focusTimeDiv");
    hideView.classList.add("hide");
  }
});

resetFocusTimerView();
resetBreakTimeView();

function resetFocusTimerView() {
  chrome.storage.sync.get(["focusTime"], function(result) {
    focusTimeDuration = parseInt(result.focusTime);
    focusTimeRemaining = focusTimeDuration;
    $focusTimeRemainingDiv.textContent = focusTimeRemaining + " min(s)";
  });
}

function resetBreakTimeView() {
  chrome.storage.sync.get(["breakTime"], function(result) {
    breakTimeDuration = parseInt(result.breakTime);
    breakTimeRemaining = breakTimeDuration;
    $breakTimeRemainingDiv.textContent = breakTimeRemaining + " min(s)";
  });
}

function countDown() {
  chrome.storage.sync.get(["timerStarted"], function(result) {
    timerStarted = result.timerStarted;
    if (timerStarted && view === "focusView") {
      countDownFocusTimer();
    } else if (timerStarted && view === "breakView") {
      countDownBreakTimer();
    }
  });
}

function countDownFocusTimer() {
  chrome.storage.sync.get(["startTime"], function(result) {
    startTime = result.startTime;
    // 60,000 is to convert mins to millsecs
    let timeDiffInMillSecs = startTime + focusTimeDuration * 60000 - Date.now();
    focusTimeRemaining = Math.ceil(timeDiffInMillSecs / 60000);
    $focusTimeRemainingDiv.textContent = focusTimeRemaining + " min(s)";
    chrome.browserAction.setBadgeText({
      text: focusTimeRemaining.toString()
    });
  });
}

function countDownBreakTimer() {
  chrome.storage.sync.get(["startTime"], function(result) {
    startTime = result.startTime;
    // 60,000 is to convert mins to millsecs
    let timeDiffInMillSecs = startTime + breakTimeDuration * 60000 - Date.now();
    breakTimeRemaining = Math.ceil(timeDiffInMillSecs / 60000);
    $breakTimeRemainingDiv.textContent = breakTimeRemaining + " min(s)";
    chrome.browserAction.setBadgeText({
      text: breakTimeRemaining.toString()
    });
  });
}

function startFocusTimer(event) {
  console.log('starting focus alarm');
  chrome.storage.sync.get(["focusTime"], function(result) {
    let duration_ms = result.focusTime * 60 * 1000
    backgroundPage.startTimer(duration_ms)
  });
  backgroundPage.changeNotificationStage(backgroundPage.toFocusView);
}
function setAlarm(event) {
  console.log('setting alarm')
  alarmName = event.target.name;
  if (alarmName === "focusAlarm") {
    chrome.storage.sync.set({ timerStarted: true, startTime: Date.now() });
    chrome.alarms.create(alarmName, { delayInMinutes: focusTimeRemaining });
    badgeText = focusTimeRemaining + "m";
    backgroundPage.changeNotificationStage(backgroundPage.toFocusView)
  } else {
    chrome.storage.sync.set({ timerStarted: true, startTime: Date.now() });
    chrome.alarms.create(alarmName, { delayInMinutes: breakTimeRemaining });
    badgeText = breakTimeRemaining + "m";
    console.log(`bg is ${backgroundPage}`)
    console.log(`bg value is ${backgroundPage.toBreakView}`)
    backgroundPage.changeNotificationStage(backgroundPage.toBreakView)
  }
  chrome.browserAction.setBadgeText({ text: badgeText });
  // window.close();
}

function clearAlarm() {
  chrome.alarms.clearAll();
  chrome.storage.sync.set({ timerStarted: false });
  chrome.browserAction.setBadgeText({ text: "" });
  if (view === "focusView") {
    resetFocusTimerView();
  } else {
    resetBreakTimeView();
  }
  clearInterval(timerId);
}

// Display timer in an interval
// timerId = setInterval(countDown, 1000);
//An Alarm delay of less than the minimum 1 minute will fire
// in approximately 1 minute incriments if released

function addEventListenerIfButtonExists(buttonId, event) {
  var button = document
    .getElementById(buttonId)
  if (button){
    button.addEventListener("click", event)
  }
}
addEventListenerIfButtonExists("startFocusTimerButton", startFocusTimer)
addEventListenerIfButtonExists("stopFocusTimerButton", clearAlarm)
addEventListenerIfButtonExists("startBreakTimerButton", setAlarm)
addEventListenerIfButtonExists("stopBreakTimerButton", clearAlarm)
