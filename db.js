const express = require('express');
const mysql = require('mysql2');
const cors = require('cors')
require('dotenv').config();

const app = express();
const PORT = 5000


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.mySQL_PASSWORD,
  database: 'fitness_tracker'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id', connection.threadId);
});

app.use(cors());

app.use(express.json());

app.post('/api/register', (req, res) => {
  const { email, full_name } = req.body;

  const query = 'INSERT INTO users (email, full_name) VALUES (?, ?)';
  connection.query(query, [email, full_name], (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      res.status(500).json({ error: 'Error registering user' });
      return;
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
});


app.get('/api/user/:email', (req, res) => {
  const { email } = req.params;
  console.log(`Fetching user with email: ${email}`);
  const query = 'SELECT * FROM users WHERE email = ?';

  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({ error: 'Error fetching user' });
      return;
    }
    if (results.length > 0) {
      console.log('User found:', results[0]);
      res.json(results[0]);
    } else {
      console.log('User not found');
      res.status(404).json({ error: 'User not found' });
    }
  });
});


app.post('/api/workouts', (req, res) => {
  const { email , date, exercises } = req.body;

  console.log('Received workout data:', req.body);
  console.log(email);

  const workoutQuery = 'INSERT INTO workouts (user_email, date) VALUES (?, ?)';
  connection.query(workoutQuery, [email, date], (err, result) => {
    if (err) {
      console.error('Error logging workout:', err);
      res.status(500).json({ error: 'Error logging workout' });
      return;
    }

    const workoutId = result.insertId;
    console.log('Inserted workout with ID:', workoutId);

    exercises.forEach((exercise) => {
      const { name, sets } = exercise;
      console.log('Inserting exercise:', exercise);

      const exerciseQuery = 'INSERT INTO exercises (workout_id, exercise_name) VALUES (?, ?)';
      connection.query(exerciseQuery, [workoutId, name], (err, result) => {
        if (err) {
          console.error('Error logging exercise:', err);
          res.status(500).json({ error: 'Error logging exercise' });
          return;
        }

        const exerciseId = result.insertId;

        sets.forEach((set, index) => {
          const { reps, weight } = set;
          const setQuery = 'INSERT INTO sets (exercise_id, set_number, reps, weight) VALUES (?, ?, ?, ?)';
          connection.query(setQuery, [exerciseId, index + 1, reps, weight], (err, result) => {
            if (err) {
              console.error('Error logging set:', err);
              res.status(500).json({ error: 'Error logging set' });
              return;
            }
            console.log(`Set ${index + 1} logged successfully for exercise ${exerciseId}`);
          });
        });
      });
    });

    res.status(201).json({ message: 'Workout logged successfully' });
  });
});

app.get('/api/workouts/:email', (req, res) => {
  const { email } = req.params;

  const workoutQuery = 'SELECT * FROM workouts WHERE user_email = ?';
  connection.query(workoutQuery, [email], (err, workouts) => {
    if (err) {
      console.error('Error fetching workouts:', err);
      res.status(500).json({ error: 'Error fetching workouts' });
      return;
    }
    if (workouts.length === 0) {
      res.json([]);
      return;
    }

    const workoutIds = workouts.map(workout => workout.id);

    const exercisesQuery = 'SELECT * FROM exercises WHERE workout_id IN (?)';
    connection.query(exercisesQuery, [workoutIds], (err, exercises) => {
      if (err) {
        console.error('Error fetching exercises:', err);
        res.status(500).json({ error: 'Error fetching exercises' });
        return;
      }

      const setsQuery = 'SELECT * FROM sets WHERE exercise_id IN (?)';
      const exerciseIds = exercises.map(exercise => exercise.id);

      connection.query(setsQuery, [exerciseIds], (err, sets) => {
        if (err) {
          console.error('Error fetching sets:', err);
          res.status(500).json({ error: 'Error fetching sets' });
          return;
        }

        const workoutData = workouts.map(workout => {
          const workoutExercises = exercises.filter(exercise => exercise.workout_id === workout.id);
          const workoutExercisesWithSets = workoutExercises.map(exercise => {
            const exerciseSets = sets.filter(set => set.exercise_id === exercise.id);
            return {
              ...exercise,
              sets: exerciseSets
            };
          });

          const formattedDate = workout.date.toISOString().split('T')[0];

          return {
            ...workout,
            date: formattedDate,
            exercises: workoutExercisesWithSets
          };
        });

        res.json(workoutData);
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


module.exports = connection;
