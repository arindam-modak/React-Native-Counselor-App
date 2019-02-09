import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

//const settings = {timestampsInSnapshots: true};

const config = {
    apiKey: "AIzaSyA1QuFJ-oeqLp0Q0akmBPVy9YUY84cxsoc",
    authDomain: "counselling-bot-10fda.firebaseapp.com",
    databaseURL: "https://counselling-bot-10fda.firebaseio.com",
    projectId: "counselling-bot-10fda",
    storageBucket: "counselling-bot-10fda.appspot.com",
    messagingSenderId: "984760016813"
};
firebase.initializeApp(config);

//firebase.firestore().settings(settings);

export default firebase;