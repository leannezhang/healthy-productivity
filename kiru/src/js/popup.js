"use strict";

let alarmName = "focusAlarm";
let screen = "focusTimeDiv";

let focusTimeRemaining;
let breakTimeRemaining;
let activityCategory;
let activityLst;
let view;

chrome.storage.sync.get(["view"], function(result) {
  view = result.view;
  alert(view);
});

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
    screen = "focusTimeDiv";
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
    screen = "breakTimeDiv";
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
  window.close();
}

function clearAlarm() {
  chrome.browserAction.setBadgeText({ text: "" });
  chrome.alarms.clearAll();
}

// Fix me
function toggleFocusScreen() {
  alert("im here");
  let screenDiv = document.getElementById(screen);
  screenDiv.classList.add("hide");
  let showScreenDiv;
  if (screenDiv === "focusTimeDiv") {
    showScreenDiv = document.getElementById("breakTimeDiv");
  } else {
    showScreenDiv = document.getElementById("focusTimeDiv");
  }
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

document
  .getElementById("switchView")
  .addEventListener("click", toggleFocusScreen);
