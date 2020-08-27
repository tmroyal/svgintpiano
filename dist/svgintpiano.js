(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SVGIntPiano = factory());
}(this, (function () { 'use strict';

  function noop(){}

  class Key {
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
      this.rect.setAttributeNS(null, 'y', 0);
      this.rect.className.baseVal = this.cssInactiveName;

      svg.appendChild(this.rect);
    }

  }

  const svg_ns = 'http://www.w3.org/2000/svg';

  class SVGPiano{
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
      };

      this.keys.push(new Key(this.svg, svg_ns, key_props));
    }
  }

  return SVGPiano;

})));
