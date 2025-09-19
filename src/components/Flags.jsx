import React, { useState, useEffect } from 'react';
import { getEvents } from '../data/storage';
import './Flags.css';

// --- Correlation Analysis Logic ---

// Helper to group events by day
function groupEventsByDay(events) {
  const groups = {};
  events.forEach(event => {
    const day = new Date(event.timestamp).toDateString();
    if (!groups[day]) {
      groups[day] = [];
    }
    groups[day].push(event);
  });
  return groups;
}

// Map mood/energy levels to numerical values for comparison
const MOOD_MAP = { "Joyful": 5, "Content": 4, "Neutral": 3, "Irritable": 2, "Low": 1 };
const ENERGY_MAP = { "Very High": 5, "High": 4, "Medium": 3, "Low": 2, "Very Low": 1, "None": 0 };

// Correlation 1: Sleep and Mood
function analyzeSleepAndMood(dailyEvents) {
    let daysWithLowSleep = 0;
    let moodOnLowSleepDays = 0;
    let daysWithHighSleep = 0;
    let moodOnHighSleepDays = 0;

    for (const day in dailyEvents) {
        const events = dailyEvents[day];
        const sleepEvent = events.find(e => e.category === 'Sleep' && e.path.includes('LastNight'));
        const moodEvents = events.filter(e => e.category === 'Mood');

        if (sleepEvent && moodEvents.length > 0) {
            const duration = parseInt(sleepEvent.values[0].answer);
            const avgMood = moodEvents.reduce((acc, curr) => acc + (MOOD_MAP[curr.value] || 0), 0) / moodEvents.length;

            if (duration <= 6) {
                daysWithLowSleep++;
                moodOnLowSleepDays += avgMood;
            }
            if (duration >= 8) {
                daysWithHighSleep++;
                moodOnHighSleepDays += avgMood;
            }
        }
    }

    if (daysWithLowSleep > 2 && daysWithHighSleep > 2) {
        const avgMoodLowSleep = moodOnLowSleepDays / daysWithLowSleep;
        const avgMoodHighSleep = moodOnHighSleepDays / daysWithHighSleep;
        if (avgMoodLowSleep < avgMoodHighSleep * 0.8) { // 20% lower
            return "Mood tends to be lower on days after less than 6 hours of sleep.";
        }
    }
    return null;
}

// Correlation 2: Activity and Energy
function analyzeActivityAndEnergy(dailyEvents) {
    let daysWithActivity = 0;
    let energyOnActivityDays = 0;
    let daysWithNoActivity = 0;
    let energyOnNoActivityDays = 0;

    const activeKeywords = ["Walk", "Run", "Gym", "Sports", "Yoga"];

    for (const day in dailyEvents) {
        const events = dailyEvents[day];
        const activityEvent = events.find(e => e.category === 'Activity' && activeKeywords.includes(e.value));
        const noActivityEvent = events.find(e => e.category === 'Activity' && e.value === 'None');
        const energyEvents = events.filter(e => e.category === 'Energy');

        if (energyEvents.length > 0) {
            const avgEnergy = energyEvents.reduce((acc, curr) => acc + (ENERGY_MAP[curr.value] || 0), 0) / energyEvents.length;
            if (activityEvent) {
                daysWithActivity++;
                energyOnActivityDays += avgEnergy;
            } else if (noActivityEvent) {
                daysWithNoActivity++;
                energyOnNoActivityDays += avgEnergy;
            }
        }
    }

    if (daysWithActivity > 2 && daysWithNoActivity > 2) {
        const avgEnergyWith = energyOnActivityDays / daysWithActivity;
        const avgEnergyWithout = energyOnNoActivityDays / daysWithNoActivity;
        if (avgEnergyWith > avgEnergyWithout * 1.2) { // 20% higher
            return "Energy levels seem to be higher on days you are active.";
        }
    }
    return null;
}


function Flags() {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const events = getEvents();
    if (events.length < 10) {
        setFlags(["Not enough data to find correlations yet. Keep tracking!"]);
        setLoading(false);
        return;
    }

    const dailyEvents = groupEventsByDay(events);
    const foundFlags = [];

    const sleepMoodFlag = analyzeSleepAndMood(dailyEvents);
    if (sleepMoodFlag) foundFlags.push(sleepMoodFlag);

    const activityEnergyFlag = analyzeActivityAndEnergy(dailyEvents);
    if (activityEnergyFlag) foundFlags.push(activityEnergyFlag);

    if (foundFlags.length === 0) {
        setFlags(["No strong correlations found at the moment."]);
    } else {
        setFlags(foundFlags);
    }

    setLoading(false);
  }, []);

  return (
    <div className="flags-container">
      <h2>Potential Flags & Correlations</h2>
      {loading ? (
        <p>Analyzing your data...</p>
      ) : (
        <ul className="flags-list">
          {flags.map((flag, index) => (
            <li key={index} className="flag-item">
              {flag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Flags;
