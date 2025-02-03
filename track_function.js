export {track}

// Traking function to take the positin of the pressed mouse and put the value in the wave or in the envelope
function track(isDrawingEnvelope, positionX, positionY, exPositionX, envelope, wave){
  console.log('move' +positionX +','+positionY);

  // First we check if the user is drawing the envelope or the wave
  if (isDrawingEnvelope == true){
    envelope[positionX-1] = positionY;

    // Here we check if the mouse is moving forward or backward
    if (exPositionX+1 < positionX) {
      forward_tracking(envelope, exPositionX, positionX)
    }
    if (exPositionX+1 > positionX) {
      backward_tracking(envelope, exPositionX, positionX)
    }
  } else {
    wave[positionX-1] = positionY;
    if (exPositionX+1 < positionX) {
      forward_tracking(wave, exPositionX, positionX)
    }
    if (exPositionX+1 > positionX) {
      backward_tracking(wave, exPositionX, positionX)
    }
  }
}

// Functions to track the mouse when moving foreward and backward 
// We use this function to fill the gaps in the traking, since the offsetX offsetY method don't track perfectly we
// linearly interpolate between tracked point: between exPositionX and positionX
function forward_tracking(wave, exPositionX, positionX){
  for (let i = exPositionX; i<positionX; i ++){
    wave[i] = wave[exPositionX-1] + (i-exPositionX+1)*(wave[exPositionX-1]-wave[positionX-1])/(exPositionX-positionX);
  }
}

function backward_tracking(wave, exPositionX, positionX){
  for (let i = exPositionX; i>positionX; i --){
    wave[i] = wave[exPositionX-1] + (i-exPositionX+1)*(wave[exPositionX-1]-wave[positionX-1])/(exPositionX-positionX);
  }
}