const core = require("@actions/core");
const github = require("@actions/github");

const generateHowtoAsync = require("@yazilimvip/howto-script/build/service/HowtoServiceAsync")
  .default;

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase = require("firebase/app");

// Add the Firebase services that you want to use
require("firebase/database");
require("firebase/auth");

try {
  const genericErrorHandler = (error) => {
    console.log("errorCode", error.code);
    console.log("errorMessage", error.message);
  };

  const API_KEY = core.getInput("api-key");
  const DATABASE_URL = core.getInput("database-url");
  const PROJECT_ID = core.getInput("project-id");

  const USERNAME = core.getInput("username");
  const PASSWORD = core.getInput("password");

  const firebaseConfig = {
    apiKey: API_KEY,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase
    .auth()
    .signInWithEmailAndPassword(USERNAME, PASSWORD)
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
} catch (error) {
  core.setFailed(error.message);
}