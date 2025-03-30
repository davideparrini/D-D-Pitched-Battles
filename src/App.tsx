import React from 'react';
import MapUploader from './pages/MapEditorPage';

const App: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>D&D Map Analyzer</h1>
      <MapUploader />
    </div>
  );
};

export default App;
