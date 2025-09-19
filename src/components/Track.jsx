import React, { useState, useEffect, useMemo } from 'react';
import { getEvents } from '../data/storage';
import './Track.css';

function Track() {
  const [events, setEvents] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const categories = useMemo(() => {
    const allCategories = events.map(e => e.category);
    return ['All', ...new Set(allCategories)];
  }, [events]);

  const filteredAndSortedEvents = useMemo(() => {
    let processedEvents = [...events];

    // Filter
    if (filterCategory !== 'All') {
      processedEvents = processedEvents.filter(e => e.category === filterCategory);
    }

    // Sort
    processedEvents.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return processedEvents;
  }, [events, filterCategory, sortOrder]);

  function formatEvent(event) {
    const date = new Date(event.timestamp).toLocaleString();
    let value = '';
    if (Array.isArray(event.values)) {
        // Handle complex events like Sleep
        value = event.values.map(v => (typeof v === 'object' ? `${v.question}: ${v.answer}`: v)).join(', ');
    } else {
        value = event.value;
    }
    return `[${date}] ${event.path.join(' > ')}: ${value}`;
  }

  function exportToCsv() {
    const headers = ['Timestamp', 'Category', 'Path', 'Value'];
    const rows = filteredAndSortedEvents.map(event => {
        const timestamp = new Date(event.timestamp).toISOString();
        const category = event.category;
        const path = event.path.join(' > ');
        const value = Array.isArray(event.values) ? event.values.map(v => (typeof v === 'object' ? `${v.question}:${v.answer}`: v)).join('; ') : event.value;
        return [timestamp, category, path, value].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tracker_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="track-container">
      <div className="track-controls">
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <button onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}>
          Sort: {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
        </button>
        <button onClick={exportToCsv} disabled={filteredAndSortedEvents.length === 0}>
          Export to CSV
        </button>
      </div>
      <ul className="event-list">
        {filteredAndSortedEvents.length > 0 ? (
            filteredAndSortedEvents.map(event => (
                <li key={event.id} className="event-item">
                    {formatEvent(event)}
                </li>
            ))
        ) : (
            <p>No events recorded yet.</p>
        )}
      </ul>
    </div>
  );
}

export default Track;
