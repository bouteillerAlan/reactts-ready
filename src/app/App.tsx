import React from 'react';
import './style/scss/app.scss';
import RouterApp from './router';
import {BrowserRouter as Router} from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Router>
      <RouterApp/>
    </Router>
  );
};

export default App;
