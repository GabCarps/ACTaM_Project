export {drawWave, resetWave, drawSine, drawSquare, drawTriangle, drawAdsr}
const offset = canva.height / 2;
const amp = 245;
// Draw the line in the middle of the cava
function drawMidLine(drawingContext){
    drawingContext.beginPath();
    drawingContext.strokeStyle = 'rgba(0, 255, 8, 0.85)';
    drawingContext.lineWidth = 3;
    drawingContext.moveTo(0, offset);
    drawingContext.lineTo(canva.width, offset);
    drawingContext.stroke();
}

// Draw the wave passed on the canva
function drawWave(drawingContext, wave, canvaW){
    for (let i=1; i<=canvaW; i++ ){
     drawingContext.beginPath();
     drawingContext.strokeStyle = 'rgba(0, 255, 8, 0.85)';
     drawingContext.moveTo(i-1, wave[i-1]);
     drawingContext.lineTo(i, wave[i]);
     drawingContext.stroke();
     drawingContext.closePath();
     drawingContext.beginPath();
    }
    drawMidLine(drawingContext);
}

// Reset the value of the wave passed to 250, considered the 0 value
function resetWave(wave, canvaW ){
    for (let o = 0; o < canvaW; o++){
        wave[o]= offset;
    }
}

// Function to fill the wave passed with a sine with a period equal to the length of the canva
function drawSine(wave, canvaW){
    for (let i = 0; i < canvaW; i++) {
        wave[i]= offset - amp*Math.sin(i*2*Math.PI/canvaW);
    }
    wave[canvaW-1] = wave[0];
}
// Function to fill the wave with a square
function drawSquare(wave, canvaW) {
    for (let i = 0; i < canvaW; i++) {    
        let tmp = Math.sin(2 * Math.PI  * i / (canvaW-1));
        wave[i] = offset - amp * Math.sign(tmp);
    }
    wave[canvaW-1] = wave[0];
}

// Function to fill the wave with a triangle
function drawTriangle(wave, canvaW) {
  
    for (let i = 0; i < canvaW; i++) {
      let phase = (i / (canvaW - 1)) * 2;
      let tmp = 1 - 2 * Math.abs((phase % 2) - 1);
      wave[i] = offset - amp * tmp;
    }
  
    wave[canvaW - 1] = wave[0];

    for (let i = 0; i < canvaW; i++) {
        wave[i] = wave[i + 250];
        if(i >= 750) {
            wave[i] = wave[i - 750] + 245;
        }
    }
}

// Function to fill the wave passed with a adsr envelope
function drawAdsr(wave, canvaW){
    for (let i=0; i<187; i++)
        wave[i] = 250-1.33*i
    for (let i=187; i<240; i++)
        wave[i] = wave[186]+2*(i-187)
    for (let i=240; i<632; i++)
        wave[i] = wave[239]
    for (let i=632; i<777; i++)
        wave[i]=wave[631]+1*(i-632);
    for(let i=777; i<canvaW; i++) {
        wave[i] = offset;
    }
}
