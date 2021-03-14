let domActivities = document.getElementsByName("activities");
class UserProfile {
  constructor(
    gender = "",
    age = "",
    activityImpact = "",
    goal = "",
    equipments = []) {
    this.gender = gender;
    this.age = age;
    this.activityImpact = activityImpact;
    this.goal = goal;
    this.equipments = equipments;
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
      this.equipments = userProfile.equipments;
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
      activityImpact: [],
      goal: "",
      equipments: [],
    }
    userProfileJson.gender = this.gender;
    userProfileJson.age = this.age;
    userProfileJson.activityImpact = this.activityImpact;
    userProfileJson.goal = this.goal;
    userProfileJson.equipments = this.equipments;
    let stringified = JSON.stringify(userProfileJson);

    console.log("userProfileJson: ", stringified, userProfileJson);
    return localStorage.setItem("userProfile", stringified);
  }
}

let userProfile = new UserProfile();
function readFromLocalStorage() {
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
  let goalsValue = document.querySelector("select[id=goals]")

  // TODO (liyangz): need to make the field checkbox
  let equipmentsValue = document.querySelector("select[id=equipments]").value

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
  goalsValue = userProfile.goal
}

// collect all input and store them
function collectFields() {
  let gender = document.querySelector('input[name=gender]:checked').value
  let age = document.querySelector("input[name=age]").value;
  let activityImpact = document.querySelector('input[name=activity-impact]:checked').value;
  let goalsValue = document.querySelector("select[id=goal]").value
  // load everything
  // TODO (liyangz) fix equipment. pass in an array
  userProfile = new UserProfile(gender, age, activityImpact, goalsValue, [])
  userProfile.write()
}

function setEventListeners() {
  document.getElementById("options-form").addEventListener("submit", e => {
    e.preventDefault();
    collectFields()
    saveOptions();
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
  });
  document.getElementById("break-time-plus").addEventListener("click", e => {
    var input = document.getElementById("break-time");
    var count = parseInt(input.value) + 1;
    count = count > 30 ? 30 : count;
    input.value = count;
    return false;
  });
}

function addListElement(id, text) {
  var li = document.createElement("li");
  li.innerHTML = text;
  document.getElementById(id).appendChild(li);
}

function resetDefaults() {
  document.getElementById("focus-time").value = 30;
  document.getElementById("break-time").value = 5;
  document.getElementById("fitness").checked = false;
  document.getElementById("meditation").checked = false;
  document.getElementById("stretching").checked = false;
  document.getElementById("fitness-activities").style.display = "none";
  document.getElementById("meditation-activities").style.display = "none";
  document.getElementById("stretching-activities").style.display = "none";
  document.getElementById("fitness-list").innerHTML = "";
  document.getElementById("meditation-list").innerHTML = "";
  document.getElementById("stretching-list").innerHTML = "";
}

function saveOptions() {
  const focusTime = document.getElementById("focus-time").value;
  chrome.storage.sync.set({ focusTime: focusTime }, function () {
    console.log("focusTime is " + focusTime);
  });

  const breakTime = document.getElementById("break-time").value;
  chrome.storage.sync.set({ breakTime: breakTime }, function () {
    console.log("breakTime is " + breakTime);
  });

  const activityCategory = getCheckedValue(domActivities);

  if (typeof activityCategory !== "undefined") {
    chrome.storage.sync.set({ activityCategory: activityCategory }, function () {
      console.log("Selected activity is " + activityCategory);
    });

    var activityLst = [];
    const lstNodes = document
      .getElementById(activityCategory + "-list")
      .getElementsByTagName("li");
    for (let i = 0; i < lstNodes.length; i++) {
      activityLst.push(lstNodes[i].textContent);
    }

    //    const activities = document.getElementById(activityCategory + "-activities-lst").value;
    //    const activityLst = activities.split(/[ ,\n]/);
    chrome.storage.sync.set({ activityLst: activityLst }, function () {
      console.log("Provided activity list is " + activityLst);
    });
  }
}

function getCheckedValue(radioElement) {
  for (var i = 0; i < radioElement.length; i++) {
    if (radioElement[i].checked) {
      return radioElement[i].value;
    }
  }
}

readFromLocalStorage();
setEventListeners();


