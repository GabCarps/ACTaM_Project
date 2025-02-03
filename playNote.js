export {playNote}

// Funciton that plays the note
function playNote(note, velocity, envelope, audioContext, canvaW, wave, envelopeDuration) {
  // Create a normalized envelope multiplied by the velocity of the note
  const env= envelope.map(i => (250-i)/110000*velocity);
  console.log(envelopeDuration);
  // Create the audio buffer and the audio data
  const b = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
  var audioData = b.getChannelData(b);

  // Calculate alpha, a conversion factor we'll use to pick the correct values from the wave array
  // based on the frequency of the note we have to play
  const alpha = canvaW*note/audioContext.sampleRate;

  // Add the value from the wave to the audio data
  for(var i=0; i<audioData.length; i++) {
    let k = Math.round(alpha*i)%(canvaW-1);
    audioData[i] = (250-wave[k])/250;
  }

  // Create the nodes, connect them and start the sound
  const gain = audioContext.createGain();
  const bs = audioContext.createBufferSource();
  bs.connect(gain);
  gain.connect(audioContext.destination);
  bs.buffer = b;
  bs.start();

  // Change the gain using our envelope
  const now = audioContext.currentTime;
  gain.gain.setValueCurveAtTime(env, now, envelopeDuration);
  gain.gain.setValueAtTime(0, now+envelopeDuration)
}
