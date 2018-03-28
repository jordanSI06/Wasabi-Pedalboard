// inherit default property values, connect methodes, etc.
// behaviour that enable other nodes to connect to this one
// etc.
// TO ADD:
// -zoom in out to focus on some parts. Ideal way = click and drag + a reset button
// and/or two sliders one vertical and one horizontal for scaling.
// Instead of a ctx.scale, the whole analysis parameter should be modified
// - color for bars, for peaks,
// - mouse move display a reticulum for accurate measure of some freqs
// - smoothing should be settable using a slider too
// - display as a smoothed curve instead of bars
// - come with some integrated oscillators for testing, or with a demo
// - settable  dashed bar position 
class FrequencyAnalyzer extends AnalyserNode {
  // instances are an analyzernode

  constructor(audioContext, parent, label) {
    // parent is for example a div that will contain the analyzer
    super(audioContext);
        
    this.label = label;

    // analyzer part
    this.audioContext = audioContext;
    this.minDecibels = -100;
    this.maxDecibels = 0;
    this.smoothingTimeConstant = 0.8;
    //analyser.fftSize = 4096;
    this.fftSize = 2048;
    this.bufferLength = this.frequencyBinCount;
    //console.log(bufferLength);
    this.dataArray = new Float32Array(this.bufferLength);
    this.dataVisualArray = new Array(this.bufferLength);
    this.frequency = new Array();
    
    // canvas part
    this.canvas = document.createElement('canvas');
    // get dimensions, by default the ones from the parent element
    this.canvas.classList.add("freqAnalyzer");
    this.canvas.width = parent.clientWidth;
    this.canvas.height = parent.clientHeight;

    this.canvasParent = parent;
    this.canvasParent.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.WIDTH = this.canvasParent.clientWidth;
    this.HEIGHT = this.canvasParent.clientHeight;
    
    this.resize(this.WIDTH, this.HEIGHT);
    
   window.addEventListener('resize', 
                            evt => this.resize(this.canvasParent.clientWidth, 
                                               this.canvasParent.clientHeight));
    // start drawing frequencies
    requestAnimationFrame(this.update.bind(this)); 
  }

  start() {
      this.rAF = requestAnimationFrame(this.animate.bind(this));
    
  }
  
  stop() {
     cancelAnimationFrame(this.rAF);
     this.rAF = null;
  }
  
  // call this method if there is a need to resize the freq analyzer
  resize(w, h) {
    //console.log("resize");
    this.canvas.width = w;
    this.canvas.height = h;
    this.WIDTH = w;
    this.HEIGHT = h;
    this.ANALYZERWIDTH = w;
    this.ANALYZERHEIGHT = h-h/4;
    this.HEIGHTRATIO = this.ANALYZERHEIGHT/140;

    this.PEAKTHRESHOLD = 100;

    this.barWidth = new Array();

    // calculate frequency and barWidth
    for(var i = 0; i < this.bufferLength; i++) {
      this.frequency[i] = i * this.audioContext.sampleRate / this.fftSize;

      // calculate bar width -> exponential -> logarithm
      this.barWidth[i] = (Math.log(i+2)-Math.log(i+1))*this.ANALYZERWIDTH/10;

      //this.barWidth[i] = this.ANALYZERWIDTH/this.bufferLength;
    }

    // clear
    this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
  }
  
  updateFreqDataArrayToPlot() {
    // get current frequency data
    this.getFloatFrequencyData(this.dataArray); 
  }
  
  drawPeakTresholdDashedBar() {
    this.ctx.save();
    
    // draw peak threshold stroke
    this.ctx.beginPath();
    this.ctx.moveTo(60,this.ANALYZERHEIGHT-this.PEAKTHRESHOLD*this.HEIGHTRATIO);
    this.ctx.lineTo(this.ANALYZERWIDTH,this.ANALYZERHEIGHT-this.PEAKTHRESHOLD*this.HEIGHTRATIO);
    this.ctx.strokeStyle = 'rgb(170,170,170)';
    this.ctx.setLineDash([5]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
    
    this.ctx.restore();
  }
  drawFrequencyLabels() {
    this.ctx.save();
    
    // draw bottom in dark grey
    this.ctx.fillStyle = 'rgb(40, 40, 40)';
    this.ctx.fillRect(0, this.ANALYZERHEIGHT+1, this.WIDTH, this.HEIGHT);

    // Draw rotated freq labels
    this.ctx.save();

    let x = 0;
        // draw frequency labels (rotated 90 degree to be vertically drawn)
    this.ctx.rotate( Math.PI / 2 );
    this.ctx.fillStyle = 'rgb(170,170,170)';
    let fontSize = 10;
    this.ctx.font =  fontSize + 'px Arial';
    
    for(let i = 0; i < this.bufferLength; i++) {

      // draw frequence scale – but not every frequence (remember its exponential!)
      if((this.frequency[i] < 215 || i%2 == 0)
      && (this.frequency[i] < 500 || i%3 == 0)
      && (this.frequency[i] < 1000 || i%4 == 0)
      && (this.frequency[i] < 5000 || i%4.5 == 0)) {

        // insert "kilo" herz
        if(this.frequency[i] >= 1000) {
          this.ctx.fillText(Math.round(this.frequency[i]/1000*10)/10+ ' kHz', this.HEIGHT-40, -x -this.barWidth[i]/2 + fontSize/2);
        } else {
          this.ctx.fillText(Math.round(this.frequency[i])+ ' Hz', this.HEIGHT-40, -x + fontSize/2);
        }

        // draw small scale identifyer
        this.ctx.beginPath();
        this.ctx.moveTo(this.ANALYZERHEIGHT,-x+1);
        this.ctx.lineTo(this.ANALYZERHEIGHT+10,-x+1);
        this.ctx.strokeStyle = 'rgb(170,170,170)';
        this.ctx.stroke();

      }
      x += this.barWidth[i] + 1;
    }
    this.ctx.restore();
    
    // draw x-scale stroke
    this.ctx.beginPath();
    this.ctx.moveTo(0,this.ANALYZERHEIGHT+5);
    this.ctx.lineTo(this.ANALYZERWIDTH,this.ANALYZERHEIGHT+5);
    this.ctx.strokeStyle = 'rgb(170,170,170)';
    this.ctx.stroke();
    
    this.ctx.restore();

  }
  
  drawLeftDbScale() {
    this.ctx.save();
    // draw left scale
    let stepSize = 10;
    let steps = (this.maxDecibels - this.minDecibels)/stepSize;

    this.ctx.fillStyle = 'rgb(170,170,170)';
    var y = this.maxDecibels;
    
    for(let i = 0; i < steps;i++) {
      // draw text
      this.ctx.fillText(y + ' db', 10, this.ANALYZERHEIGHT/steps*i+30);

      // draw small scale identifier
      this.ctx.beginPath();
      this.ctx.moveTo(35,this.ANALYZERHEIGHT/steps*i+25);
      this.ctx.lineTo(45,this.ANALYZERHEIGHT/steps*i+25);
      this.ctx.strokeStyle = 'rgb(170,170,170)';
      this.ctx.stroke();
      y -= stepSize;
    }
        // draw y-scale axis
    this.ctx.beginPath();
    this.ctx.moveTo(40,0);
    this.ctx.lineTo(40,this.ANALYZERHEIGHT+5);
    this.ctx.strokeStyle = 'rgb(170,170,170)';
    this.ctx.stroke();

    this.ctx.restore();
  }
  
  drawFrequencyBars() {
    this.ctx.save();
    let x = 0;
        //console.log(dataArray);
    // draw bars (rectangles)
    for(let i = 0; i < this.bufferLength; i++) {
      let barHeight = (this.dataArray[i]+140)*this.HEIGHTRATIO;
      
      if(barHeight < 0) barHeight = 0;

      // draw bar
      // this.ctx.fillStyle = 'rgb(0,'+(barHeight+50)+',0)';
      // nice blue....
      this.ctx.fillStyle = 'rgb(70,70,180)';
      
      // If above treshold, highlight the frequencies in white
      if(this.dataArray[i]+140 > this.PEAKTHRESHOLD) 
        this.ctx.fillStyle = 'white';
      
      //if(this.barHeight > this.PEAKTHRESHOLD) 
        //this.ctx.fillStyle = 'rgb('+((70+this.barHeight-this.PEAKTHRESHOLD)*2)+','+((70+barHeight-this.PEAKTHRESHOLD)*2)+','+((180+barHeight-this.PEAKTHRESHOLD)*2)+')';
      //this.ctx.fillRect(x,ANALYZERHEIGHT-barHeight*HEIGHTRATIO,barWidth[i],barHeight*HEIGHTRATIO);

      // draw a bar
      this.ctx.fillRect(x,this.ANALYZERHEIGHT-barHeight,this.barWidth[i],barHeight);
      x += this.barWidth[i] + 1;
    }
    
  this.ctx.restore();
  }
  
  clearCanvas() {
    // clear canvas
    this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);    
  }
  
  drawLabel() {
    this.ctx.save();

    let fontSize = 14;
    this.ctx.font = 'bold ' + fontSize + 'px Arial';
    this.ctx.testAlign='center';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(this.label, this.WIDTH/2-40, 30);
    this.ctx.restore();
  }

  // redraw the freq analyzer
  update() {   
    this.clearCanvas();
    this.updateFreqDataArrayToPlot();
    this.drawPeakTresholdDashedBar();
    this.drawFrequencyLabels();
    this.drawFrequencyBars();
    this.drawLeftDbScale();
    this.drawLabel();
  }

  // Main animation loop
  animate() {
    this.update();

    // repaint 60 times/s
    requestAnimationFrame(this.animate.bind(this)); 
  }
}