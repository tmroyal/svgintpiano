var low = 60;
var high = 84;
var piano = new SVGIntPiano("cont",{
  lowNote: low,
  highNote: high
});

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var gain = audioCtx.createGain();
gain.connect(audioCtx.destination);
gain.gain.value = 0.1;

var midicps = (midi)=>{
  return 440*Math.pow(2, (midi-69)/12);
};

var oscs = {};

piano.subscribe("keyon", (mn)=>{
  oscs[mn] = audioCtx.createOscillator();
  oscs[mn].connect(gain);
  oscs[mn].type = 'sine';
  oscs[mn].frequency.value = midicps(mn);
  oscs[mn].start();
});

piano.subscribe("keyoff", (mn)=>{
  oscs[mn].stop();
})
