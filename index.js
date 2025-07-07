import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  app,
} from "./firebaseAuth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const appSettings = {
  databaseURL:
    "https://todoapp-da79d-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// const app = initializeApp(appSettings)
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");
const signInButton = document.getElementById("sign-in-button");
const signOutButton = document.getElementById("sign-out-button");
const userProfilePic = document.getElementById("user-profile-pic");
const userName = document.getElementById("user-name");
const deadlineFieldEl = document.getElementById("deadline-field");

let currentUser = null; // Variable to store the current authenticated user

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user; // Store the user object
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log("User signed in:", user);
    if (userProfilePic) userProfilePic.src = user.photoURL;
    if (userName) userName.textContent = user.displayName;

    // Redirect to index.html if on Wellcome.html or root path
    if (
      window.location.pathname.endsWith("Wellcome.html") ||
      window.location.pathname === "/"
    ) {
      window.location.href = "index.html";
      return;
    }

    if (document.body.classList.contains("logged-out")) {
      document.body.classList.remove("logged-out");
    }
    if (!document.body.classList.contains("logged-in")) {
      document.body.classList.add("logged-in");
    }

    if (userProfilePic) userProfilePic.style.display = "inline-block";
    if (userName) userName.style.display = "inline-block";
    if (signOutButton) signOutButton.style.display = "inline-block";
    // ...
  } else {
    currentUser = null; // Clear user object on sign out
    // User is signed out
    console.log("User signed out");
    if (
      window.location.pathname.endsWith("index.html") ||
      window.location.pathname === "/"
    ) {
      window.location.href = "Wellcome.html";
    }
  }
});

if (signInButton) {
  console.log("Sign In Button Found");
  signInButton.addEventListener("click", () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available in result.additionalUserInfo.profile
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email =
          error.customData && error.customData.email
            ? error.customData.email
            : "N/A";
        console.error(
          "Google Sign-In Error:",
          errorCode,
          errorMessage,
          "Email:",
          email
        );
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  });
}

if (signOutButton) {
  signOutButton.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
        console.error("Error signing out:", error);
      });
  });
}

inputFieldEl.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addButtonEl.click();
  }
});

deadlineFieldEl.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addButtonEl.click();
  }
});

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value.trim();
  let deadlineValue = deadlineFieldEl.value;

  if (inputValue === "" || !currentUser) {
    // Optionally, alert the user if they are not signed in or input is empty
    alert("Please sign in and enter a task!");
    return;
  }

  const taskData = {
    text: inputValue,
    userId: currentUser.uid,
    userName: currentUser.displayName || "Anonymous",
    deadline: deadlineValue,
    status: "pending", // Initial status
  };

  push(shoppingListInDB, taskData);
  clearInputFieldEl();
  deadlineFieldEl.value = ""; // Clear the deadline field
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];

      appendItemToShoppingListEl(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = `<span style="color: #ac7256; font-style: italic; font-size: 18px;">No items here... yet</span>`;
  }
});

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function appendItemToShoppingListEl(item) {
  let itemID = item[0];
  let itemData = item[1]; // Now itemData is an object

  let newEl = document.createElement("li");

  let userTag = itemData.userName
    ? `<span class="user-tag">@${itemData.userName.split(" ")[0]}</span>`
    : "";
  let deadlineDisplay = itemData.deadline
    ? `<span class="deadline">Due: ${itemData.deadline}</span>`
    : "";

  newEl.innerHTML = `${itemData.text} ${userTag} ${deadlineDisplay}`;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDB);
  });

  shoppingListEl.append(newEl);
}