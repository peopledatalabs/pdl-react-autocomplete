import React from 'react';
import ReactDOM from 'react-dom/client';
import Autocomplete from 'pdl-react-autocomplete';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <div className="App">
      <Autocomplete
        apiKey={process.env.REACT_APP_PDL_API_KEY}
        field="company"
        size={5}
        onTermSelected={(term) => {
          console.log(term);
        }}
      />
    </div>
  </React.StrictMode>
);
