function noop(){}

export default class Key {
  constructor(props){
    props = props || {};
    this.midiNumber = props.midiNumber || 0;
    this.cssPrefix = props.cssPrefix || "";
    this.keyOn = props.keyOn || noop;
    this.keyOff = props.keyOff || noop;

    this.draw();
  }

  draw(){
    console.log("draw functions here");
  }


} 