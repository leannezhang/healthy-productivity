"use strict";

let alarmName = "focusAlarm";
let badgeText;
let timerStarted;
let startTime;

let focusTimeRemainingMin;
let focusTimeDurationSec;
let $focusTimeRemainingDiv = document.getElementById("focusTimeRemaining");

let breakTimeRemainingMin;
let breakTimeDuration;
let $breakTimeRemainingDiv = document.getElementById("breakTimeRemaining");

let activityCategory;
let activityLst;

let view;
let showView;
let hideView;

let timerId;

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

function secondsToMinuteAndSecondsFormat(seconds) {
    let remainingMinute = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
    if (remainingMinute > 0 && remainingSeconds > 0) {
      return remainingMinute + " m " +  remainingSeconds + " s";
    } else if (remainingMinute > 0 && remainingSeconds == 0) {
      return remainingMinute + " m"
    } else {
      return remainingSeconds + " s";
    }
}

function resetFocusTimerView() {
  chrome.storage.sync.get(["focusTime"], function(result) {
    focusTimeDurationSec = parseInt(result.focusTime) * 60;
    $focusTimeRemainingDiv.textContent = secondsToMinuteAndSecondsFormat(focusTimeDurationSec)
  });
}

function resetBreakTimeView() {
  chrome.storage.sync.get(["breakTime"], function(result) {
    breakTimeDuration = parseInt(result.breakTime) * 60;
    breakTimeRemainingMin = breakTimeDuration;
    $breakTimeRemainingDiv.textContent = breakTimeRemainingMin + " sec(s)";
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
    let timeDiffInMillSecs = startTime + focusTimeDurationSec * 1000 - Date.now();
    let focusTimeRemainingSec = Math.ceil(timeDiffInMillSecs / 1000);
    focusTimeRemainingMin = Math.ceil(focusTimeDurationSec / 60);
    let focusTimeMinAndSec = secondsToMinuteAndSecondsFormat(focusTimeRemainingSec);
    $focusTimeRemainingDiv.textContent = focusTimeMinAndSec;
    chrome.browserAction.setBadgeText({
      text: focusTimeMinAndSec.toString()
    });

    if (focusTimeRemainingSec <= 0) {
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
      chrome.storage.sync.get(["exerciseURL"], function(result) {
        if (result) {
          console.log("Exercise result found: " + result);
          window.open(result.exerciseURL);
        }
      });
    }
  });
}

function countDownBreakTimer() {
  chrome.storage.sync.get(["startTime"], function(result) {
    startTime = result.startTime;
    // 60,000 is to convert mins to millsecs
    let timeDiffInMillSecs = startTime + breakTimeDuration * 1000 - Date.now();
    let breakTimeRemainingSec = Math.ceil(timeDiffInMillSecs / 1000);
    breakTimeRemainingMin = Math.ceil(breakTimeRemainingSec / 60);
    let breakTimeRemainingMinAndSec = secondsToMinuteAndSecondsFormat(breakTimeRemainingSec);
    $breakTimeRemainingDiv.textContent = breakTimeRemainingMinAndSec;
    chrome.browserAction.setBadgeText({
      text: breakTimeRemainingMinAndSec.toString()
    });
  });
}

function setAlarm(event) {
  alarmName = event.target.name;
  if (alarmName === "focusAlarm") {
    chrome.storage.sync.set({ timerStarted: true, startTime: Date.now() });
    console.log("creating focus alarm"  )
    chrome.alarms.create(alarmName, { delayInMinutes: focusTimeRemainingMin });
    badgeText = focusTimeRemainingMin + "m";
    chrome.runtime.sendMessage("", {
      type: "notification",
      options: {
        title: "Time to focus",
        message:
          "Time to focus now. You will get a notification when its time for your break!",
        iconUrl: "src/images/get_started128.png",
        type: "basic"
      }
    });
  } else {
    chrome.storage.sync.set({ timerStarted: true, startTime: Date.now() });
    console.log("creating break alarm"  )
    chrome.alarms.create(alarmName, { delayInMinutes: breakTimeRemainingMin });
    badgeText = breakTimeRemainingMin + "m";
    chrome.runtime.sendMessage("", {
      type: "notification",
      options: {
        title: "Time for a break",
        message:
          "Time to a break now. You will get a notification when the break is up.",
        iconUrl: "src/images/get_started128.png",
        type: "basic"
      }
    });
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
timerId = setInterval(countDown, 1000);
//An Alarm delay of less than the minimum 1 minute will fire
// in approximately 1 minute incriments if released

function addEventListenerIfButtonExists(buttonId, event) {
  var button = document
    .getElementById(buttonId)
  if (button){
    button.addEventListener("click", event)
  }
}
addEventListenerIfButtonExists("startFocusTimerButton", setAlarm)
addEventListenerIfButtonExists("stopFocusTimerButton", clearAlarm)
addEventListenerIfButtonExists("startBreakTimerButton", setAlarm)
addEventListenerIfButtonExists("stopBreakTimerButton", clearAlarm)
