class UserProfile {
  constructor(
    gender = "",
    age = "",
    activityImpact = "",
    goal = "",
    equipment = "") {
    this.gender = gender;
    this.age = age;
    this.activityImpact = activityImpact;
    this.goal = goal;
    this.equipment = equipment;
  }

  read() {
    console.log("Reading UserProfile")
    let userProfileStr = localStorage.getItem("userProfile");
    let userProfile;
    if (userProfileStr) {
      userProfile = JSON.parse(userProfileStr);
      this.gender = userProfile.gender;
      this.age = userProfile.age;
      this.activityImpact = userProfile.activityImpact;
      this.goal = userProfile.goal;
      this.equipment = userProfile.equipment;
    }
  }

  recommendExercise() {
    // data massage and do recommendations
  }

  write() {
    console.log("Writing UserProfile")
    let userProfileJson = {
      gender: "",
      age: "",
      activityImpact: "",
      goal: "",
      equipment: "",
    }
    userProfileJson.gender = this.gender;
    userProfileJson.age = this.age;
    userProfileJson.activityImpact = this.activityImpact;
    userProfileJson.goal = this.goal;
    userProfileJson.equipment = this.equipment;
    console.log("userProfileJson: ", JSON.stringify(userProfileJson));
    return localStorage.setItem("userProfile", JSON.stringify(userProfileJson));
  }
}

let userProfile = new UserProfile();
function prepopulateDataFromStorage() {
  /*
    Load UserProfile from localStorage
    pre-populate html fields
  */
  userProfile.read();

  // Get input elements
  let femaleGender = document.querySelector("input[id=gender-female]")
  let maleGender = document.querySelector("input[id=gender-male]")
  let age = document.querySelector("input[id=age-input]")
  let highImpactActivity = document.querySelector("input[id=activity-high-impact]")
  let lowImpactActivity = document.querySelector("input[id=activity-low-impact]")
  let goalValue = document.querySelector("select[id=goal]")
  let equipmentValue = document.querySelector("select[id=equipment]")

  // Assign input element
  switch (userProfile.gender) {
    case 'female': {
      femaleGender.checked = true;
    }
    case 'male': {
      maleGender.checked = true;
    }
  }

  if (userProfile.age) {
    age.value = userProfile.age;
  }

  switch (userProfile.activityImpact) {
    case 'high-impact': {
      highImpactActivity.checked = true;
      break;
    }
    case 'low-impact': {
      lowImpactActivity.checked = true;
      break;
    }
  }
  goalValue = userProfile.goal;
  equipmentValue = userProfile.equipment;
}

// collect all input and store them
function saveUserProfile() {
  let gender = document.querySelector('input[name=gender]:checked').value
  let age = document.querySelector("input[name=age]").value;
  let activityImpact = document.querySelector('input[name=activity-impact]:checked').value;
  let goalValue = document.querySelector("select[id=goal]").value
  // load everything
  // TODO (liyangz) fix equipment. pass in an array
  userProfile = new UserProfile(gender, age, activityImpact, goalValue, [])
  userProfile.write()
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

// TODO: reset defaults
function resetDefaults() {
  document.getElementById("focus-time").value = 30;
  document.getElementById("break-time").value = 5;
  document.getElementById("fitness").checked = false;
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

prepopulateDataFromStorage();
setEventListeners();


