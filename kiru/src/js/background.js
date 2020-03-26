// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

//chrome.alarms.onAlarm.addListener(function() {
//  chrome.browserAction.setBadgeText({ text: "" });
//  chrome.notifications.create({
//    type: "basic",
//    iconUrl: "stay_focused.png",
//    title: "Time to focus",
//    message: "Time to focus",
//    buttons: [{ title: "Keep calm and carry on" }],
//    priority: 0
//  });
//});
//
//chrome.notifications.onButtonClicked.addListener(function() {
//  chrome.storage.sync.get(["minutes"], function(item) {
//    chrome.browserAction.setBadgeText({ text: "ON" });
//    chrome.alarms.create({ delayInMinutes: item.minutes });
//  });
//});

chrome.runtime.onMessage.addListener(data => {
  console.log("invoked notification")
  if (data.type === 'notification') {
    console.log("creating notification")
//    chrome.notifications.create(data.options);
    chrome.notifications.create({
      type: "basic",
      iconUrl: "src/images/get_started128.png",
      title: "Time to focus",
      message: "Time to focus"
    });
    console.log("created")
  }
});



//// Create a simple text notification:
//var notification = webkitNotifications.createNotification(
//  '',  // icon url - can be relative
//  'Hello!',  // notification title
//  'Test notification...'  // notification body text
//);
//
//// Or create an HTML notification:
//var notification = webkitNotifications.createHTMLNotification(
//  'notification.html'  // html url - can be relative
//);
//
//// Then show the notification.
//notification.show();
