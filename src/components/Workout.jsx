import '../index.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Workout() {
  const [user, setUser] = useState(null)
  const [date, setDate] = useState('');
  const [exercises, setExercises] = useState([]);
  const [loggedWorkouts, setLoggedWorkouts] = useState([]);
  const [unit, setUnit] = useState('lbs');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchWorkouts(userData.email);
    }
  }, []);

  const getFirstName = (fullName) => {
    return fullName.split(' ')[0];
  };

  const addExercise = () => {
    setExercises([
      ...exercises, 
      { name: '', sets: [{ reps: '', weight: '' }] }
    ]);
  };

  const handleExerciseChange = (index, event) => {
    const updatedExercises = exercises.map((exercise, i) => {
      if (i === index) {
        return { ...exercise, name: event.target.value };
      }
      return exercise;
    });
    setExercises(updatedExercises);
  };

  const handleSetChange = (exerciseIndex, setIndex, event) => {
    const updatedExercises = exercises.map((exercise, i) => {
      if (i === exerciseIndex) {
        const updatedSets = exercise.sets.map((set, j) => {
          if (j === setIndex) {
            return { ...set, [event.target.name]: event.target.value };
          }
          return set;
        });
        return { ...exercise, sets: updatedSets };
      }
      return exercise;
    });
    setExercises(updatedExercises);
  };

  const addSet = (exerciseIndex) => {
    const updatedExercises = exercises.map((exercise, i) => {
      if (i === exerciseIndex) {
        return { ...exercise, sets: [...exercise.sets, { reps: '', weight: '' }] };
      }
      return exercise;
    });
    setExercises(updatedExercises);
  };

  const deleteSet = (exerciseIndex, setIndex) => {
    const updatedExercises = exercises.map((exercise, i) => {
      if (i === exerciseIndex) {
        const updatedSets = exercise.sets.filter((_, j) => j !== setIndex);
        return { ...exercise, sets: updatedSets };
      }
      return exercise;
    });
    setExercises(updatedExercises);
  };

  const submitWorkout = () => {
    if (user) {
      const workoutData = { email: user.email, date, exercises};
      console.log(exercises);
      console.log(user.email);
      console.log('Submitting workout data:', workoutData);
  
      axios.post('http://localhost:5000/api/workouts', workoutData)
        .then(response => {
          console.log('Workout logged successfully:', response.data);
          setLoggedWorkouts([...loggedWorkouts, workoutData]);
          setExercises([]);
          setDate('');
        })
        .catch(error => {
          console.error('Error logging workout:', error);
        });
    } else {
      console.error
    }
  };

  const fetchWorkouts = (email) => {
    axios.get(`http://localhost:5000/api/workouts/${email}`)
      .then(response => {
        console.log('Fetched workouts:', response.data);
        setLoggedWorkouts(response.data)
      })
      .catch(error => {
        console.error('Error fetching workouts:', error);
      });
  }

  const logout = () => {
    navigate('/auth');
  }
  return (
    <div>
      <nav className="navbar">
        <div>Welcome {user ? getFirstName(user.full_name) : ''} </div>
        <div>Fitness Tracking</div>
        <a className='logout' onClick={logout}>Logout</a>
      </nav>
      <div className="workout-logger">
        <h1>Log Your Workout</h1>
        <label className='date-picker'>
          Date: 
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className='date-selector'
          />
        </label>
        <label className='unit-input'>
          Unit:
          <select className='unit-selector' value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="lbs">lbs</option>
            <option value="kgs">kgs</option>
          </select>
        </label>
        <h2>Add Exercises</h2>
        {exercises.map((exercise, exerciseIndex) => (
          <div key={exerciseIndex} className="exercise-container">
            <label>
              Exercise Name:
              <input
                type="text"
                value={exercise.name}
                onChange={(event) => handleExerciseChange(exerciseIndex, event)}
              />
            </label>
            {exercise.sets.map((set, setIndex) => (
              <div key={setIndex} className='reps-weight'>
                <label>
                  Reps:
                  <input
                    type="text"
                    name="reps"
                    value={set.reps}
                    onChange={(event) => handleSetChange(exerciseIndex, setIndex, event)}
                  />
                </label>
                <label>
                  Weight:
                  <input
                    type="text"
                    name="weight"
                    value={set.weight}
                    onChange={(event) => handleSetChange(exerciseIndex, setIndex, event)}
                  />
                </label>
                <button className='delete-set' onClick={() => deleteSet(exerciseIndex, setIndex)}>Delete Set</button>
              </div>
            ))}
            <div>
              <button className='add-set' onClick={() => addSet(exerciseIndex)}>Add Set</button>
            </div>
            
          </div>
        ))}
        <div>
          <button className='add-exercise' onClick={addExercise}>Add Exercise</button>
        </div>
        <div>
          <button className='log-workout' onClick={submitWorkout}>Log Workout</button>
        </div>

        <h2>Workout Logs</h2>
        <div className="workout-logs">
          {loggedWorkouts.map((workout, workoutIndex) => (
            <div key={workoutIndex} className="workout-log">
              <h3>{workout.date}</h3>
              {workout.exercises.map((exercise, exerciseIndex) => (
                <div key={exerciseIndex}>
                  <h4>Exercise #{exerciseIndex+ 1}: {exercise.exercise_name}</h4>
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="reps-weight">
                      <p>Set: {setIndex + 1}</p>
                      <p>Reps: {set.reps}</p>
                      <p>Weight: {set.weight} {workout.unit}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
    
  );
}

export default Workout;
