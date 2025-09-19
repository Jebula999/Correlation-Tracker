import React, { useState } from 'react';
import { getLayout, saveLayout } from '../data/storage';
import './Customize.css';

// A recursive component to render each level of the layout
const LayoutNode = ({ name, node, path, onAdd }) => {
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState('');

  const isOptionList = node.options && Array.isArray(node.options);

  function handleAdd() {
    if (newItem.trim()) {
      onAdd(path, newItem);
      setNewItem('');
      setAdding(false);
    }
  }

  return (
    <div className="layout-node">
      <span className="node-name">{name}</span>
      {isOptionList && (
        <button className="add-button" onClick={() => setAdding(!adding)}>+</button>
      )}

      {adding && (
        <div className="add-form">
          <input
            type="text"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            placeholder="New option name"
          />
          <button onClick={handleAdd}>Add</button>
        </div>
      )}

      {isOptionList ? (
        <ul className="options-list">
          {node.options.map(opt => <li key={opt}>{opt}</li>)}
        </ul>
      ) : (
        <div className="node-children">
          {Object.keys(node).map(key => {
            if (key === 'next') return null; // Don't render special keys
            return (
              <LayoutNode
                key={key}
                name={key}
                node={node[key]}
                path={[...path, key]}
                onAdd={onAdd}
              />
            )
          })}
        </div>
      )}
    </div>
  );
};


function Customize({ onBack }) {
  const [layout, setLayout] = useState(getLayout());
  const [newCategory, setNewCategory] = useState('');

  // This is a deep copy, which is important!
  const layoutCopy = JSON.parse(JSON.stringify(layout));

  function handleAddTopLevel() {
    if(newCategory.trim() && !layoutCopy[newCategory]) {
        // Add a new category with a simple options array structure
        layoutCopy[newCategory] = { options: [] };
        setLayout(layoutCopy);
        setNewCategory('');
    }
  }

  function handleAddItem(path, newItem) {
    let node = layoutCopy;
    for (const key of path) {
      node = node[key];
    }
    if(node.options && !node.options.includes(newItem)) {
        node.options.push(newItem);
        setLayout(layoutCopy);
    }
  }

  function handleSave() {
    saveLayout(layoutCopy);
    alert('Changes saved!');
    onBack();
  }

  return (
    <div className="customize-container">
      <div className="add-form top-level-form">
        <h3>Add New Category</h3>
        <input
          type="text"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          placeholder="New top-level category"
        />
        <button onClick={handleAddTopLevel}>Add Category</button>
      </div>

      <div className="layout-tree">
        <h3>Edit Existing Categories</h3>
        {Object.keys(layout).map(key => (
          <LayoutNode key={key} name={key} node={layout[key]} path={[key]} onAdd={handleAddItem} />
        ))}
      </div>

      <div className="customize-actions">
        <button onClick={handleSave}>Save Changes</button>
        <button onClick={onBack} className="secondary">Cancel</button>
      </div>
    </div>
  );
}

export default Customize;
