function setUserProfileToChromeStorage(userProfileInputs) {
  console.log('setUserProfileToChromeStorage');
  chrome.storage.sync.set({ "userProfile": userProfileInputs }, function () {
    console.log(JSON.stringify(userProfileInputs));
  });
}

function sendRecommendedExerciseToBackgroundJS(userInputs) {
  let exercise = runRecommendedService(exercise_data, {userInputs})
  console.log('sending exercise url', exercise.url);
  chrome.runtime.sendMessage({
    exceriseURL: exercise.url
  }).then(function (response) {
    console.log("exercise url is sent", response)
  })
}

function prepopulatingUIDataFromStorage() {
  /*
    Load UserProfile from chrome storage
    Pre-populate html fields
  */
  let femaleGenderInput = document.querySelector("input[id=gender-female]")
  let maleGenderInput = document.querySelector("input[id=gender-male]")
  let ageInput = document.querySelector("input[id=age-input]")
  let highImpactActivity = document.querySelector("input[id=activity-high-impact]")
  let lowImpactActivity = document.querySelector("input[id=activity-low-impact]")
  let goalInput = document.querySelector("select[id=goal]")

  chrome.storage.sync.get(["userProfile"], function(result) {
    if (result) {
        if (result.profile) {
          const { gender, age, activityImpact, goal } = result.userProfile;
          switch (gender) {
            case 'female': {
              femaleGenderInput.checked = true;
              break;
            }
            case 'male': {
              maleGenderInput.checked = true;
              break;
            }
          }
        
          if (age) {
            ageInput.value = age;
          }
        
          switch (activityImpact) {
            case 'high-impact': {
              highImpactActivity.checked = true;
              break;
            }
            case 'low-impact': {
              lowImpactActivity.checked = true;
              break;
            }
          }

          if (goal) {
            goalInput.value = goal;
          }
      }
    }
  });
  
}

// collect all input and store them
function saveUserProfile() {
  let gender = document.querySelector('input[name=gender]:checked').value
  let age = document.querySelector("input[name=age]").value;
  let activityImpact = document.querySelector('input[name=activity-impact]:checked').value;
  let goal = document.querySelector("select[id=goal]").value
  const userProfileInputs = {
    gender,
    age,
    activityImpact,
    goal
  }
  let breakTime = document.getElementById("break-time").value;
  setUserProfileToChromeStorage(userProfileInputs);
  sendRecommendedExerciseToBackgroundJS({ ...userProfileInputs, breakTime: breakTime});
}

function setEventListeners() {
  document.getElementById("options-form").addEventListener("submit", e => {
    e.preventDefault();
    saveUserProfile();
    saveTimeOptions();
  });

  document.getElementById("reset-options").addEventListener("click", () => {
    resetDefaults();
  });

  document.getElementById("focus-time-minus").addEventListener("click", e => {
    var input = document.getElementById("focus-time");
    var count = parseInt(input.value) - 1;
    count = count < 1 ? 1 : count;
    input.value = count;
    return false;
  });

  document.getElementById("focus-time-plus").addEventListener("click", e => {
    var input = document.getElementById("focus-time");
    var count = parseInt(input.value) + 1;
    count = count > 150 ? 150 : count;
    input.value = count;
    return false;
  });

  document.getElementById("break-time-minus").addEventListener("click", e => {
    var input = document.getElementById("break-time");
    var count = parseInt(input.value) - 1;
    count = count < 1 ? 1 : count;
    input.value = count;
    return false;
  })
  
  document.getElementById("break-time-plus").addEventListener("click", e => {
    var input = document.getElementById("break-time");
    var count = parseInt(input.value) + 1;
    count = count > 30 ? 30 : count;
    input.value = count;
    return false;
  });
}

function resetDefaults() {
  document.getElementById("focus-time").value = 30;
  document.getElementById("break-time").value = 5;
}

function saveTimeOptions() {
  const focusTime = document.getElementById("focus-time").value;
  chrome.storage.sync.set({ focusTime: focusTime }, function () {
    console.log("focusTime is " + focusTime);
  });

  const breakTime = document.getElementById("break-time").value;
  chrome.storage.sync.set({ breakTime: breakTime }, function () {
    console.log("breakTime is " + breakTime);
  });
}

prepopulatingUIDataFromStorage();
setEventListeners();


