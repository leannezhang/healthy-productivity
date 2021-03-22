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

    var a = document.createElement("a");
    a.setAttribute('href', activityLst);
    var breakActivityDiv = document.getElementById("breakActivityDiv")
    breakActivityDiv.innerHTML = "Link to <b>" + activityCategory + "</b>: <br/> <a href='" + activityLst + "'>" + activityCategory + " Video</a><br/>";
//    breakActivityDiv.appendChild(a);
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

function setAlarm(event) {
  alarmName = event.target.name;
  if (alarmName === "focusAlarm") {
    chrome.storage.sync.set({ timerStarted: true, startTime: Date.now() });
    chrome.alarms.create(alarmName, { delayInMinutes: focusTimeRemaining });
    badgeText = focusTimeRemaining + "m";
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
    chrome.alarms.create(alarmName, { delayInMinutes: breakTimeRemaining });
    badgeText = breakTimeRemaining + "m";
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
function openRecommendedExerciseVideo() {
  chrome.storage.sync.get(["userProfile", "breakTime"], function(result) {
    if (result.userProfile && result.breakTime) {
      const data = { ...result.userProfile, breakTime: result.breakTime } 
      let exercise = runRecommendedService(exercise_data, data)
      window.open(exercise.url)
    } else {
      console.error("Failed to load required data to recommend exercise")
    }
  });
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
// TODO figure out why openRec function is not trigger when clicking 
//addEventListenerIfButtonExists("startFocusTimerButton", setAlarm)
addEventListenerIfButtonExists("startFocusTimerButton", openRecommendedExerciseVideo)
addEventListenerIfButtonExists("stopFocusTimerButton", clearAlarm)
//addEventListenerIfButtonExists("startBreakTimerButton", setAlarm)
addEventListenerIfButtonExists("startBreakTimerButton", openRecommendedExerciseVideo)
addEventListenerIfButtonExists("stopBreakTimerButton", clearAlarm)
