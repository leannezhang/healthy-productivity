let domFocusTime = document.getElementsByName("focus-time");
let domBreakTime = document.getElementsByName("break-time");

function setEventListeners() {
  document.getElementById("options-form").addEventListener("submit", e => {
    e.preventDefault();
    saveOptions();
  });

  document.getElementById("reset-options").addEventListener("click", () => {
    resetDefaults();
  });

  document.getElementById('fitness').addEventListener("click", e => {
    var div = document.getElementById('fitness-activities');
    toggleDivDisplay(div);
  });

  document.getElementById('meditation').addEventListener("click", e => {
    var div = document.getElementById('meditation-activities');
    toggleDivDisplay(div);
  });

  document.getElementById('stretching').addEventListener("click", e => {
    var div = document.getElementById('stretching-activities');
    toggleDivDisplay(div);
  });
}

function toggleDivDisplay(div) {
  if (div.style.display === 'none') {
    div.style.display = 'block';
  } else {
    div.style.display = 'none';
  }
}

function resetDefaults() {
  document.getElementById("one-hr").checked = true;
  document.getElementById("10-mins").checked = true;
  document.getElementById("fitness").checked = false;
  document.getElementById("meditation").checked = false;
  document.getElementById("stretching").checked = false;
  document.getElementById('fitness-activities').style.display = 'none';
  document.getElementById('meditation-activities').style.display = 'none';
  document.getElementById('stretching-activities').style.display = 'none';
}

function saveOptions() {

  const focusTime = getCheckedValue(domFocusTime);
  chrome.storage.sync.set({focusTime: focusTime}, function() {
   console.log('focusTime is ' + focusTime);
  });

  const breakTime = getCheckedValue(domBreakTime);
  chrome.storage.sync.set({breakTime: breakTime}, function() {
   console.log('breakTime is ' + breakTime);
  });

  //Need to store fav activities

}

function getCheckedValue(radioElement) {
  for(var i = 0; i < radioElement.length; i++){
    if(radioElement[i].checked){
      return radioElement[i].value
    }
  }
}

setEventListeners();
