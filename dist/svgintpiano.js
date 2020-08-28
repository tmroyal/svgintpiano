(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SVGIntPiano = factory());
}(this, (function () { 'use strict';

  class Key {
    constructor(svg, ns, props, pubsub){
      if (!props || !svg || !ns || !pubsub){
        throw '"Key" object requires propeties, svg, pubsub, and namespace';
      } else {
        // TODO: throw error if keys are missing
        this.midiNumber = props.midiNumber || 0;
        this.cssInactiveName = props.cssInactiveName || "svgkey_off";
        this.cssActiveName = props.cssActiveName || "svgkey_on";
        this.pubsub = pubsub;
        this.on = false;

        this.draw(svg, ns, props);
        if (props.interactive){
          this.attachEvents();
        }
      }
    }

    keyOn(){
      this.on = true;
      this.pubsub.trigger("keyon", this.midiNumber);
      this.rect.className.baseVal = this.cssActiveName;
    }

    keyOff(){
      if (this.on){
        this.on = false;
        this.pubsub.trigger("keyoff", this.midiNumber);
        this.rect.className.baseVal = this.cssInactiveName;
      }
    }

    set(state){
      if (state === "on" || state){
        this.rect.className.baseVal = this.cssActiveName;
      } else if (state === "off" || !state){
        this.rect.className.baseVal = this.cssInactiveName;
      }
    }

    attachEvents(){
      this.rect.onmousedown = this.keyOn.bind(this);
      this.rect.onmouseup = this.keyOff.bind(this);

      this.rect.onmouseenter = (function(e){
        if (e.buttons > 0){
          this.keyOn();
        }
      }).bind(this);

      this.rect.onmouseleave = (function(e){
        if (e.buttons > 0){
          this.keyOff();
        }
      }).bind(this);

    }

    draw(svg, ns, props){
      this.rect = document.createElementNS(ns, 'rect');
      this.rect.setAttributeNS(null, 'width', props.width || 0);
      this.rect.setAttributeNS(null, 'height', props.height || 0);
      this.rect.setAttributeNS(null, 'x', props.x || 0);
      // y is always drawn from the top
      this.rect.setAttributeNS(null, 'y', props.y || 0);
      this.rect.className.baseVal = this.cssInactiveName;

      svg.appendChild(this.rect);
    }

  } 

  // now, attach events

  // simple ad hoc pubsub
  // designed only for this use case
  // so as to remain dependency free

  class PubSub {

    constructor(eventNames){
      this.eventNames = eventNames || [];
      this.events = {};
      this.nextId = 0;

      if (this.eventNames.constructor != Array){
        this.eventNames = [this.eventNames];
      }

      this.eventNames.forEach((eventName)=>{
        this.events[eventName] = [];
      });
    }
    subscribe(eventName, func){ 
      if (!this.eventNames.includes(eventName)){
        return null;
      } else {
        this.nextId += 1;

        this.events[eventName].push({
          id: this.nextId,
          func: func
        });
        
        return String(this.nextId);
      }
    }

    unsubscribe(eventName, key){
      if (!this.eventNames.includes(eventName)){
        return false;
      } else {
        const ind = this.events[eventName].findIndex((ev)=>{
          return ev.id == key;
        });

        if (ind >= 0){
          this.events[eventName].splice(ind, 1);
          return true
        } else {
          return false;
        }
      }
    }

    trigger(eventName, arg){
      if (this.eventNames.includes(eventName)){
        this.events[eventName].forEach((ev)=>{
            ev.func(arg);
        });
      }
    }

  }

  const svg_ns = 'http://www.w3.org/2000/svg';
  const WHITE_PCS = [0, 2, 4, 5, 7, 9, 11];

  class SVGPiano{
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
        console.warn("SVGIntPiano: improperly specified lowNote and/or highNote");
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
        if (WHITE_PCS.includes(currentNote % 12)){ sum += 1; }
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
      };

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
      };

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

  return SVGPiano;

})));
