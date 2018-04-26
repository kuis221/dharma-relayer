import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './index.css';
import App from './components/App/App';
import registerServiceWorker from './registerServiceWorker';
import ReactGA from 'react-ga';

console.log(`Environment: ${process.env.NODE_ENV}`)

ReactGA.initialize('UA-117774393-1', { debug: true });
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
