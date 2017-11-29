import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import disableScalable from './utils/disableScalable';

import { Provider } from 'react-redux'
import store from './reducers'

store.dispatch({type: 'INITIAL'})

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();


 document.oncontextmenu = function(){return false;}