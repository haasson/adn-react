import 'promise-polyfill/src/polyfill';
import '@babel/polyfill/dist/polyfill.js'
import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';

import './js/main'
import './js/jquery.magnific-popup'
import './sass/main.sass'
import './js/svg-common'

import App from './components/app'

ReactDOM.render(<App className='' />, document.querySelector('.root'))