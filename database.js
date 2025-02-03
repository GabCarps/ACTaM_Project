export {enter, load, clear, database}

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {getDatabase, set, get, remove, ref, child, onChildAdded, onChildChanged, onChildRemoved} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCQecj6XO4xbtwDljJhiNvAYrXcIyFV2ic",
    authDomain: "carps-24c29.firebaseapp.com",
    databaseURL: "https://carps-24c29-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "carps-24c29",
    storageBucket: "carps-24c29.firebasestorage.app",
    messagingSenderId: "842885254902",
    appId: "1:842885254902:web:8264d82600d0e64bb626d7",
    measurementId: "G-C7YDBKVDNS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database= getDatabase(app); 
const soundsList = document.getElementById("sounds");

// Function to save a wave in the database, it will save the wave that the user sees in the canva 
// with the name written in the text box
function enter(database, waveShapeName, wave, envelope, isDrawingEnvelope){
  if (waveShapeName.value.trim() !== ""){
    if (isDrawingEnvelope){
      set(ref(database,"Sounds/" + waveShapeName.value),{
        Shape: envelope
      })
      .then(()=>{alert("wave and envelope save succesfully")})
      .catch((error)=>{
        alert(error)
      })
    } else {
      set(ref(database,"Sounds/" + waveShapeName.value),{
        Shape: wave
      })
      .then(()=>{alert("wave and envelope save succesfully")})
      .catch((error)=>{
        alert(error)
      })
    }
  }
}


// Function to load a wave from the database with a the name specified in the text box
function load(database, waveShapeName, wave, envelope, isDrawingEnvelope){
  const databaseReference = ref(database);

  get(child(databaseReference, "Sounds/" + waveShapeName.value))
  .then((snapshot)=>{
    if (snapshot.exists()){
      let o =[];
      o = snapshot.val().Shape;
      if (isDrawingEnvelope){
        for (let i = 0; i<o.length; i++)
          envelope[i] = parseFloat(o[i])
      } else {
        for (let i = 0; i<o.length; i++)
          wave[i] = parseFloat(o[i])
      }
      alert("data loaded succesfully")
    }
    else{
      alert("no data found")
    }
  })
  .catch((error)=>{
    alert(error)
  })
}

// Function that delete the wave saved with the name specified in the text box from the database
function clear(database, waveShapeName){
  if (waveShapeName.value.trim() !== ""){
    const databaseReference = ref(database);

    get(child(databaseReference, "Sounds/" + waveShapeName.value))
    .then((snapshot)=>{
      if (snapshot.exists()){
        remove(ref(database, "Sounds/" + waveShapeName.value))
        .then(()=>{
          alert("data removed succesfully");
        })
        .catch((error)=>{
         alert(error)
        })
      } else{
        alert("no data found")
      }
    })
  }
}


/* onChildAdded, onChildChanged, onChildRemoved */
// Funzione per aggiornare la lista in tempo reale
function liveState() {
  const soundsRef = ref(database, "Sounds/");

  // Aggiungere un nuovo elemento alla lista
  onChildAdded(soundsRef, (snapshot) => {
    const soundName = snapshot.key;
    const li = document.createElement("li");
    li.id = soundName;
    li.textContent = soundName;
    soundsList.appendChild(li);
  });

  // Aggiornare un elemento modificato
  onChildChanged(soundsRef, (snapshot) => {
    const soundName = snapshot.key;
    const li = document.getElementById(soundName);
    if (li) {
      li.textContent = soundName;
    }
  });

  // Rimuovere un elemento eliminato
  onChildRemoved(soundsRef, (snapshot) => {
    const li = document.getElementById(snapshot.key);
    if (li) {
      li.remove();
    }
  });
}

liveState();
