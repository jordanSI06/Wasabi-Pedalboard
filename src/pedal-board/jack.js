class Jack {

  constructor() {
    this.j = "";
    this.offsetX = 0;
    this.offsetY = 0;
  }

  connexion(pedal1, pedal2) {
    this.p1 = pedal1;
    this.p2 = pedal2;

    // id
    this.id = "jack_" + this.p1.id + "_" + this.p2.id;

    this.shape1 = "";
    this.end = "";

    this.update(this.id);
  }

  repositionJack(open, _numJack) {
    this.offsetX = this.offsetY = 0;
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
      y2: (iPos.ypos[this.p2.bestInputNumber] + this.offsetY),
      zoom: this.p1.zoom
    }
    this.reviewSVGJack(_pos, _id);
  }

  /*
  From: http://stackoverflow.com/questions/6701705/programmatically-creating-an-svg-image-element-with-javascript
  I've been using the function bellow to create SVG elements and it was failing on create 
  images because of the xlink:href.

  The code bellow is corrected to do that (create any svg element on the fly)

  makeSVG('#map-tiles', 'image', { class:'map-tile', 'xlink:href':'map/xxx.jpg', width:'512px', height: '512px', x:'0', y:'0'});
  */
  // pour créer l'embout du cable
  makeSVG(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) {
      if (k == "xlink:href") el.setAttributeNS('http://www.w3.org/1999/xlink', 'href', attrs[k]);
      else el.setAttribute(k, attrs[k]);
    }
    return el;
  }

  /*
   * choice to create(if new id) or just update jack 
   */
  reviewSVGJack(_pos, _id) {
    let tension = 1;
    // if pedal 2 on the left of pedal 1
    if (_pos.x2 < _pos.x1) tension = -tension;

    let delta = (_pos.x2 - _pos.x1) * tension;
    let hx1 = _pos.x1 + delta;
    let hx2 = _pos.x2 - delta;

    let path = "M " + _pos.x1 + " " + _pos.y1 + " C " + hx1 + " " + _pos.y1 + " " + hx2 + " " + _pos.y2 + " " + _pos.x2 + " " + _pos.y2;

    let svg = PedalBoard.createSVGcanvas(this.w, this.h);
    if (_id) {
      // Main colored mid wire
      this.shape1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      this.shape1.setAttributeNS(null, "class", "wire");
      this.shape1.setAttributeNS(null, "id", _id + "_1");

      // Jack ends are images (embout) 
      this.end = this.makeSVG('image', {
        class: 'map-tile',
        //'xlink:href': '../pedalboard/img/rightJack.png',
        'xlink:href': '../img/rightJack.png',
        width: 100 + 'px',
        height: 20 + 'px',
        id: _id + "_2"
      });
      svg.appendChild(this.shape1);
      svg.appendChild(this.end);
    }

    this.shape1.setAttribute("d", path);
    this.end.setAttribute("x", _pos.x2 - 10);
    this.end.setAttribute("y", _pos.y2 - 10);
    return this;
  }
}