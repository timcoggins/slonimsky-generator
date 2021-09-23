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









function load() {

    myArray = [];
    for(x = 50; x < 90; x++) {
        myArray.push(x);
    }

    const abcString = convertToAbcString(myArray)
    var visualOptions = { responsive: 'resize' };
    var visualObj = ABCJS.renderAbc("paper", abcString, visualOptions);
}

function loading2() {

    myArray2 = [];
    for(x = 40; x < 100; x=x+5) {
        myArray2.push(x);
    }

    const abcString = convertToAbcString(myArray2)
    var visualOptions = { responsive: 'resize' };
    var visualObj = ABCJS.renderAbc("paper", abcString, visualOptions);
}








/*
function convertNumberToNote(number) {
    if (number < 0 || number > 127) return;
    noteNames = ['c\'\'', '^C', 'D', '^D', 'E', 'F', '^F', 'G', '^G', 'A', '^A', 'B']
    const octave = Math.floor(number / 12) - 1 + OCTAVE_DISPLACEMENT;
    return noteNames[number % 12] + octave.toString();
}*/



// C4 is C, C3 is C, C2 is C,, C1 is C,,,
// C5 is c C6 is c\'  C7 is c\'\ C8 is c\'\'\'

