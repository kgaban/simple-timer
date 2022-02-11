import React, { useEffect, useMemo, useState } from 'react';
import '../App.css';
import {
  Grid, Typography, Button, Paper, Select, MenuItem, InputLabel, FormControl, TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Duration } from 'luxon';
import { useSnackbar, withSnackbar } from 'notistack';

const COLORS = {
  dark: '#37474F',
  light: '#DEE4E7',
};

const useStyles = makeStyles(() => ({
  frame: {
    padding: '1rem',
  },
  background: {
    backgroundColor: COLORS.dark,
    width: '100vw',
    height: '100vh',
  },
  button: {

  },
}));

function App() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [counter, setCounter] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [mode, setMode] = useState('timer');
  const [paused, setPaused] = useState(true);

  const timerInSeconds = useMemo(() => {
    let total = seconds;
    total += hours * 60 * 60;
    total += minutes * 60;
    return total;
  }, [hours, minutes, seconds]);

  useEffect(() => {
    setCounter(timerInSeconds);
  }, [timerInSeconds]);

  useEffect(() => {
    if (paused) {
      return;
    }

    let timer;
    if (mode === 'timer') {
      if (counter > 0) {
        timer = setInterval(() => setCounter((current) => current - 1), 1000);
      }
      if (counter === 0) {
        enqueueSnackbar('Timer done!', { variant: 'success' });
      }
    }
    if (mode === 'stopwatch') {
      timer = setInterval(() => setCounter((current) => current + 1), 1000);
    }
    return () => {
      timer && clearInterval(timer);
    };
  }, [counter, enqueueSnackbar, mode, paused]);

  const handleReset = () => {
    setPaused(true);
    setCounter(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const handleChangeHours = (event) => {
    if (event.target.value < 0 || event.target.value === '') {
      setHours(0);
    } else {
      setHours(+event.target.value);
    }
  };

  const handleChangeMinutes = (event) => {
    if (event.target.value < 0 || event.target.value === '') {
      setMinutes(0);
    } else {
      setMinutes(+event.target.value);
    }
  };

  const handleChangeSeconds = (event) => {
    if (event.target.value < 0 || event.target.value === '') {
      setSeconds(0);
    } else {
      setSeconds(+event.target.value);
    }
  };

  const controlButton = () => (
    <Button
      fullWidth
      variant='contained'
      onClick={() => setPaused(!paused)}
      disabled={(mode === 'timer' && hours === 0 && minutes === 0 && seconds === 0)}
    >
      {paused ? 'Start' : 'Pause'}
    </Button>
  );

  const handleModeChange = (event) => {
    const newMode = event.target.value;
    setPaused(true);
    setCounter(newMode === 'timer' ? timerInSeconds : 0);
    setMode(newMode);
  };

  useEffect(() => {
    let timer;
    if (mode === 'timer' && counter === 0) {
      timer = setInterval(() => {
        setPaused(true);
        setCounter(timerInSeconds);
      }, 1000);
    }
    return () => {
      timer && clearInterval(timer);
    };
  }, [counter, mode, timerInSeconds]);

  return (
    <div className={`${classes.background}`}>
      <Grid container className={classes.frame}>
        <Grid item xs={12} align='center'>
          <Typography variant='h1' color={COLORS.light} style={{ paddingBottom: '1rem' }}>
            Simple Timer
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <Paper style={{ background: 'white' }}>
            <Grid container className={classes.frame} alignItems='center' justifyContent='center' spacing={1}>
              <Grid item xs={1}>
                <FormControl size='small' fullWidth>
                  <InputLabel id='mode-select'>Mode</InputLabel>
                  <Select
                    id='mode-select'
                    value={mode}
                    label='Mode'
                    onChange={handleModeChange}
                  >
                    <MenuItem value='timer'>Timer</MenuItem>
                    <MenuItem value='stopwatch'>Stopwatch</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={1}>
                {controlButton()}
              </Grid>
              <Grid item xs={1}>
                <Button fullWidth variant='contained' onClick={handleReset}>
                  Reset
                </Button>
              </Grid>
              {mode === 'timer' && (
                <Grid item xs={12}>
                  <TextField
                    id='hours-field'
                    label='Hours'
                    variant='standard'
                    value={hours}
                    onChange={handleChangeHours}
                    InputProps={{ type: 'number' }}
                    style={{ paddingRight: '0.5rem' }}
                  />
                  <TextField
                    id='minutes-field'
                    label='Minutes'
                    variant='standard'
                    value={minutes}
                    onChange={handleChangeMinutes}
                    InputProps={{ type: 'number' }}
                    style={{ paddingRight: '0.5rem' }}
                  />
                  <TextField
                    id='seconds-field'
                    label='Seconds'
                    variant='standard'
                    value={seconds}
                    onChange={handleChangeSeconds}
                    InputProps={{ type: 'number' }}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant='h2' style={{ color: paused ? 'grey' : 'black' }}>
                  {Duration.fromMillis(counter * 1000).toFormat("hh':'mm':'ss")}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default withSnackbar(App);
