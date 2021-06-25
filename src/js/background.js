"use strict";
// Public constants
var toBreakView = 'toBreakView'
var exitingBreakView = 'exitingBreakView'
var toFocusView = 'toFocusView'
var exitingFocusView = 'exitingFocusView'
var updatePopupTextSignal = 'updatePopupTextSignal';
var updatePopupViewSignal = 'updatePopupViewSignal';
var timesupSignal = 'timesupSignal';
let exerciseURL = '';


// Listening incoming messages from content scripts like options.js and popup.js
chrome.runtime.onMessage.addListener((message, sender, sendReponse) => {
  if (message.type === "notification") {
    // from popup.js
    chrome.notifications.create(message.options);
  } else if (message.exceriseURL) {
    // from popup.js
    exerciseURL= message.exceriseURL;
    console.log("exceriseURL is",exerciseURL)
  } else if (message.focusTimeInitialDurationMin) {
    // from option.js
    focusTimeInitialDurationMs = message.focusTimeInitialDurationMin * 60 * 1000;
    chrome.storage.sync.set({ focusTimeInitialDurationMs: focusTimeInitialDurationMs }, function () {
	console.log("focusTimeInitialdurationms saved as " + focusTimeInitialDurationMs);
    });
    console.log("focus timer init duration received")
    // if user changes duration in option, we should reflect 
    // that change and reset timer immediately
    initFocusTimer()
  } else if (message.breakTimeInitialDurationMin) {
    // from option.js
    breakTimeInitialDurationMs = message.breakTimeInitialDurationMin * 60 * 1000;
    chrome.storage.sync.set({ breakTimeInitialDurationMs: breakTimeInitialDurationMs }, function () {
	console.log("breakTimeinitialdurationms saved as " + breakTimeInitialDurationMs);
    });
    console.log("break timer init duration received")
    // if user changes duration in option, we should reflect 
    // that change and reset timer immediately
    initFocusTimer()
  } else {
    console.error("Caught unmatched message", message)
  }
});

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
    chrome.notifications.create({
      title: "Time to focus",
      message:
        "Time to focus now. You will get a notification when its time for your break!",
      iconUrl: "src/images/get_started128.png",
      type: "basic"
    });
  } else {
    console.error(`Caught unexpected type ${type}`)
  }
}


/***************************************************************** */
// Focus/Break Timer API
function initFocusTimer() {
  viewState = inFocusView
  let defaultDurationMs = 30 * 60 * 1000
  chrome.storage.sync.get(["focusTimeInitialDurationMs"], function(result) {
    focusTimeInitialDurationMs = result.focusTimeInitialDurationMs
  })
  console.log("set timer to focus timer with duration ", defaultDurationMs)
  initTimer(defaultDurationMs)
}

function initBreakTimer() {
  viewState = inBreakView
  let defaultDurationMs = 5 * 60 * 1000
  chrome.storage.sync.get(["breakTimeInitialDurationMs"], function(result) {
    console.log("set timer to break timer with duration ", breakTimeInitialDurationMs)
    breakTimeInitialDurationMs = result.breakTimeInitialDurationMs
    initTimer(breakTimeInitialDurationMs)
  })
  console.log("set timer to break timer with duration ", defaultDurationMs)
  initTimer(defaultDurationMs)
}
// Focus/Break Timer API Ends
/***************************************************************** */


/***************************************************************** */
// Timer API

// could be one of
// running || stopped 
var running = 'running'
var stopped = 'stopped'
var unInitialized = 'unInitialized'
var timerState = unInitialized;

var focusTimeInitialDurationMs = -1;
var breakTimeInitialDurationMs = -1;

var unInitializedView = 'unInitializedView';
var inFocusView = 'inFocusView';
var inBreakView = 'inBreakView';
var viewState = unInitializedView;

// this should match the default in option
// as there are no ways to sync the default value from option.html
let _durationMs = -1;
let _remainingMs = _durationMs;


function initTimer(timer_duration_ms) {
  console.log(`init timer with duration ${timer_duration_ms}`)
  _durationMs = timer_duration_ms;
  resetTimer()
}

function startTimer() {
  console.log(`starting timer with duration ${_durationMs}`)
  _remainingMs = _durationMs
  timerState = running;
};

function resetTimer() {
  timerState = stopped;
  _remainingMs = _durationMs;
  console.log("stopped timer, resetting to ", _remainingMs, viewState)
};

function displayRemainingTime(duration_ms, badgeMode=false) {
  if (duration_ms === 0) {
    return '0s'
  }
  let duration = duration_ms / 1000;
  let displayTime;
  if (duration < 60) {
    displayTime =  duration.toString() + "s"
    return displayTime
  } else {
    let minutes = Math.floor(duration / 60);
    let seconds = duration % 60;
    if (seconds == 0) {
      displayTime = minutes.toString() + "m";
      return displayTime
    }
    // badge supports max character 4. but we can sneak in a colon here
    if (badgeMode) {
      displayTime = minutes.toString() + ":" + seconds.toString();
      return displayTime
    }
    displayTime = minutes.toString() + "min(s) " + seconds.toString() + "s";
    return  displayTime
  }
}
// Timer API Ends
/***************************************************************** */

// Background loop that manages various state
// and notify foreground to update
let interval_ms = 1000
// useful for debug if you want to fastward time
let time_coefficient = 1
setInterval(function () {
  console.log("counting down in view", viewState)
  switch (timerState) {
    case running:
      _remainingMs -= interval_ms * time_coefficient
      console.log("Timer is running state, counting down")
      if (_remainingMs <= 0) {
        timerState = stopped
        if (viewState === inFocusView) {
          viewState = inBreakView

          window.open(exerciseURL)
          // TODO
          // we should start the break time automatcially
          // after we open the exercise link
        } else {
          viewState = inFocusView
        }
        chrome.runtime.sendMessage(
          { type: timesupSignal,
            nextViewState: viewState,
            value: displayRemainingTime(_remainingMs).toString()
          }, function (response)  {
            console.log("popup update signal sent");
          }
        )
        console.log("time is up, changing to view ", viewState)
      }
      break;
    case stopped:
      console.log("Timer has stopped");
      console.log("Setting badge")
      _remainingMs = _durationMs;
      chrome.browserAction.setBadgeText({text: displayRemainingTime(_remainingMs)})
      break;
    case unInitialized:
      console.log("Timer is unInitialized");
      break;
    default:
      console.error("Unknown timerState ", timerState);
      break
  }
  chrome.browserAction.setBadgeText({
     text: displayRemainingTime(_remainingMs, true).toString()
  });
  // update popup timer message in foreground
  chrome.runtime.sendMessage(
    { type: updatePopupTextSignal,
      viewState: viewState,
      value: displayRemainingTime(_remainingMs).toString()
    }, function (response)  {
      console.log("popup update signal sent");
    }
  )
  // update popup html view in foreground
  chrome.runtime.sendMessage(
    {
      type: updatePopupViewSignal,
      view: viewState
    }, function (response)  {
      console.log("popup view update signal sent");
    }
  )

}, interval_ms);


// initialize focus timer as default
initFocusTimer()
