function noop(){}

export default class Key {
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
      this.attachEvents();
    }
  }

  keyOn(){
    this.on = true;
    this.pubsub.trigger("keyon", this.midiNumber);
  }

  keyOff(){
    if (this.on){
      this.on = false;
      this.pubsub.trigger("keyoff", this.midiNumber);
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