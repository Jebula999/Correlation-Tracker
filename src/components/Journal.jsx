import React, { useState, useEffect } from 'react';
import { getJournalEntries, addJournalEntry } from '../data/storage';
import './Journal.css';

function Journal() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');

  useEffect(() => {
    setEntries(getJournalEntries());
  }, []);

  function handleSave() {
    if (newEntry.trim() === '') return;
    addJournalEntry(newEntry);
    setNewEntry('');
    // Refresh the list from storage to show the new entry at the top
    setEntries(getJournalEntries());
  }

  function exportToCsv() {
    const headers = ['Timestamp', 'Text'];
    const rows = entries.map(entry => {
        const timestamp = new Date(entry.timestamp).toISOString();
        // Escape commas and quotes for CSV
        const text = `"${entry.text.replace(/"/g, '""')}"`;
        return [timestamp, text].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "journal_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="journal-container">
      <div className="journal-form">
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Write your thoughts..."
          rows="4"
        ></textarea>
        <div className="journal-actions">
            <button onClick={handleSave}>Save Entry</button>
            <button onClick={exportToCsv} disabled={entries.length === 0}>
                Export to CSV
            </button>
        </div>
      </div>
      <ul className="entry-list">
        {entries.length > 0 ? (
            entries.map(entry => (
                <li key={entry.id} className="entry-item">
                    <div className="entry-timestamp">
                        {new Date(entry.timestamp).toLocaleString()}
                    </div>
                    <p className="entry-text">{entry.text}</p>
                </li>
            ))
        ) : (
            <p>No journal entries yet.</p>
        )}
      </ul>
    </div>
  );
}

export default Journal;
