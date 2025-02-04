# ACTaM_Project : WEB cArPP
https://gabcarps.github.io/ACTaM_Project/ 

Made by: Gabriele Agazzi & Davide Baschieri
## OBJECTIVE
The main objective of this project is to create a web application in which the user can draw shapes and use them to control the audio buffer and the gain.

## GUI
- The main part of the graphical user interface is the canva, in which the user can draw. The canva has a line in the middle, this line rappresent the 0 value of the shape and the upper limit and the lower limit rapresents the higher and lower value we can pass to the data buffer or the gain.
in the corner of the canva we can find a button that enable the user to chage the shape they are controlling (wheter they are changing the wave or the envelope).
- In the lower part of the web page we find the keyboard, the octave up and down buttons and the envelope duration slider. The keyboard can be accessed booth by clicking with the mouse or using the computer keyboard (a, w, s, e, d, f, t, g, y, h, u, j, k), the same goes for octave up and octave down (z, x). The envelope duration slider controls how fast the shape drawn on the canva will be "read". 
- In the upper right part of the web page we find the buttons to interact with the database. we have a input text-box in which the user can write. Then they can save the shape visualized in the canva in the database with the name specified in the text-box name, load on the canva a shape with the name specified in the text-box name from the database, remove from a shape with the name specified in the text-box name from the database.
The names of shapes saved in the database will be shown in the grey part titled "Stored Waves".
- In the lower right part of the web page we find controls associated with the shapes. This buttons fills our wave or envelope (based on what the canva is set on) with a precise shape (sine, square, triange, adsr).
![Alt text](https://github.com/dbaschi/mynewrepo/blob/main/1.png)
## MOST IMPORTANT FUNCTIONS
### TRACK
In order to track the mouse moving on the canva the method .offsetX and .offsetY has been used, but this had a problem since the tracking was not costant, if a user were to draw faster they would have seen holes in the tracking. In order to avoid this a function has been developed to fill the "holes" between 2 tracked points using linear interpolation. this values are put in the waves or envelope array in order to then draw them in the canva and play
### DRAW WAVE
This function allow us to draw the shapes contained in the wave and envelope arrays on the canva. To do this we used drawing context methods to start a path, and draw a line between a point i-1 and i of our wave or envelope array. The drawing is archived by applying this to every point of our ararys.
This function is constantly called using reqeust animation also with a function to clear the canva, so our canva is kept updated with changes in the arrays.
### PLAY NOTE
This fucntion allows us to produce sound based on the wave and envelope arrays. The key factor to this is that we pick values from the wave array and put them in the audioData array. To produce a precise pitch we use a conversion factor that given the length of the canva (which is the period of the draw wave) the frequency of the note we need to produce and the sample rate, allows us to pick the right values from the wave array. The values of the waves also get normalized (since we want the content of the audio data to be between -1 and +1).
Then we start creating nodes, one of this is the gain. When playing we set the gain note values using set value curve at time and giving the normalized envelope array as a argument. In fact at the beginning of the playNote function we create a array mapping the envelope array normalized and multiplyed by the velocity (so that a higher velocity can produce a sound with higer volume).

## MIDI 
The user can easly connect their midi controller in order to play on the web application, but beware that since the objective was to use the envelope drawn on the web page only the note on trigger will be used in the app, since the note will stop when the envelope wave drawn by the user goes to 0. So letting the keys of the midi controller go won't stop the sound and keeping the keys clicked won't keep the notes going.
