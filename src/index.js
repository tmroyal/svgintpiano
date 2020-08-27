import Key from "./key"

const svg_ns = 'http://www.w3.org/2000/svg';

export default class SVGPiano{
  constructor(elementName, props){
    props = props || {};
    this.keys = [];
    this.setupSVG(elementName, props);
    this.setupKeys();
  }

  setupSVG(elementName, props){
    this.container = document.getElementById(elementName);

    this.svg = document.createElementNS(svg_ns, 'svg');
    this.svg.setAttributeNS(null, 'width', props.width || '500px');
    this.svg.setAttributeNS(null, 'height', props.height || '180px');

    this.container.appendChild(this.svg);
  }

  setupKeys(){
    const key_props = {
      width: 50,
      height: 180,
      x: 20
    }

    this.keys.push(new Key(this.svg, svg_ns, key_props));
  }
}