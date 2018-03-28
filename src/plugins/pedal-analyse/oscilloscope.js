// Adapted by Michel Buffa (@micbuffa) from a code from  Kevin Cennis that was published in
// the WebAudio Weekly newsletter 25
// See : http://www.webaudioweekly.com/25
// I maded it an ES6 class that extends AnalyserNode, like that
// it inherits the connect method and all other properties
class Oscilloscope extends AnalyserNode {
  constructor(ac, parent, label) {
      super(ac);
    
      this.label = label;
      this.canvasParent = parent;
      this.ac = ac;
    
      // canvas part
      this.canvas = document.createElement('canvas');
      // get dimensions, by default the ones from the parent element
      this.canvas.classList.add("Oscilloscope");
      this.canvas.width = parent.clientWidth;
      this.canvas.height = parent.clientHeight-20;
      this.canvas.top = parent.top;
      this.canvas.left = parent.left;

      this.canvasParent = parent;
      this.canvasParent.appendChild(this.canvas);
    
      this.ctx = this.canvas.getContext('2d');
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.input = ac.createGain();
      this.fftSize = 2048;
      this.freqData = new Uint8Array(this.frequencyBinCount);
      this.rAF = null;
      this.strokeStyle = '#6cf';
      this.sensitivity = 42;
    
      this.resize(this.width, this.height);
    
      // start the scope animation
      //this.start();
    
    window.addEventListener('resize', 
                            evt => this.resize(this.canvasParent.clientWidth, 
                                               this.canvasParent.clientHeight-20));
  }
  
  resize(w, h) { 
     this.canvas.width  = this.width = w;
     this.canvas.height = this.height = h;
     this.canvas.top    = this.canvasParent.top;
     this.canvas.left   = this.canvasParent.left;
  }
  
  // borrowed from https://github.com/cwilso/oscilloscope/blob/master/js/oscilloscope.js 
  findZeroCrossing(data, width) {
  var i = 0, 
    last = -1, 
    min = (this.sensitivity - 0) * (256 - 128) / (100 - 0) + 128,
    s;
  
  while (i < width && (data[ i ] > 128)) {
    i++;
  }

  if (i >= width) {
    return 0;
  }

  while (i < width && ( ( s = data[ i ]) < min)) {
    last = s >= 128 ? last === -1 ? i : last : -1;
    i++;
  }
  
  last = last < 0 ? i : last;
  
  return i === width ? 0 : last;    
  }
  
  start() {
      this.rAF = requestAnimationFrame(this.animate.bind(this));
    
  }
  
  stop() {
     cancelAnimationFrame(this.rAF);
     this.rAF = null;
  }
  
  drawGrid() {
    var i = 50;
    var j = 50;
    this.ctx.save();
      
    this.ctx.fillStyle = '#002233';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = 'rgba(60,180,220,0.05)';
    this.ctx.beginPath();
    
    for (; i < this.width; i += 50 ) {
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.height);
      
      for (j = 0; j < this.height; j += 50) {
        this.ctx.moveTo(0, j);
        this.ctx.lineTo(this.width, j);
      }
    }
    this.ctx.stroke();

    this.ctx.restore();
  }
  
  drawXAxis() {
    this.ctx.save();
        this.ctx.lineWidth = 2;

    this.ctx.strokeStyle = 'rgba(60,180,220,0.22)';
    this.ctx.beginPath();
    this.ctx.moveTo( 0, this.height / 2 );
    this.ctx.lineTo( this.width, this.height / 2 );
    this.ctx.stroke();
    
    this.ctx.restore();
  }
  
  drawWaveform() {
    this.ctx.save();

    this.getByteTimeDomainData(this.freqData);
    var i = this.findZeroCrossing(this.freqData, this.width);
    var j = 50;
    var len = this.freqData.length;
    var scale = this.height / 256 / 2;
    var magnitude;
    
    this.ctx.lineWidth = 2.5;
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.beginPath();
    this.ctx.moveTo(0, (256 - this.freqData[ i ]) * scale + this.height/4);
    
    for (j = 0; i < len && j < this.width; i++, j++) {
      magnitude = (256 - this.freqData[ i ]) * scale + this.height/4;
      this.ctx.lineTo(j, magnitude);
    }

    this.ctx.stroke();
    this.ctx.restore();
  }
  drawLabel() {
    this.ctx.save();

    let fontSize = 10;
    this.ctx.font = fontSize + 'px Arial';
    this.ctx.testAlign='center';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(this.label, this.width/2-30, 15);
    this.ctx.restore();
  }

  update() {
    this.drawGrid();
    this.drawXAxis();
    this.drawWaveform();
    this.drawLabel();
  }

  animate() {
    update();
    this.rAF = requestAnimationFrame(this.animate.bind(this));
  }
}
