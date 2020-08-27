function noop(){}

export default class Key {
  constructor(element, ns, props){
    if (!props || !element || !ns){
      throw '"Key" object requires propeties, element, and namespace';
    } else {
      // TODO: throw error if keys are missing
      this.midiNumber = props.midiNumber || 0;
      this.cssInactiveName = props.cssInactiveName || "svgkey_off";
      this.cssActiveName = props.cssActiveName || "svgkey_on";
      this.keyOn = props.keyOn || noop;
      this.keyOff = props.keyOff || noop;

      this.setObj(element, ns, props);
    }
  }

  draw(element, ns, props){
    this.rect = document.createElementNS(ns, 'rect');
    this.rect.setAttributeNS(null, 'width', props.width || 0);
    this.rect.setAttributeNS(null, 'height', props.height || 0);
    this.rect.className.baseVal = this.cssInactiveName;
  }

} 