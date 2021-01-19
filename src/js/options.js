let domActivities = document.getElementsByName("activities");
class UserProfile {
  constructor(gender="", age="", activitySpace="", activityImpact="") {
    this.gender = gender;
    this.age = age;
    this.activitySpace = activitySpace;
    this.activityImpact = activityImpact;
  }

  read() {
    console.log("Reading UserProfile")
    let userProfileStr = localStorage.getItem("userProfile");
    let userProfile;
    if (userProfileStr) {
      userProfile = JSON.parse(userProfileStr);
      this.gender = userProfile.gender;
      this.age = userProfile.age;
      this.activitySpace = userProfile.activitySpace;
      this.activityImpact = userProfile.activityImpact;
    }
  }

  recommendExercise(){
     // data massage and do recommendations
  }

  write() {
    console.log("Writing UserProfile")

    let userProfileJson = {
      gender:"",
      age:"",
      activitySpace:[],
      activityImpact:[],
    }
    userProfileJson.gender = this.gender;
    userProfileJson.age = this.age;
    userProfileJson.activitySpace = this.activitySpace;
    userProfileJson.activityImpact = this.activityImpact;
    let stringified = JSON.stringify(userProfileJson);

    console.log("userProfileJson: ",stringified, userProfileJson);
    return localStorage.setItem("userProfile", stringified);
  }

}

let userProfile = new UserProfile();
function readFromLocalStorage() {
  userProfile.read();

  // Get input elements
  let femaleGender = document.querySelector("input[id=gender-female]")
  let maleGender = document.querySelector("input[id=gender-male]")
  let age = document.querySelector("input[id=age-input]")
  let activitySpaceSmall = document.querySelector("input[id=activity-space-small]")
  let activitySpaceMedium = document.querySelector("input[id=activity-space-medium]")
  let activitySpaceLarge = document.querySelector("input[id=activity-space-large]")
  let highImpactActivity = document.querySelector("input[id=activity-high-impact]")
  let lowImpactActivity = document.querySelector("input[id=activity-low-impact]")

  // Assign input element
  switch(userProfile.gender) {
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

  switch(userProfile.activitySpace) {
    case 'small': {
      activitySpaceSmall.checked = true;
      break;
    }
    case 'medium':{
      activitySpaceMedium.checked = true;
      break;
    }
    case 'large': {
      activitySpaceLarge.checked = true;
      break;
    }
  }

  switch(userProfile.activityImpact) {
    case 'high-impact': {
      highImpactActivity.checked = true;
      break;
    }
    case 'low-impact':{
      lowImpactActivity.checked = true;
      break;
    }
  }
}

function setEventListeners() {
  document.getElementById("options-form").addEventListener("submit", e => {
    e.preventDefault();
    saveOptions();
  });

  document.getElementById("reset-options").addEventListener("click", () => {
    resetDefaults();
  });

  document.getElementById("update-button").addEventListener("click", (e) => {
    // collect all input and store them
    e.preventDefault();
    let gender = document.querySelector('input[name=gender]:checked').value
    let age = document.querySelector("input[name=age]").value;
    let activitySpace = document.querySelector('input[name=activity-space]:checked').value;
    let activityImpact = document.querySelector('input[name=activity-impact]:checked').value;
    // load everything
    userProfile = new UserProfile(gender, age , activitySpace, activityImpact)
    userProfile.write()
  });

  document.getElementById("meditation").addEventListener("click", e => {
    document.getElementById("fitness-activities").style.display = "none";
    document.getElementById("meditation-activities").style.display = "block";
    document.getElementById("stretching-activities").style.display = "none";
    document.getElementById("stretching-list").innerHTML = "";
    document.getElementById("fitness-list").innerHTML = "";
  });

  document.getElementById("stretching").addEventListener("click", e => {
    document.getElementById("fitness-activities").style.display = "none";
    document.getElementById("meditation-activities").style.display = "none";
    document.getElementById("stretching-activities").style.display = "block";
    document.getElementById("fitness-list").innerHTML = "";
    document.getElementById("meditation-list").innerHTML = "";
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

  document.getElementById("stretching-btn").addEventListener("click", e => {
    var text = document.getElementById("stretching-url").value;
    if (/\S/.test(text)) {
      addListElement("stretching-list", text);
    }
  });

  document.getElementById("meditation-btn").addEventListener("click", e => {
    var text = document.getElementById("meditation-url").value;
    if (/\S/.test(text)) {
      addListElement("meditation-list", text);
    }
  });

  document.getElementById("fitness-btn").addEventListener("click", e => {
    var text = document.getElementById("fitness-url").value;
    if (/\S/.test(text)) {
      addListElement("fitness-list", text);
    }
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


