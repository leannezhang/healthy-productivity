"use strict";

let alarmName = "focusAlarm";
let screen = "focusTimeDiv";

let focusTimeRemaining;
let breakTimeRemaining;
let activityCategory;
let activityLst;

chrome.storage.sync.get(["focusTime"], function(result) {
  focusTimeRemaining = parseInt(result.focusTime);
  document.getElementById("focusTimeRemaining").innerHTML =
    focusTimeRemaining + " mins";
});

chrome.storage.sync.get(["breakTime"], function(result) {
  breakTimeRemaining = parseInt(result.breakTime);
  document.getElementById("breakTimeRemaining").innerHTML =
    breakTimeRemaining + " mins";
});

chrome.storage.sync.get(["activityCategory"], function(result) {
  activityCategory = result.activityCategory;
  console.log("Selected activity is " + activityCategory);
});

chrome.storage.sync.get(["activityLst"], function(result) {
  activityLst = result.activityLst;
  console.log("Provided activity list is " + activityLst);
});

function setAlarm(event) {
  alarmName = event.target.name;
  let badgeText;
  if (alarmName === "focusAlarm") {
    chrome.alarms.create(alarmName, { delayInMinutes: focusTimeRemaining });
    badgeText = focusTimeRemaining + "m";
  } else {
    chrome.alarms.create(alarmName, { delayInMinutes: breakTimeRemaining });
    badgeText = breakTimeRemaining + "m";
  }
  chrome.browserAction.setBadgeText({ text: badgeText });
  chrome.runtime.sendMessage('', {
    type: 'notification',
    options: {
      title: 'Time to focus',
      message: 'Time to focus now. You will get a notification when its time for your break!',
      iconUrl: 'src/images/get_started128.png',
      type: 'basic'
    }
  });
  window.close();
}

function clearAlarm() {
  chrome.browserAction.setBadgeText({ text: "" });
  chrome.alarms.clearAll();
  toggleFocusScreen();
}

// Fix me
function toggleFocusScreen() {
  let screenDiv = document.getElementById(screen);
  screenDiv.classList.add("hide");
  let showScreenDiv = document.getElementById("breakTimeDiv");
  showScreenDiv.classList.remove("hide");
}

//An Alarm delay of less than the minimum 1 minute will fire
// in approximately 1 minute incriments if released
document
  .getElementById("startFocusTimerButton")
  .addEventListener("click", setAlarm);
document
  .getElementById("stopFocusTimerButton")
  .addEventListener("click", clearAlarm);

document
  .getElementById("startBreakTimerButton")
  .addEventListener("click", setAlarm);
document
  .getElementById("stopBreakTimerButton")
  .addEventListener("click", clearAlarm);
