const OCTAVE_DISPLACEMENT = 2;
const BREAK_EVERY_X_NOTES = 16;
const BEAM_EVERY_X_NOTES = 4;

/**
 * convertToAbcString - Converts an array of notes into the ABC string format
 * 
 * @param {[]} data - array of note numbers
 * @returns {string} - abcjs string format
 */

function convertToAbcString(data) {
    // Headers (4/4 in semi quavers)
    let compiled = "M: 4/4\n" + "L: 1/16\n";
    let noteCount = 1;
    // Process each note number in the data
    for(let i=0; i < data.length; i++) {
        // Convert into the ABC string format
        compiled = compiled + convertNumberToNote(data[i])
        // Beam every X notes
        if (noteCount % BEAM_EVERY_X_NOTES === 0) compiled = compiled + " ";
        // Draw a barline every X notes
        if (noteCount % BREAK_EVERY_X_NOTES == 0) compiled = compiled + '|\n'
        // Note counter
        noteCount++;
    }
    return compiled;
}


/**
 * convertNumberToNote - Converts midi note number to readable note name
 * 
 * @param {*} number - midi note number
 * @returns 
 */

function convertNumberToNote(number) {
    if (number < 0 || number > 127) return;
    let noteNames = []
    let octave = ""
    if (number < 72) noteNames = ['C', '^C', 'D', '^D', 'E', 'F', '^F', 'G', '^G', 'A', '^A', 'B'];
    if (number >= 72) noteNames = ['c', '^c', 'd', '^d', 'e', 'f', '^f', 'g', '^g', 'a', '^a', 'b'];

    if (number < 60 && number >= 48) octave = ','
    if (number < 48 && number >= 36) octave = ',,'
    if (number < 36 && number >= 24) octave = ',,,'
    if (number < 24 && number >= 12) octave = ',,,,'

    if (number < 84 && number >= 72) octave = ''
    if (number < 96 && number >= 84) octave = '\''
    if (number < 108 && number >= 96) octave = '\'\''
    if (number < 110 && number >= 108) octave = '\'\'\''

    //octave = (4 - Math.floor(number / 12)) * ',';
    
    return noteNames[number % 12] + octave.toString() +'';
}


/**
 * generateScale - Generates the scales!
 * 
 * @param 
 * @returns 
 */

function generateScale(divisions, start, notes, interpolation, interpolationInterval) {
    if (divisions <= 0) return;
    //if (start <= 0) return;
    if (notes <= 0) return;

    console.log(interpolationInterval)

    let myArray2 = [];
    /*for(x = (40 + start); x < (40 + start + notes); x = (x + divisions)) {
        myArray2.push(x);
    }*/

    let count = start + 48;
    for (i = 0; i < notes; i++) {
        
        // base note
        myArray2.push(count + (i * divisions));

        //console.log("BASE:" + (count + (i * divisions)));
        //console.log("INTER:" + interpolation)
        // interpolations
        for (x = 0; x < interpolation; x++) {
            myArray2.push(count + (i * divisions) + interpolationInterval[x]);
            // from the base note,
            //console.log(count + (i * divisions) + interpolationInterval[x])
        }
    }
    //console.log(myArray2);
    return myArray2; 
}






function play() {
    if (ABCJS.synth.supportsAudio()) {

        const divisions = parseInt(divisionInput.value);
        const starting = parseInt(startingNote.value)
        const notes = parseInt(numberOfNotes.value)
        const interpolation = parseInt(interpolationInput.value)
        const interpolationInterval = [parseInt(interpolationIntervalInput1.value), parseInt(interpolationIntervalInput2.value), parseInt(interpolationIntervalInput3.value), parseInt(interpolationIntervalInput4.value)]
       
        disableInterpolationInputs(interpolation)
        
        let noteArray = generateScale(divisions, starting, notes, interpolation, interpolationInterval);
        if (descending.checked===true) noteArray.reverse();

      var abc = convertToAbcString(noteArray);
      var visualObj = ABCJS.renderAbc("*", abc)[0];

      var midiBuffer = new ABCJS.synth.CreateSynth();
      midiBuffer.init({
        //audioContext: new AudioContext(),
        visualObj: visualObj,
        // sequence: [],
        millisecondsPerMeasure: 2000,
        // debugCallback: function(message) { console.log(message) },
        options: {
          // soundFontUrl: "https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/" ,
          // sequenceCallback: function(noteMapTracks, callbackContext) { return noteMapTracks; },
          // callbackContext: this,
          // onEnded: function(callbackContext),
          // pan: [ -0.5, 0.5 ]
        }
      }).then(function (response) {
        console.log(response);
        midiBuffer.prime().then(function (response) {
          midiBuffer.start();
        });
      }).catch(function (error) {
        console.warn("Audio problem:", error);
      });
    } else {
      document.querySelector(".error").innerHTML = "<div class='audio-error'>Audio is not supported in this browser.</div>";
    }
  }





const divisionInput = document.getElementById("divisions-input");
const startingNote = document.getElementById("starting-input");
const numberOfNotes = document.getElementById("notes-input");
const interpolationInput = document.getElementById("interpolation-input");
const interpolationIntervalInput1 = document.getElementById("interpolation-interval-input1");
const interpolationIntervalInput2 = document.getElementById("interpolation-interval-input2");
const interpolationIntervalInput3 = document.getElementById("interpolation-interval-input3");
const interpolationIntervalInput4 = document.getElementById("interpolation-interval-input4");
const descending = document.getElementById("descending");


function disableInterpolationInputs(number) {

    console.log("NUMBER IS" + number)

    interpolationIntervalInput1.disabled = true;
    interpolationIntervalInput2.disabled = true;
    interpolationIntervalInput3.disabled = true;
    interpolationIntervalInput4.disabled = true;


    if(number >= 4) interpolationIntervalInput4.disabled = false;
    if(number >= 3) interpolationIntervalInput3.disabled = false;
    if(number >= 2) interpolationIntervalInput2.disabled = false;
    if(number >= 1) interpolationIntervalInput1.disabled = false;


}



function loading2() {

    const divisions = parseInt(divisionInput.value);
    const starting = parseInt(startingNote.value)
    const notes = parseInt(numberOfNotes.value)
    const interpolation = parseInt(interpolationInput.value)
    const interpolationInterval = [parseInt(interpolationIntervalInput1.value), parseInt(interpolationIntervalInput2.value), parseInt(interpolationIntervalInput3.value), parseInt(interpolationIntervalInput4.value)]
   
    disableInterpolationInputs(interpolation)

    let noteArray = generateScale(divisions, starting, notes, interpolation, interpolationInterval);
    if (descending.checked===true) noteArray.reverse();
    
    const abcString = convertToAbcString(noteArray);
    var visualOptions = { responsive: 'resize' };
    var visualObj = ABCJS.renderAbc("paper", abcString, visualOptions);
}

