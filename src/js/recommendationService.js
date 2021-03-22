// input from the user 
// goal: [meditation* | strength | flexbility | cardio ]
// activityImpact: [ low* | high ]
// breakTime: [1 - infinity minutes]

// look into exercises.json
// result: randomly selected an exercise object {} based on the recommendation service

// index 0 is default exercise
let exercise_data = [
    {
      "id": 0,
      "exerciseName": "Take a deep breath",
      "goal": "meditation",
      "activityImpact": "low",
      "breakTime": [0,30],
      "url": "https://www.youtube.com/watch?v=aNXKjGFUlMs"
    },
    {
      "id": 1,
      "exerciseName": "Japa Meditation",
      "goal": "meditation",
      "activityImpact": "low",
      "breakTime": [5,10],
      "url": "https://www.youtube.com/watch?v=ISA2nTJXY6M&list=PLWoI875tcveP3aeg1RSwjuEzvflivySAQ"
    },
    {
      "id": 2,
      "exerciseName": "Guided Meidtation",
      "goal": "meditation",
      "activityImpact": "low",
      "breakTime": [5,10],
      "url": "https://www.youtube.com/watch?v=oopQVhtdeLo&list=PLWoI875tcveP3aeg1RSwjuEzvflivySAQ&index=3"
    },
    {
      "id": 3,
      "exerciseName": "Hatha Yoga",
      "goal": "flexibility",
      "activityImpact": "low",
      "breakTime": [5,10],
      "url": "https://www.youtube.com/watch?v=GvLLukzIW7c&list=PLWoI875tcveP3aeg1RSwjuEzvflivySAQ&index=12"
    },
    {
      "id": 4,
      "exerciseName": "Gentle Yoga",
      "goal": "flexibility",
      "activityImpact": "low",
      "breakTime": [10,30],
      "url": "https://www.youtube.com/watch?v=xWLbvxX44wo&list=PLWoI875tcveNEtN7F69jreqLHa_v5Ho9p"
    },
    {
      "id": 5,
      "exerciseName": "Guided Meditation",
      "goal": "meditation",
      "activityImpact": "low",
      "breakTime": [10,30],
      "url": "https://www.youtube.com/watch?v=Zc_acoueHMw&list=PLWoI875tcveNEtN7F69jreqLHa_v5Ho9p&index=12"
    },
    {
      "id": 6,
      "exerciseName": "Office Yoga",
      "goal": "flexibility",
      "activityImpact": "low",
      "breakTime": [0,5],
      "url": "https://www.youtube.com/watch?v=Q-bVQXcfstY&list=PLWoI875tcveP3aeg1RSwjuEzvflivySAQ&index=47"
    },
    {
      "id": 7,
      "exerciseName": "Stretching Routine for the wrists",
      "goal": "flexibility",
      "activityImpact": "low",
      "breakTime": [0,5],
      "url": "https://www.youtube.com/watch?v=FYh_XG2Z6iU&list=PLWoI875tcveP3aeg1RSwjuEzvflivySAQ&index=44"
    },
    {
      "id": 8,
      "exerciseName": "HIIT Workout",
      "goal": "cardio",
      "activityImpact": "high",
      "breakTime": [5,10],
      "url": "https://www.youtube.com/watch?v=zr08J6wB53Y"
    },
    {
      "id": 9,
      "exerciseName": "Ab Workout",
      "goal": "cardio",
      "activityImpact": "low",
      "breakTime": [5,10],
      "url": "https://www.youtube.com/watch?v=AnYl6Nk9GOA"
    },
    {
      "id": 10,
      "exerciseName": "Upper Body Workout",
      "goal": "strength",
      "activityImpact": "low",
      "breakTime": [5,10],
      "url": "https://www.youtube.com/watch?v=AnYl6Nk9GOA"
    },
    {
      "id": 11,
      "exerciseName": "Happy Cardio",
      "goal": "cardio",
      "activityImpact": "high",
      "breakTime": [10,30],
      "url": "https://www.youtube.com/watch?v=QPKXw8XEQiA"
    },
    {
      "id": 12,
      "exerciseName": "Power Yoga",
      "goal": "flexibility",
      "activityImpact": "low",
      "breakTime": [5,10],
      "url": "https://www.youtube.com/watch?v=704f9VYk_yc&list=PLWoI875tcveP3aeg1RSwjuEzvflivySAQ&index=23"
    },
]

// TODO: modify frontend userprofile to match these key mapping
let mockUserProfile = {
    activityImpact: "low",
    age: "33",
    gender: "female",
    goal: "flexibility",
}

function runRecommendedService(exerciseData, userData) {
    const filterData = exerciseData.filter((exercise) => {
       const { activityImpact, goal, breakTime } = userData;
       return (exercise.activityImpact === activityImpact && 
        exercise.goal === goal &&
        breakTime > exercise.breakTime[0] && breakTime <= exercise.breakTime[1])
    })
    const randomIndex = Math.floor(Math.random() * filterData.length);
    // Default to breathing exercise
    return filterData[randomIndex] || exercise_data[0];
}

console.log("I'm recommending this exercise to you", runRecommendedService(exercise_data, mockUserProfile));
