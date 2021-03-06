import Key from "./key"
import PubSub from "./pubsub"

const svg_ns = 'http://www.w3.org/2000/svg';
const WHITE_PCS = [0, 2, 4, 5, 7, 9, 11];

export default class SVGPiano{
  constructor(elementName, props){
    props = props || {};
    this.ensurePropsContainData(props);

    this.pubsub = new PubSub(["keyon", "keyoff"]);

    this.keys = {};
    this.setupSVG(elementName, props);
    this.setupKeys(props);

    this.lowNote = props.lowNote;
    this.highNote = props.highNote;
  }

  ensurePropsContainData(props){
    // set defaults if they do not exist
    props.lowNote = props.lowNote || 48;
    props.highNote = props.highNote || 72;
    props.margin = props.margin || 1;
    props.whiteKeySpacing = props.whiteKeySpacing || 1;
    props.blackKeyVScale = props.blackKeyVScale || 0.668;
    props.blackKeyHScale = props.blackKeyHScale || 0.55;
    props.width = props.width || 500;
    props.height = props.height || 180;
    props.cssClassPrefix = props.cssClassPrefix || 'svgkey';

    if (!props.hasOwnProperty("interactive")){
      props.interactive = true;
    }

    if (props.lowNote > props.highNote){
      console.warn("SVGIntPiano: improperly specified lowNote and/or highNote")
      props.highNote = props.lowNote;
    }
  }

  set(state, midiNum){
    if (midiNum >= this.lowNote && midiNum <= this.highNote){
      this.keys[midiNum].set(state);
    } else {
      console.warn("Midi number out of range: "+midiNum);
    }
  }

  clear(){
    for (let i = this.lowNote; i <= this.highNote; i++){
      this.keys[i].set(false);
    }
  }

  subscribe(eventType, callback){
    return this.pubsub.subscribe(eventType, callback);
  }

  unsubscribe(eventType, key){
    return this.pubsub.unsubscribe(eventType, key);
  }
  
  setupSVG(elementName, props){
    this.container = document.getElementById(elementName);

    this.svg = document.createElementNS(svg_ns, 'svg');
    this.svg.setAttributeNS(null, 'width', props.width);
    this.svg.setAttributeNS(null, 'height', props.height);

    this.container.appendChild(this.svg);
  }

  calcNumWhiteKeys(props){
    let sum = 0;

    for (let currentNote = props.lowNote; currentNote <= props.highNote; currentNote++){
      if (WHITE_PCS.includes(currentNote % 12)){ sum += 1 }
    }

    return sum;
  }

  /* 
    We determine available width of white keys using:

      available width = width of svg - 2*margin - white key spacing * gaps between keys

    Where the gaps between keys is (numWhiteKeys-1): (we dont include outer gaps)

    We divide this by numWhiteKeys to get the white key width
  */
  calcWhiteKeyWidth(numWhiteKeys, props){
    return (props.width - 2*props.margin - (numWhiteKeys-1)*props.whiteKeySpacing) / numWhiteKeys;
  }

  setupWhiteKeys(props, whiteKeyWidth, whiteKeyHeight){

    const key_props = {
      width: whiteKeyWidth,
      height: whiteKeyHeight,
      x: props.margin,
      y: props.margin,
      midiNumber: 0,
      cssInactiveName: props.cssClassPrefix + "_off",
      cssActiveName: props.cssClassPrefix + "_on",
      interactive: props.interactive
    }

    let currentKey = 0;

    for (let currentNote = props.lowNote; currentNote <= props.highNote; currentNote++){

      if (WHITE_PCS.includes(currentNote % 12)){
        key_props.x = props.margin + currentKey*(whiteKeyWidth+props.whiteKeySpacing);
        key_props.midiNumber = currentNote;

        this.keys[currentNote] = new Key(this.svg, svg_ns, key_props, this.pubsub);

        currentKey += 1;
      }

    }
  }

  // we increment through all available keys. 
  // if we encouter a white key, increment white 
  // key index "currentWhiteKey". Else, setup a black key
  // at the place where whitekey would be, minus
  // 1/2 black key width
  setupBlackKeys(props, blackKeyWidth, blackKeyHeight, whiteKeyWidth){
    const key_props = {
      width: blackKeyWidth,
      height: blackKeyHeight,
      x: props.margin,
      y: props.margin,
      midiNumber: 0,
      cssInactiveName: props.cssClassPrefix + "_black_off",
      cssActiveName: props.cssClassPrefix + "_black_on",
      interactive: props.interactive
    }

    let currentWhiteKey = 0;

    for (let currentNote = props.lowNote; currentNote <= props.highNote; currentNote++){

      if (WHITE_PCS.includes(currentNote % 12)){
        currentWhiteKey += 1;
      } else {
        let whiteKeyX = props.margin + currentWhiteKey*(whiteKeyWidth+props.whiteKeySpacing);
        key_props.x = whiteKeyX - blackKeyWidth/2 - props.whiteKeySpacing/2;
        key_props.midiNumber = currentNote;

        this.keys[currentNote] = new Key(this.svg, svg_ns, key_props, this.pubsub);
      }

    }
  }

  setupKeys(props){
    const numWhiteKeys = this.calcNumWhiteKeys(props);
    const whiteKeyWidth = this.calcWhiteKeyWidth(numWhiteKeys, props);
    const whiteKeyHeight = props.height - 2*props.margin;
    const blackKeyHeight = whiteKeyHeight * props.blackKeyVScale;
    const blackKeyWidth = whiteKeyWidth * props.blackKeyHScale;

    this.setupWhiteKeys(props, whiteKeyWidth, whiteKeyHeight);
    this.setupBlackKeys(props, blackKeyWidth, blackKeyHeight, whiteKeyWidth);
  }
}

// TODO: private methods of SVGPiano