import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import disableScalable from './utils/disableScalable';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();


 document.oncontextmenu = function(){return false;}