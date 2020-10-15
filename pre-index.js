const generateHowtoAsync = require("@yazilimvip/howto-script/build/service/HowtoServiceAsync")
  .default;

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase = require("firebase/app");

// Add the Firebase services that you want to use
require("firebase/database");
require("firebase/auth");

const genericErrorHandler = (error) => {
  console.log("errorCode", error.code);
  console.log("errorMessage", error.message);
};

const firebaseConfig = {
  apiKey: process.argv[2],
  databaseURL: "https://yvip-howto.firebaseio.com",
  projectId: "yvip-howto",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase
  .auth()
  .signInWithEmailAndPassword(process.argv[3], process.argv[4])
  .catch(genericErrorHandler)
  .then(() => {
    generateHowtoAsync(`${__dirname}/../howto`).then((result) => {
      firebase
        .database()
        .ref("howto")
        .set(JSON.stringify(result))
        .catch(genericErrorHandler)
        .then(() => {
          console.log("Operation Completed!");
          firebase
            .auth()
            .signOut()
            .catch(genericErrorHandler)
            .then(() => {
              console.log("Sign Out Success!");
              process.exit(0);
            });
        });
    });
  });
