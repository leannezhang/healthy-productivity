"use strict";
let $focusTimeRemainingDiv = document.getElementById("focusTimeRemaining");
let $breakTimeRemainingDiv = document.getElementById("breakTimeRemaining");

//let view;
let showView;
let hideView;

let bg
chrome.runtime.getBackgroundPage(function (backgroundPage) {
  console.log(`Got bg ${backgroundPage}`);
  bg = backgroundPage;
  init()
})

/***************************************************************** */
// functions to update Popup views
// set default as soon as possible so that user don't notice the view changes
changePopUpViewToFocusTime();

function changePopUpViewToFocusTime() {
    hideView = document.getElementById("breakTimeDiv");
    hideView.classList.add("hide");
    showView = document.getElementById("focusTimeDiv");
    showView.classList.remove("hide");
}

function changePopUpViewToBreakTime() {
    showView = document.getElementById("breakTimeDiv");
    showView.classList.remove("hide");
    hideView = document.getElementById("focusTimeDiv");
    hideView.classList.add("hide");
}

function changeView(view) {
  console.log("Changing view to " ,view)
  if (view === bg.inFocusView) {
    changePopUpViewToFocusTime()
  } else {
    changePopUpViewToBreakTime()
  }
}
// functions to update Popup views ends
/***************************************************************** */

/***************************************************************** */
// functions for managing timers in background
function initTimers() {
  // propagate timer durations to background
  chrome.storage.sync.get(["focusTime"], function(result) {
    let duration_ms = result.focusTime * 60 * 1000
    bg.focusTimeInitialDurationMs = duration_ms
  });
  chrome.storage.sync.get(["breakTime"], function(result) {
    let duration_ms = result.breakTime * 60 * 1000
    bg.breakTimeInitialDurationMs = duration_ms
  });

  // init timer depending on viewState
  if ((bg.viewState === bg.inFocusView) && (bg.timerState === bg.unInit) ) {
    console.log('setting focus alarm');
    bg.initFocusTimer();
  }
  if ((bg.viewState === bg.inBreakView) && (bg.timerState === bg.unInit) ) {
    console.log('setting break alarm');
    bg.initBreakTimer();
  }
};

function initView() {
  console.log('setting view to focus');
  if (bg.viewState === bg.unInitView) {
    bg.viewState = bg.inFocusView
  }
};

// init everything in foreground
// and update default values in background
function init() {
  console.log('running init')
  initView();
  console.log('finished init view')
  initTimers();
  console.log('finished init timer')
}

function startFocusTimer(event) {
  console.log('starting focus alarm');
  initTimers();
  bg.startTimer();
  bg.changeNotificationStage(bg.toFocusView);
  bg.viewState = bg.inFocusView;
}

function stopFocusTimer(event) {
  bg.initBreakTimer();
  console.log('stopping focus alarm and changing to break view', bg.viewState);
  bg.viewState = bg.inBreakView;
}

function startBreakTimer(event) {
  console.log('starting break alarm');
  initTimers();
  bg.startTimer();
  bg.changeNotificationStage(bg.toBreakView);
  bg.viewState = bg.inBreakView;
}

function stopBreakTimer(event) { console.log('stopping break alarm');
  // bg.resetTimer()
  bg.initFocusTimer();
  console.log('stopping break alarm and changing to focus view', bg.viewState);
  bg.viewState = bg.inFocusView;
}
/***************************************************************** */


// listen for update signal from background
chrome.runtime.onMessage.addListener((message, sender, sendReponse) => {
  if (message.type === bg.updatePopupTextSignal) {
    // from background
    if (message.viewState === bg.inFocusView){
      $focusTimeRemainingDiv.textContent = message.value;
    } else if (message.viewState === bg.inBreakView) {
      $breakTimeRemainingDiv.textContent = message.value;
    } else {
      console.log("Popup update initiated, but no view state matched", message.viewState);
    }
  } else if (message.type === bg.updatePopupViewSignal) {
    // from background
    console.log("Changeview signal received", message );
    changeView(message.view)
  } else if (message.type === bg.timesupSignal) {
    // from background
    console.log("Times up signal received", message );
    if (message.nextViewState === bg.inFocusView){
      bg.initFocusTimer()
    } else if (message.nextViewState === bg.inBreakView) {
      bg.initBreakTimer()
    } else {
      console.log("Times up signal initiated, but no view state matched", message.nextViewState);
    }
  } else {
    console.log("Popup: Caught unmatched message", message)
  }
});


function addEventListenerIfButtonExists(buttonId, event) {
  var button = document
    .getElementById(buttonId)
  if (button){
    button.addEventListener("click", event)
  }
}
addEventListenerIfButtonExists("startFocusTimerButton", startFocusTimer)
addEventListenerIfButtonExists("stopFocusTimerButton", stopFocusTimer)
addEventListenerIfButtonExists("startBreakTimerButton", startBreakTimer)
addEventListenerIfButtonExists("stopBreakTimerButton", stopBreakTimer)