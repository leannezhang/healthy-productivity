// input from the user 
// goals: [meditation* | strength | flexbility | cardio ]
// activityImpact: [ low* | high ]
// breakTime: [1 - infinity minutes]

// look into exercises.json
// result: randomly selected an exercise object {} based on the recommendation service

let exercise_data = [
    {
      "id": 0,
      "exerciseName": "Power Yoga",
      "goals": [
        "strength",
        "flexibility"
      ],
      "activityImpact": "low",
      "breakTime": [5,10],
      "youtube": "https://www.youtube.com/watch?v=704f9VYk_yc&list=PLWoI875tcveP3aeg1RSwjuEzvflivySAQ&index=23"
    },
    {
      "id": 1,
      "exerciseName": "Japa Meditation",
      "goals": [
        "meditation"
      ],
      "activityImpact": "low",
      "breakTime": [5,10],
      "youtube": "https://www.youtube.com/watch?v=ISA2nTJXY6M&list=PLWoI875tcveP3aeg1RSwjuEzvflivySAQ"
    },
    {
      "id": 2,
      "exerciseName": "Guided Meidtation",
      "goals": [
        "meditation"
      ],
      "activityImpact": "low",
      "breakTime": [5,10],
      "youtube": "https://www.youtube.com/watch?v=oopQVhtdeLo&list=PLWoI875tcveP3aeg1RSwjuEzvflivySAQ&index=3"
    },
    {
      "id": 3,
      "exerciseName": "Hatha Yoga",
      "goals": [
        "flexibility"
      ],
      "activityImpact": "low",
      "breakTime": [5,10],
      "youtube": "https://www.youtube.com/watch?v=GvLLukzIW7c&list=PLWoI875tcveP3aeg1RSwjuEzvflivySAQ&index=12"
    },
    {
      "id": 4,
      "exerciseName": "Gentle Yoga",
      "goals": [
        "flexibility"
      ],
      "activityImpact": "low",
      "breakTime": [10,15],
      "youtube": "https://www.youtube.com/watch?v=xWLbvxX44wo&list=PLWoI875tcveNEtN7F69jreqLHa_v5Ho9p"
    },
    {
      "id": 5,
      "exerciseName": "Guided Meditation",
      "goals": [
        "meditation"
      ],
      "activityImpact": "low",
      "breakTime": [10,15],
      "youtube": "https://www.youtube.com/watch?v=Zc_acoueHMw&list=PLWoI875tcveNEtN7F69jreqLHa_v5Ho9p&index=12"
    },
    {
      "id": 6,
      "exerciseName": "Office Yoga",
      "goals": [
        "flexibility"
      ],
      "activityImpact": "low",
      "breakTime": [0,5],
      "youtube": "https://www.youtube.com/watch?v=Q-bVQXcfstY&list=PLWoI875tcveP3aeg1RSwjuEzvflivySAQ&index=47"
    },
    {
      "id": 7,
      "exerciseName": "Stretching Routine for the wrists",
      "goals": [
        "flexibility"
      ],
      "activityImpact": "low",
      "breakTime": [0,5],
      "youtube": "https://www.youtube.com/watch?v=FYh_XG2Z6iU&list=PLWoI875tcveP3aeg1RSwjuEzvflivySAQ&index=44"
    },
    {
      "id": 8,
      "exerciseName": "HIIT Workout",
      "goals": [
        "strength",
        "cardio"
      ],
      "activityImpact": "high",
      "breakTime": [5,10],
      "youtube": "https://www.youtube.com/watch?v=zr08J6wB53Y"
    },
    {
      "id": 9,
      "exerciseName": "Ab Workout",
      "goals": [
        "strength",
        "cardio"
      ],
      "activityImpact": "low",
      "breakTime": [5,10],
      "youtube": "https://www.youtube.com/watch?v=AnYl6Nk9GOA"
    },
    {
      "id": 10,
      "exerciseName": "Upper Body Workout",
      "goals": [
        "strength"
      ],
      "activityImpact": "low",
      "breakTime": [5,10],
      "youtube": "https://www.youtube.com/watch?v=AnYl6Nk9GOA"
    },
    {
      "id": 11,
      "exerciseName": "Happy Cardio",
      "goals": [
        "cardio"
      ],
      "activityImpact": "high",
      "breakTime": [10,15],
      "youtube": "https://www.youtube.com/watch?v=QPKXw8XEQiA"
    }
]

// TODO: modify userprofile to match cases
let mockUserProfile = {
    activityImpact: "low",
    age: "33",
    equipments: [],
    gender: "female",
    goals: "flexibility",
    breakTime: "5"
}

function runRecommendedService(exerciseData, userData) {
    const filterData = exerciseData.filter((exercise) => {
       const { activityImpact, goals, breakTime } = userData;
       return (exercise.activityImpact === activityImpact && 
        exercise.goals.includes(goals) &&
        breakTime > exercise.breakTime[0] && breakTime <= exercise.breakTime[1])
    })

    const randomIndex = Math.floor(Math.random() * filterData.length);
    return filterData[randomIndex];
}

console.log("I'm recommending this exercise to you", runRecommendedService(exercise_data, mockUserProfile));
