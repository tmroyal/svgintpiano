function noop(){}

export default class Key {
  constructor(svg, ns, props){
    if (!props || !svg || !ns){
      throw '"Key" object requires propeties, svg, and namespace';
    } else {
      // TODO: throw error if keys are missing
      this.midiNumber = props.midiNumber || 0;
      this.cssInactiveName = props.cssInactiveName || "svgkey_off";
      this.cssActiveName = props.cssActiveName || "svgkey_on";
      this.keyOn = props.keyOn || noop;
      this.keyOff = props.keyOff || noop;

      this.draw(svg, ns, props);
    }
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