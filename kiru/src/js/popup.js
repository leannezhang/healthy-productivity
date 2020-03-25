// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
"use strict";

let alarmName = "focusAlarm";
let screen = "focusTimeDiv";

function setAlarm(event) {
  let minutes = parseFloat(event.target.value);
  alarmName = event.target.name;
  chrome.alarms.create(alarmName, { delayInMinutes: minutes });
  let badgeText = minutes.toString() + "m";
  chrome.browserAction.setBadgeText({ text: badgeText });
  chrome.storage.sync.set({ minutes: minutes });
  window.close();
}

function clearAlarm() {
  chrome.browserAction.setBadgeText({ text: "" });
  chrome.alarms.clearAll();
  toggleFocusScreen();
}

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
