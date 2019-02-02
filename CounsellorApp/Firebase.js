import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

//const settings = {timestampsInSnapshots: true};

const config = {
    apiKey: "AIzaSyAMNCoXwFYy9dTapcnVSfJPxMLnXmaOdoU",
	authDomain: "react-native1-4e754.firebaseapp.com",
	databaseURL: "https://react-native1-4e754.firebaseio.com",
	projectId: "react-native1-4e754",
	storageBucket: "react-native1-4e754.appspot.com",
	messagingSenderId: "475909135835"
};
firebase.initializeApp(config);

//firebase.firestore().settings(settings);

export default firebase;