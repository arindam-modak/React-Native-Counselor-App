/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'babel-polyfill';
AppRegistry.registerComponent(appName, () => App);
