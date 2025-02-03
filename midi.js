export {handleInput, failiure, updateDevices}
import {playNote} from "./playNote.js"

// Function to handle the midi input
function handleInput(input, envelope, audioContext, canvaW, wave, envelopeDuration){
  const command = input.data[0];
  const note = input.data[1];
  const velocity = input.data[2];
  console.log(1, envelopeDuration);
  
  switch (command) {
    case 144:
    if(velocity>0){
      noteOn(note, velocity, envelope, audioContext, canvaW, wave, envelopeDuration)
    } else{
      noteOff(note);
    }
  
    break;
    case 128:
    noteOff(note);
    break;
  }
}

// Function used when a note on midi message arrives
function noteOn(note, velocity, envelope, audioContext, canvaW, wave, envelopeDuration){
  console.log(note, velocity, envelopeDuration);

  // Convert the midi note number in a frequency value
  let frequency= 440.000*Math.pow(2,((note-69)/12));
  
  // Sart the note
  playNote(frequency, velocity, envelope, audioContext, canvaW, wave, envelopeDuration)
}

// Note off function we won't use since the duration of the note is based on the envelope and envelope duration
function noteOff(note){
  console.log(note)
}

// Function to check for midi devices 
function updateDevices(event){
  console.log(`Name: ${event.port.name},Brand: ${event.port.manufacturer}, State, ${event.port.state}, Type: ${event.port.type}`)
}

// Function in for midi error connection
function failiure(){
  console.log('could not connect MIDI')
}