import {drawWave, drawSine, drawSquare, drawTriangle, resetWave, drawAdsr} from "./wave_functions.js"
import {handleInput, failiure, updateDevices} from "./midi.js"
import {enter, load, clear, database} from "./database.js"
import {track} from "./track_function.js"
import {playNote} from "./playNote.js"

//inizialize variables and costants
var poistionX= 0;
var positionY = 0;
var exPositionX = 0;

var isDrawingEnvelope = false;
var isWriting = false;
var isDrawing = false;

let envelopeDuration = 1.6;

const C = 65.4075*4;

const notes = {
  'C': C,
  'C#': C*(2**(1/12)),
  'D': C*(2**(2/12)),
  'D#': C*(2**(3/12)),
  'E': C*(2**(4/12)),
  'F': C*(2**(5/12)),
  'F#': C*(2**(6/12)),
  'G': C*(2**(7/12)),
  'G#': C*(2**(8/12)),
  'A': C*(2**(9/12)),
  'A#': C*(2**(10/12)),
  'B': C*(2**(11/12)),
  'C_': C*2
};

const keys = {
  KeyA : 'C',
  KeyW : 'C#',
  KeyS : 'D',
  KeyE : 'D#',
  KeyD : 'E',
  KeyF : 'F',
  KeyT : 'F#',
  KeyG : 'G',
  KeyY : 'G#',
  KeyH : 'A',
  KeyU : 'A#',
  KeyJ : 'B',
  KeyK : 'C_'
}

let octaveFactor = 1;

//get the canva from the html and take the width and the heigth 
const canva = document.getElementById('canva');
const canvaW = canva.width;
const canvaH = canva.height;

// Setting the wave and envelope arrays
const wave = new Array(canvaW);
const envelope = new Array(canvaW+10);
resetWave(wave, canvaW)
resetWave(envelope, canvaW+10)

// Create audio and drawing context
const audioContext = new AudioContext();
const drawingContext = canva.getContext('2d');

//----------------------------------------------------------------------------- CANVA --------------------------------------------------------------------

// Event listener to draw on the canva
canva.addEventListener("mousedown", (e)=>{
  poistionX = e.offsetX;
  positionY = e.offsetY;
  isDrawing = true;
  exPositionX = poistionX;
});

canva.addEventListener("mouseup", ()=>{
  isDrawing = false;
  exPositionX = 0;
});

canva.addEventListener("mousemove", (e)=>{
  if (isDrawing == true){
    poistionX = e.offsetX;
    positionY = e.offsetY;
    track(isDrawingEnvelope, poistionX, positionY, exPositionX, envelope, wave);
    exPositionX = poistionX;
  }
});

canva.addEventListener("mouseout", ()=>{
  isDrawing = false;
});

//event listener to clear the canva with double click
canva.addEventListener("dblclick", ()=>{
  if (isDrawingEnvelope)
    resetWave(envelope,canvaW+10);
  else 
    resetWave(wave, canvaW);
})


//----------------------------------------------------------------------------- KEYBOARD --------------------------------------------------------------------

document.querySelectorAll('.key').forEach(key => {
  key.addEventListener('click', () => {
    let frequency = notes[key.dataset.note] * octaveFactor;
    playNote(frequency, 127, envelope, audioContext, canvaW, wave, envelopeDuration);
  });
});

document.addEventListener('keydown', (e) => {
  if(e.code === 'KeyZ') {
      const el = document.getElementById('octaveUp');
      if(el) {
          el.classList.add('hover');
          octaveUpFunc();
      }
  }
});

document.addEventListener('keyup', (e) => {
  if(e.code === 'KeyZ') {
      const el = document.getElementById('octaveUp');
      if(el) {
          el.classList.remove('hover');
      }
  }
});

document.addEventListener('keydown', (e) => {
  if(e.code === 'KeyX') {
      const el = document.getElementById('octaveDown');
      if(el) {
          el.classList.add('hover');
          octaveDownFunc();
      }
  }
});

document.addEventListener('keyup', (e) => {
  if(e.code === 'KeyX') {
      const el = document.getElementById('octaveDown');
      if(el) {
          el.classList.remove('hover');
      }
  }
});

document.addEventListener('keydown', (e) => {
  const keyPressed = keys[e.code];
  if(keyPressed && !isWriting) {
      const el = document.querySelector(`.key[data-note="${keyPressed}"]`);
      if(el) {
          el.classList.add('active');
          let frequency = notes[keyPressed] * octaveFactor;
          playNote(frequency, 127, envelope, audioContext, canvaW, wave, envelopeDuration)
      }
  }
});

document.addEventListener('keyup', (e) => {
  const keyPressed = keys[e.code];
  if(keyPressed && !isWriting) {
    const el = document.querySelector(`.key[data-note="${keyPressed}"]`);
    if(el) {
      el.classList.remove('active');
    }
  }
});

//----------------------------------------------------------------------------- BUTTONS --------------------------------------------------------------------
function octaveUpFunc() {
  octaveFactor = octaveFactor * 2;
}

function octaveDownFunc() {
  octaveFactor = octaveFactor / 2;
}

function envelope_wave() {
  isDrawingEnvelope=Math.abs(isDrawingEnvelope-1);
  var btn = document.getElementById("envelope_button");
  if (isDrawingEnvelope) {
    btn.innerHTML = "ENVELOPE";
  } else {
    btn.innerHTML = "WAVE";
  }
}

function drawSineWE(){
  if (isDrawingEnvelope == true)
    drawSine(envelope, canvaW)
  else
    drawSine(wave, canvaW)
};

function drawSquareWE(){
  if (isDrawingEnvelope == true)
    drawSquare(envelope, canvaW)
  else
    drawSquare(wave, canvaW)
};

function drawTriangleWE(){
  if (isDrawingEnvelope == true)
    drawTriangle(envelope, canvaW)
  else
    drawTriangle(wave, canvaW)
};

function drawAdsrWE() {
  if (isDrawingEnvelope == true)
    drawAdsr(envelope, canvaW)
}

drawAdsr(envelope, canvaW);
drawSine(wave, canvaW)

envelope_button.onclick = envelope_wave;
octaveUp.onclick = octaveUpFunc;
octaveDown.onclick = octaveDownFunc;
sine.onclick =  drawSineWE;
square.onclick = drawSquareWE;
triangle.onclick = drawTriangleWE;
adsr.onclick = drawAdsrWE;

var slider = document.getElementById("range2");

slider.oninput = function() {
  envelopeDuration = parseFloat(this.value);
}

//------------------------------------------------------------------------------ DATABASE --------------------------------------------------------------------
var enter_button = document.querySelector("#enter_button")
var load_button = document.querySelector("#load_button")
var remove_button = document.querySelector("#remove_button")

enter_button.addEventListener("click",()=>{ enter(database, waveshape_name, wave, envelope, isDrawingEnvelope)})
load_button.addEventListener("click", ()=>{load(database, waveshape_name, wave, envelope, isDrawingEnvelope)})
remove_button.addEventListener("click", ()=>{clear(database, waveshape_name)})

const textBox = document.getElementById('waveshape_name');

textBox.addEventListener("mousedown", (e)=>{
  isWriting = true
})

textBox.addEventListener("mouseout", (e)=>{
  isWriting = false
})

//----------------------------------------------------------------------------- DRAWING --------------------------------------------------------------------
// Function that keeps clearing the canva and drawing the wave periodically
function animate (){
  drawingContext.clearRect(0, 0, canvaW, canvaH);
  requestAnimationFrame(animate);
  if (isDrawingEnvelope == true)
    drawWave(drawingContext, envelope, canvaW);
  
  else
    drawWave(drawingContext, wave, canvaW);
  
}

// Calling the animating function
requestAnimationFrame(animate)

//-------------------------------------------------------------------------------- MIDI --------------------------------------------------------------------
if (navigator.requestMIDIAccess){
  navigator.requestMIDIAccess().then(success, failiure);
}
function success(midiAccess){
  midiAccess.addEventListener('statechage', updateDevices)
  console.log(0, envelopeDuration);
  const inputs = midiAccess.inputs;
  inputs.forEach((input)=>{
    console.log(inputs);
    input.addEventListener('midimessage', (e)=>{handleInput(e, envelope, audioContext, canvaW, wave, envelopeDuration)})
  })
}