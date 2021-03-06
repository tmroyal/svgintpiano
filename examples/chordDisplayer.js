(function(){
  var piano = new SVGIntPiano("cont", { interactive: false });
  /*
<button id="CMButton">C Major</button>
    <button id="D7Button">D7</button>
    <button id="Gm9Button">GMinor9</button>
    <button id="clearButton">Clear</button>*/

  document.getElementById("CMButton").addEventListener("mousedown", ()=>{
    piano.clear();
    [60,64,67].forEach((midiNote)=>{
      piano.set(true, midiNote);
    })
  });

  document.getElementById("D7Button").addEventListener("mousedown", ()=>{
    piano.clear();
    [62, 66, 69, 72].forEach((midiNote)=>{
      piano.set(true, midiNote);
    })
  });

  document.getElementById("Gm9Button").addEventListener("mousedown", ()=>{
    piano.clear();
    [55, 58, 62, 65, 69].forEach((midiNote)=>{
      piano.set(true, midiNote);
    })
  });

  document.getElementById("clearButton").addEventListener("mousedown", ()=>{
    piano.clear();
  });

})();