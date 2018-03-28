class Jack {
  constructor() {
    this.j = "";
  }
  connexion(pedal1, pedal2) {
    this.p1 = pedal1;
    this.p2 = pedal2;

    // Compute the svg for this jack
    let oPos = pedal1.getOutputPos();
    let x1 = oPos.x,
      y1 = oPos.y;

    let iPos = pedal2.getInputPos();
    let x2 = iPos.x,
      y2 = iPos.y;

    this.id = "jack_" + pedal1.id + "_" + pedal2.id;

    this.shape1 = "";
    this.shape2 = "";
    this.shape3 = "";
    this.end = "";

    let _pos = {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2
    }
    this.reviewSVGJack(_pos, this.id);
  }

  update() {
    let oPos = this.p1.getOutputPos();
    let x1 = oPos.x,
      y1 = oPos.y;
    let iPos = this.p2.getInputPos();
    let x2 = iPos.x,
      y2 = iPos.y;

    let _pos = {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2
    }

    this.reviewSVGJack(_pos);
  }

  repositionJack(offsetY, open) {
    let pedalboard = this.p1.pedalboard;
    let posPedal1 = this.p1.getOutputPos();
    let posPedal2 = this.p2.getInputPos();

    let wid = 0;
    if (open) wid = 70;
    let offestX = -(wid / (pedalboard.zoom + 1));
    let _pos = {
      x1: posPedal1.x,
      y1: posPedal1.y,
      x2: (posPedal2.x + offestX),
      y2: (posPedal2.y + offsetY)
    }
    this.reviewSVGJack(_pos);
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
    this.dataZoom = 0.5;

    let tension = 1;
    // if pedal 2 on the left of pedal 1
    if (_pos.x2 < _pos.x1) tension = -tension;

    let delta = (_pos.x2 - _pos.x1) * tension;

    let hx1 = _pos.x1 + delta;
    let hy1 = _pos.y1;
    let hx2 = _pos.x2 - delta;
    let hy2 = _pos.y2;

    let path = "M " + _pos.x1 + " " + _pos.y1 + " C " + hx1 + " " + hy1 + " " + hx2 + " " + hy2 +
      " " + _pos.x2 + " " + _pos.y2;

    let svg = PedalBoard.createSVGcanvas(this.w, this.h);
    if (_id) {
      this.shape1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      this.shape2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      this.shape3 = document.createElementNS("http://www.w3.org/2000/svg", "path");

      // External wire
      this.shape1.setAttributeNS(null, "fill", "none");
      this.shape1.setAttributeNS(null, "stroke", "#471221");
      this.shape1.setAttributeNS(null, "stroke-width", 10 * this.dataZoom);
      this.shape1.setAttributeNS(null, "class", "wire");
      this.shape1.setAttributeNS(null, "id", _id + "_1");

      // Main colored mid wire
      this.shape2.setAttributeNS(null, "fill", "none");
      this.shape2.setAttributeNS(null, "stroke", "#8e457d");
      // midi : 2196F3
      this.shape2.setAttributeNS(null, "stroke-width", 6 * this.dataZoom);
      this.shape2.setAttributeNS(null, "class", "wire");
      this.shape2.setAttributeNS(null, "id", _id + "_2");

      // Specular color in the middle
      this.shape3.setAttributeNS(null, "fill", "none");
      this.shape3.setAttributeNS(null, "stroke", "#b87595");
      this.shape3.setAttributeNS(null, "stroke-width", 2 * this.dataZoom);
      this.shape3.setAttributeNS(null, "class", "wire");
      this.shape3.setAttributeNS(null, "id", _id + "_3");

      // Jack ends are images (embout) 
      this.end = this.makeSVG('image', {
        class: 'map-tile',
        //'xlink:href': '../pedalboard/img/rightJack.png',
        'xlink:href': '../img/rightJack.png',
        width: 100 * this.dataZoom + 'px',
        height: 20 * this.dataZoom + 'px',
        id: _id + "_4"
      });

      svg.appendChild(this.shape1);
      svg.appendChild(this.shape3);
      svg.appendChild(this.shape2);
      svg.appendChild(this.end);
    }

    this.shape1.setAttribute("d", path);
    this.shape2.setAttribute("d", path);
    this.shape3.setAttribute("d", path);
    this.end.setAttribute("x", _pos.x2 - 10);
    this.end.setAttribute("y", _pos.y2 - (10 * this.dataZoom));
    return this;
  }
}