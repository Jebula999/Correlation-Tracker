import React, { useState, useEffect } from 'react';
import { getLayout, addEvent } from '../data/storage';
import './DrillDown.css';

function getNode(layout, path) {
  if (!path || path.length === 0) return layout;
  let node = layout;
  for (const key of path) {
    if (!node[key]) return null;
    node = node[key];
  }
  return node;
}

function DrillDown({ path, onNavigate, onBack }) {
  const [layout] = useState(getLayout());
  const [message, setMessage] = useState('');

  // State for multi-step flows (like Sleep)
  const [flowState, setFlowState] = useState({
    step: 0,
    selections: [],
  });

  const baseNode = getNode(layout, path);

  // Determine the current step's node and options
  let currentNode = baseNode;
  let currentPath = path;
  if (flowState.step > 0) {
      let tempNode = baseNode;
      for(let i = 0; i < flowState.step; i++) {
        const selection = flowState.selections[i];
        // This logic is getting complex, let's simplify for now
        // The special flow is only for 'Sleep'. Let's hardcode that assumption.
      }
  }

  // The logic for general-purpose multi-step flow is complex.
  // Let's implement the specific "Sleep" flow as per the requirements.
  const isSleepFlow = path.length === 1 && path[0] === 'Sleep';

  function handleSelect(selection) {
    const nextNode = currentNode[selection];

    if (isSleepFlow) {
        // Start the sleep flow
        setFlowState({ step: 1, selections: [selection], currentQuestion: 'Duration' });
        return;
    }

    if (nextNode && typeof nextNode === 'object' && !nextNode.options && !Array.isArray(nextNode) && !nextNode.next) {
      onNavigate({ name: 'DrillDown', path: [...path, selection] });
    } else {
      recordEvent([selection]);
    }
  }

  function handleSleepFlowSelect(question, answer) {
      const newSelections = [...flowState.selections, {question, answer}];

      if (question === 'Duration') {
          setFlowState({ ...flowState, selections: newSelections, step: 2, currentQuestion: 'Type' });
      } else if (question === 'Type') {
          if (answer === 'None') {
              // End of flow
              recordEvent(newSelections);
          } else {
              // Go to next step
              setFlowState({ ...flowState, selections: newSelections, step: 3, currentQuestion: 'Amount' });
          }
      } else if (question === 'Amount') {
          // End of flow
          recordEvent(newSelections);
      }
  }

  function recordEvent(values) {
    addEvent({
      category: path[0],
      path: path,
      values: values,
    });
    setMessage('Success');
    setTimeout(() => {
      onBack();
    }, 1000);
  }

  if (message) {
    return <div className="drilldown-message">{message}</div>;
  }

  // --- Render Logic ---

  // Render Special Sleep Flow
  if (isSleepFlow && flowState.step > 0) {
      const sleepNode = getNode(layout, ['Sleep', flowState.selections[0].answer || flowState.selections[0]]);
      if (flowState.currentQuestion === 'Duration') {
          const durationNode = sleepNode['Duration'];
          return (
              <div className="drilldown-list">
                <h3>Duration</h3>
                {durationNode.options.map(opt => <button key={opt} onClick={() => handleSleepFlowSelect('Duration', opt)}>{opt}</button>)}
              </div>
          )
      }
      const dreamNode = sleepNode.next.Dreams;
      if (flowState.currentQuestion === 'Type') {
          return (
              <div className="drilldown-list">
                <h3>Dream Type</h3>
                {Object.keys(dreamNode.Type).map(opt => <button key={opt} onClick={() => handleSleepFlowSelect('Type', opt)}>{opt}</button>)}
              </div>
          )
      }
      if (flowState.currentQuestion === 'Amount') {
          return (
              <div className="drilldown-list">
                <h3>Dream Amount</h3>
                {dreamNode.Amount.map(opt => <button key={opt} onClick={() => handleSleepFlowSelect('Amount', opt)}>{opt}</button>)}
              </div>
          )
      }
  }


  // Render regular drill-down
  if (currentNode.options) {
    return (
      <div className="drilldown-list">
        {currentNode.options.map((option) => (
          <button key={option} onClick={() => recordEvent([option])}>
            {option}
          </button>
        ))}
      </div>
    );
  }

  const subCategories = Object.keys(currentNode);
  return (
    <div className="drilldown-list">
      {subCategories.map((cat) => (
        <button key={cat} onClick={() => handleSelect(cat)}>
          {cat}
        </button>
      ))}
    </div>
  );
}

export default DrillDown;
