import defaultLayout from '../../json_layout.json';

const LAYOUT_KEY = 'tracker-layout';
const EVENTS_KEY = 'tracker-events';
const JOURNAL_KEY = 'tracker-journal';

// --- Helper Functions ---
function getFromStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage for key "${key}":`, error);
    return null;
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage for key "${key}":`, error);
  }
}

// --- Layout Management ---
export function getLayout() {
  let layout = getFromStorage(LAYOUT_KEY);
  if (!layout) {
    console.log('No custom layout found, initializing with default layout.');
    layout = defaultLayout;
    saveToStorage(LAYOUT_KEY, layout);
  }
  return layout;
}

export function saveLayout(newLayout) {
  saveToStorage(LAYOUT_KEY, newLayout);
}

// --- Tracked Events Management ---
export function getEvents() {
  return getFromStorage(EVENTS_KEY) || [];
}

export function addEvent(eventData) {
  const events = getEvents();
  const newEvent = {
    id: Date.now(), // Simple unique ID
    timestamp: new Date().toISOString(),
    ...eventData,
  };
  events.unshift(newEvent); // Add to the beginning for newest first
  saveToStorage(EVENTS_KEY, events);
  return newEvent;
}

// --- Journal Entries Management ---
export function getJournalEntries() {
  return getFromStorage(JOURNAL_KEY) || [];
}

export function addJournalEntry(text) {
  const entries = getJournalEntries();
  const newEntry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    text,
  };
  entries.unshift(newEntry); // Add to the beginning for newest first
  saveToStorage(JOURNAL_KEY, entries);
  return newEntry;
}
