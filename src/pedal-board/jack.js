class Jack {

  constructor() {
    this.j = "";
    this.shape1 = "";
    this.end = "";
    this.offsetX = 0;
    this.offsetY = 0;
  }

  connexion(pedal1, pedal2) {
    this.p1 = pedal1;
    this.p2 = pedal2;
    this.id = `jack_${this.p1.id}_${this.p2.id}`;

    this.update(this.id);
  }

  repositionJack(open, _numJack) {
    if (open) {
      this.offsetX = -100;
      this.offsetY = 50 * _numJack;
    }
    this.update();
  }

  // Compute the svg for this jack
  update(_id) {
    let oPos = this.p1.getOutputPos();
    let iPos = this.p2.getInputPos();
    let _pos = {
      x1: oPos.xpos[this.p1.bestOutputNumber],
      y1: oPos.ypos[this.p1.bestOutputNumber],
      x2: (iPos.xpos[this.p2.bestInputNumber] + this.offsetX),
      y2: (iPos.ypos[this.p2.bestInputNumber] + this.offsetY)
    }
    this.reviewSVGJack(_pos, _id);
  }

  reviewSVGJack(_pos, _id) {
    //choice to create (if new id) or just update jack 
    if (_id) {
      this.shape1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      this.shape1.setAttributeNS(null, "class", "wire");
      this.shape1.setAttributeNS(null, "id", `${_id}_1`);
      // Jack ends are images (embout) 
      // you can use "makeSVG" from: http://stackoverflow.com/questions/6701705/programmatically-creating-an-svg-image-element-with-javascript
      this.end = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      this.end.setAttribute('class', `map-tile`);
      this.end.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `../img/rightJack.png`); // '../pedalboard/img/rightJack.png'
      this.end.setAttribute('width', `${100}px`);
      this.end.setAttribute('height', `${20}px`);
      this.end.setAttribute('id', `${_id}_2`);
      
      let svg = PedalBoard.createSVGcanvas();
      svg.appendChild(this.shape1);
      svg.appendChild(this.end);
    }

    // if pedal 2 on the left of pedal 1
    let delta = (_pos.x2 - _pos.x1) * ((_pos.x2 < _pos.x1) ? -1 : 1);
    let path = `M ${_pos.x1} ${_pos.y1} C ${_pos.x1 + delta}  ${_pos.y1} ${_pos.x2 - delta} ${_pos.y2} ${_pos.x2} ${_pos.y2}`;

    this.shape1.setAttribute("d", path);
    this.end.setAttribute("x", _pos.x2 - 10);
    this.end.setAttribute("y", _pos.y2 - 10);
    return this;
  }
}