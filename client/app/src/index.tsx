import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ApiGateway from './services/gateway.api';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
const api = new ApiGateway();
api.targets.add({
    name: 'x',
    description: 'y',
    scanType: 'all',
    url: 'walla.com',
    config: {
        interval: 250,
        maxDepth: 3,
        timeout: 30,
        name: 'something',
        save: true,
    },
    loginInfo: {
        form: {
            user: 'name',
        },
        formAction: 'walla.com/login.php',
    },
});
