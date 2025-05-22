
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

const firebaseConfig = {
apiKey: "AIzaSyD2IqZFNBkgA1x9xTMMw4Dzl1NAEqycuwM",
authDomain: "tpf-4-c19de.firebaseapp.com",
projectId: "tpf-4-c19de",
storageBucket: "tpf-4-c19de.firebasestorage.app",
messagingSenderId: "748441422831",
appId: "1:748441422831:web:4364d74ef9a36532dcc41a"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

const signInButton = document.querySelector("#signInButton");
const signOutButton = document.querySelector("#signOutButton");

const userSignIn = async () => {
    signInWithPopup(auth, provider).then((result) => {
        const user = result.user;
        console.log(user);
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailInput = document.getElementById('exampleInputEmail1');

        if (user.displayName) {
            const nameParts = user.displayName.split(' ');
            firstNameInput.value = nameParts[0] || '';
            lastNameInput.value = nameParts.slice(1).join(' ') || '';
        }
        emailInput.value = user.email || '';

        alert("You are authenticated with Google and your data has been filled");
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error: ${errorMessage}`);
    })
}

const userSignOut = async () => {
    signOut(auth).then(() => {
        alert("You have been signed out!")
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('exampleInputEmail1').value = '';
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error: ${errorMessage}`);
    })
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailInput = document.getElementById('exampleInputEmail1');

        if (user.displayName) {
            const nameParts = user.displayName.split(' ');
            firstNameInput.value = nameParts[0] || '';
            lastNameInput.value = nameParts.slice(1).join(' ') || '';
        }
        emailInput.value = user.email || '';

        alert("You are authenticated with Google");
        console.log(user);
    } else {
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('exampleInputEmail1').value = '';
    }
})

signInButton.addEventListener("click", userSignIn);
signOutButton.addEventListener("click", userSignOut);