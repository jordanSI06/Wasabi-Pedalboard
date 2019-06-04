class Track {
  //TODO, content to remove
  constructor(id, content, loopState, volume) {
    //Parameters oh HTML content
    this.id = id;
    this.mainContainer = content;
    this.title = "Untitled Track n°" + this.id;

    //AudioContext
    //Global Context of Pedalboard
    this.ac = GlobalContext.context;

    // Graph node creation
    this.input = this.ac.createGain();
    this.input.gain.value = 0;
    this.panner = this.ac.createStereoPanner();
    this.output = this.ac.createGain();
    this.dest = this.ac.createMediaStreamDestination();

    // Build graph
    this.input.connect(this.panner);
    this.panner.connect(this.output);
    this.output.connect(this.dest); // associated to MediaRecorder

    this.shadowRoot = document.querySelector('#pedalboard').shadowRoot.querySelector('#wc-multitrack').shadowRoot.querySelector('#trackN' + this.id);

    //HTML Element
    // Graphic Element
    //this.playButton;
    this.recordButton;
    this.dlButton;
    this.titleTrack;
    this.volumeRange;
    this.canvas;
    this.deleteButton;
    this.playBar;
    this.audioFileChooser;
    this.pannerInput

    // Request animation frame part
    this.playBarDisplay = {
      x: 0,
      vx: 0,
      color: 'red',
      draw: function (ctx) {
        ctx.beginPath();
        ctx.fillRect(this.x, 0, 5, 200);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    };
    this.timestart = 0;
    this.biais = 0;
    this.raf;
    this.timestp;

    // Icon buttons element
    this.buttonRecImg;
    this.buttonMuteImg;
    this.buttonDlImg;

    // Element state
    this.stateRecord = false;
    this.statePlay = false;
    this.statePause = false;
    this.stateMute = false;
    this.stateLoop = loopState;
    this.needResize = false;
    this.playbarExists = false;

    // Element value
    this.volume = volume;
    this.volumeMax = 100;
    this.pannerValue = 0;
    this.trackId = 0;
    this.addTime = 0;

    // File element
    this.blob;
    this.sample;
    this.recordedBlobs = [];
    this.fileReader;
    this.arrayBuffer;
    this.bufferSourceNode;
    this.oldBufferSourceNode;
    this.data;
    this.channelData;
    this.url;
    this.link;
    this.fileName = "Untitled track";
    this.main;
    this.file; //for file imported

    // Coordinates
    this.xcor;
    this.playbarCor;
    this.canvasBar;
    this.test;
    this.raf;

  }

  callListeners() {
    // Buttons assigned with query selector
    let parent = this;
    this.titleTrack = this.shadowRoot.querySelector('#title');
    this.deleteButton = this.shadowRoot.querySelector('#delete')
    this.recordButton = this.shadowRoot.querySelector('#record');
    this.audioFileChooser = this.shadowRoot.querySelector('#audioFileChooser');
    //this.playButton = this.shadowRoot.querySelector('#play');
    this.muteButton = this.shadowRoot.querySelector("#mute");
    this.dlButton = this.shadowRoot.querySelector('#download');
    this.titleTrack = this.shadowRoot.querySelector('#title');
    this.addButton = this.shadowRoot.querySelector('#addTrack');
    this.pannerInput = this.shadowRoot.querySelector('#panner');

    // Buttons icons assigned with query selector
    this.buttonRecImg = this.shadowRoot.querySelector('#btn_rec_img');
    this.buttonMuteImg = this.shadowRoot.querySelector('#btn_mute_img');
    this.buttonDlImg = this.shadowRoot.querySelector('#btn_dl_img');

    // Volume range slider assigned with query selector
    this.volumeRange = this.shadowRoot.querySelector('#volume');

    // Canvas assigned with query selector
    this.canvas = this.shadowRoot.querySelector('canvas');
    this.canvasBar = this.shadowRoot.querySelector('#bar');
    this.canvasDiv = this.shadowRoot.querySelector('#can')

    // setting up individual ID for label and input type = file.
    this.shadowRoot.querySelector('#labelFile').setAttribute('for', 'audioFileChooser' + this.id);
    this.shadowRoot.querySelector('#audioFileChooser').setAttribute('id', 'audioFileChooser' + this.id);

    this.titleTrack.textContent = this.title;
    navigator.mediaDevices.getUserMedia({
      audio: true
    })
      .then(function (stream) {
        //parent.playButton.addEventListener('click', parent.playingTrack.bind(parent));
        parent.recordButton.addEventListener('mousedown', parent.recordingTrack.bind(parent));
        parent.dlButton.addEventListener('click', parent.download.bind(parent));
        parent.volumeRange.addEventListener('input', parent.changeVolume.bind(parent));
        parent.muteButton.addEventListener('click', parent.muteVolume.bind(parent));
        parent.recorder = new MediaRecorder(parent.dest.stream);
        parent.recorder.addEventListener('dataavailable', parent.onRecordingReady.bind(parent));
        parent.titleTrack.addEventListener('click', parent.changeTitle.bind(parent));
        parent.deleteButton.addEventListener('click', parent.deleteTrack.bind(parent));
        parent.pannerInput.addEventListener('input', parent.changePanner.bind(parent));
        parent.audioFileChooser.addEventListener('change', parent.uploadAudio.bind(parent));
        // parent.canvas.addEventListener('click', parent.timerWave.bind(parent, parent.canvas));
      });
  }

  getInput() {
    return this.input;
  }

  getOutput() {
    return this.output;
  }

  get getTrackHTML() {
    return this.mainContainer;
  }

  get titleCreation() {
    return this.title;
  }


  recordingTrack() {
    if (!this.needResize) {
      if (this.stateRecord == false) {
        this.input.gain.value = 1;
        this.statePlay = false;

        this.stopSample();
        this.clearCanvas();
        this.recorder.start();
        this.buttonRecImg.setAttribute('style', 'fill:red;');
        this.buttonDlImg.setAttribute('style', 'fill: #fff');
        this.canvasBar.getContext('2d').clearRect(0, 0, this.canvasBar.width, this.canvasBar.height)
      }
      if (this.stateRecord == true) {
        this.input.gain.value = 0;
        this.recorder.stop()
        this.buttonRecImg.setAttribute('style', 'fill:#fff;');
        this.buttonDlImg.setAttribute('style', 'fill: rgb(191, 255, 194);');
      }
      this.stateRecord = !this.stateRecord;
      this.pausedAt = undefined;
      this.startedAt = 0;
    } else {
      this.needResize = false;
    }
  }

  stopSample() {
    //console.log('stop sample');
    if (this.bufferSourceNode) {
      this.bufferSourceNode.disconnect();
      this.bufferSourceNode = undefined;
    }
  }

  recreateBuffer() {
    let parent = this;
    this.statePlay = false;
    if (this.addTime > 0) {
      this.oldBufferSourceNode = this.bufferSourceNode;
      this.bufferSourceNode = this.ac.createBufferSource();
      this.bufferSourceNode.buffer = this.oldBufferSourceNode.buffer;
    } else {
      this.bufferSourceNode = this.ac.createBufferSource();
      this.bufferSourceNode.buffer = this.sample;
    }
    this.bufferSourceNode.onended = function () {
      //parent.bufferSourceNode.disconnect();
      parent.recreateBuffer();
    }
    if (this.stateLoop) {
      this.bufferSourceNode.loop = true;
    }
    //TODO: erase it
  }

  changeTitle() {
    let nameTrack = prompt('Please type the title of your track (between 1-20 characters): ');
    if (nameTrack.length > 20 && nameTrack.length > 0) {
      alert("Enter a shorter name (1 to 20 character allowed)");
      this.changeTitle();
    } else {
      this.titleTrack.textContent = nameTrack;
      this.fileName = nameTrack;
    }
  }

  onRecordingReady(e) {
    //console.log("onRecordingReady");
    let parent = this;
    this.blob = e.data;
    this.recordedBlobs.push(e.data);
    this.fileReader = new FileReader();

    this.fileReader.onprogress = function () {
      //console.log("recording...")
    }
    this.fileReader.onload = function () {
      parent.arrayBuffer = this.result;
      parent.ac.decodeAudioData(parent.arrayBuffer, function (decoded) {
        //console.log('finished!', decoded.length);
        parent.useSample(decoded);
      }, function (fail) {
        console.error('fail!', fail);
      });
    }
    this.fileReader.readAsArrayBuffer(this.blob);

  }

  useSample(sample) {
    //this.MaximiseSampleInPlace(sample);
    if (this.bufferSourceNode) {
      this.bufferSourceNode.disconnect()
    }
    this.sample = sample;
    this.recreateBuffer();
    this.data = [];
    this.channelData = sample.getChannelData(0);

    for (let i = 0; i < this.channelData.length; i++) {
      this.data.push(this.channelData[i]);
    }
    this.RenderWave(this.data);
    this.recordButton.blur();
  }

  download() {
    if (!this.stateRecord && this.bufferSourceNode) {
      let parent = this;
      if (this.blob) {
        this.url = window.URL.createObjectURL(this.blob);
      } else {
        this.url = window.URL.createObjectURL(this.audioFileChooser.files[0]);
      }
      this.link = document.createElement('a');
      this.link.style.display = 'none';
      this.link.href = this.url;
      this.link.download = this.fileName + ".wav";
      document.body.appendChild(this.link);
      this.link.click();

      setTimeout(function () {
        document.body.removeChild(parent.link);
        window.URL.revokeObjectURL(parent.url);
      }, 100);
    } else {
      console.warn("You cannot download now! (File doesn't exist or the track is recording)")
    }

  }

  changeVolume(e) {
    this.volume = e.target.value / 100;
    if (this.bufferSourceNode) {
      if (!this.stateMute) {
        if (this.volume > this.volumeMax / 100) {
          this.volume = this.volumeMax / 100;
        }
        console.log(this.volumeMax);
        console.log(this.volume);
        this.output.gain.value = this.volume;
      }
    }
  }

  changePanner(e) {
    this.pannerValue = e.target.value;
    if (this.bufferSourceNode) {
      this.panner.pan.value = this.pannerValue;
      console.log(this.panner.pan);
    }
  }

  muteVolume() {
    if (!this.stateMute) {
      if (this.bufferSourceNode) {
        this.output.gain.value = 0;
        this.buttonMuteImg.setAttribute('icon', 'av:volume-off')
      }
    } else {
      this.output.gain.value = this.volume;
      this.buttonMuteImg.setAttribute('icon', 'av:volume-up')
    }
    this.stateMute = !this.stateMute;
  }


  clearCanvas() {
    let context = this.canvas.getContext('2d');
    let canvasWidth = this.canvas.width;
    let canvasHeigth = this.canvas.height;

    context.fillStyle = 'rgb(85, 85, 85)';
    context.fillRect(0, 0, canvasWidth, canvasHeigth);
    context.lineWidth = 1;
    context.strokeStyle = 'rgb(205, 205, 205)';
    context.beginPath();
  }

  /*
  clearBar() {
    let rate = this.bufferSourceNode.buffer.sampleRate;
    let imin = Math.floor(this.data.length * (this.playbarCor - 0.01));
    let imax = Math.floor(this.data.length * (this.playbarCor + 0.01));
    let context = this.canvas.getContext('2d');
    let canvasWidth = this.canvas.width;
    let canvasHeigth = this.canvas.height;
    let canvasHalfHeight = canvasHeigth * 0.5;
    context.fillStyle = 'rgb(85, 85, 85)';
    context.lineWidth = 1;
    context.strokeStyle = 'rgb(255, 255, 255)';
    context.beginPath();
    let calcul;
    if(this.bufferSourceNode.buffer.duration >= 60){
      calcul = Math.floor(((this.bufferLength / rate)*6));
    }else{
      calcul=1;
    }
    imin = Math.floor(imin/calcul)*calcul
    imax = Math.floor(imax/calcul)*(calcul+1)
    let sliceWidth = canvasWidth * 1.0 / (this.bufferLength);
    let xstart = sliceWidth * imin - sliceWidth
    let ystart = sliceWidth * imax - sliceWidth - xstart;
    context.fillRect(xstart, 0, ystart, canvasHeigth);
    let x = sliceWidth * imin - sliceWidth;

    sliceWidth = canvasWidth * 1.0 / (this.bufferLength/calcul);
    for (imin; imin < imax; imin+=calcul) {
      let v = 1 - this.data[imin];
      let y = v * canvasHalfHeight; 
      context.lineTo(x, y);
      x += sliceWidth;
    }
    context.stroke();
  }*/

  RenderWave(data) {
    let context2 = this.canvasBar.getContext('2d');
    context2.globalAlpha = 0;
    context2.fillRect(0, 0, this.canvasBar.width, this.canvasBar.height);
    let context = this.canvas.getContext('2d');
    let canvasWidth = this.canvas.width;
    let canvasHeigth = this.canvas.height;
    let canvasHalfHeight = canvasHeigth * 0.5;
    this.bufferLength = data.length;
    context.fillStyle = 'rgb(85, 85, 85)';
    context.fillRect(0, 0, canvasWidth, canvasHeigth);
    context.lineWidth = 1;
    context.strokeStyle = 'rgb(255, 255, 255)';
    context.beginPath();
    let calcul;
    if (this.bufferSourceNode.buffer.duration >= 60) {
      calcul = Math.floor(((this.bufferLength / this.bufferSourceNode.buffer.sampleRate)));
    } else {
      calcul = 1;
    }
    let sliceWidth = canvasWidth * 1.0 / (this.bufferLength / calcul);
    let x = 0 - sliceWidth;
    for (let i = 0; i < this.bufferLength; i += calcul) {
      let v = 1 - this.data[i];
      let y = v * canvasHalfHeight;

      if (i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }

      x += sliceWidth;
    }
    context.lineTo(this.bufferLength + 1, canvasHalfHeight);
    context.lineTo(canvasWidth, canvasHalfHeight);
    context.stroke();
  }




  renderBar(xcor) {
    if (this.bufferSourceNode) {
      //console.log(xcor);
      this.playBar = this.canvasBar.getContext('2d');
      this.playBar.globalAlpha = 0;
      this.playBar.clearRect(0, 0, this.canvasBar.width, this.canvasBar.height);
      this.playBar.globalAlpha = 1;
      this.playBar.lineWidth = 3;
      this.playBar.strokeStyle = 'red';
      let canvasWidth = this.canvasDiv.clientWidth;
      let canvasHeigth = this.canvas.height;
      let maxDuration = this.bufferLength / this.bufferSourceNode.sampleRate;
      let pos = (xcor - this.canvasDiv.offsetLeft) / canvasWidth;
     // console.log('offset' + this.canvasDiv.offsetLeft);
      this.playbarCor = pos;
      let timeStamp = Math.floor(pos * maxDuration * 1000);
      let min = Math.floor(timeStamp / 1000 / 60);
      let sec = Math.floor((timeStamp / 1000 - min * 60) * 100) / 100;
      //console.log(pos);
      //console.log("TimeStamp =  " + timeStamp);
      //console.log(min + " minutes et " + sec + " secondes.");
      this.playBar.beginPath();
      this.playBar.moveTo(this.canvasBar.width * pos, 0);
      this.playBar.lineTo(this.canvasBar.width * pos, canvasHeigth);
      this.playBar.stroke();
      console.log(window);
    }
  }

  // in progress __________________________________________________________________________________________________________________________
  draw() {
    let parent = this;
    //console.log(this.playBarDisplay.x);
    let ctx = this.canvasBar.getContext('2d');
    this.biais = this.timestart;
    this.timestart = Date.now();
    ctx.clearRect(0, 0, this.canvasBar.width, this.canvasBar.height);
    this.playBarDisplay.draw(ctx);
    this.playBarDisplay.x += this.playBarDisplay.vx;
    if (this.playBarDisplay.x > (this.canvasBar.width + this.playBarDisplay.vx)) {
      this.playBarDisplay.x = 0
      ctx.clearRect(0, 0, this.canvasBar.width, this.canvasBar.height);
      this.playBarDisplay.draw(ctx);
      window.cancelAnimationFrame(this.raf);
      // this.state=!state;
      // console.log((Date.now() - timestp)/1000);
      this.timestp = 0;
    } else {
      setTimeout(function () {
        parent.raf = window.requestAnimationFrame(()=> parent.draw());
        parent.timestart = parent.timestart - Date.now();
      }, this.bufferSourceNode.buffer.duration - Math.abs(this.biais));
    }
  }


  deleteTrack() {
    this.shadowRoot.remove();
  }

  playingTrack() {
    if (this.bufferSourceNode && this.stateRecord == false) {
      if (this.statePlay == false) {
        if (this.pausedAt) {
          // if loop enabled, this will helps!
          if ((this.pausedAt) > (this.bufferSourceNode.buffer.duration * 1000)) {
            this.pausedAt = this.pausedAt - (this.bufferSourceNode.buffer.duration * Math.floor(this.pausedAt / (this.bufferSourceNode.buffer.duration * 1000))) * 1000;
            this.startedAt = Date.now() - this.pausedAt;
          }
          this.timeEllapsed = Date.now() - this.timeEllapsed;
          this.startedAt += this.timeEllapsed;
          if (this.pausedAt < 0) this.pausedAt = 0
          this.bufferSourceNode.start(0, this.pausedAt / 1000);
          this.pausedAt = undefined;
        } else {
          this.startedAt = Date.now()
          this.bufferSourceNode.start();
        }

        this.bufferSourceNode.connect(this.panner);
      } else if (this.statePlay == true) {
        this.bufferSourceNode.stop()
        //this.bufferSourceNode.disconnect();
        this.recreateBuffer();
        this.pausedAt = Date.now() - this.startedAt;
        // time ellapsed allow us to update playAt value when paused/played.
        this.timeEllapsed = Date.now();
        //this.buttonPlayImg.setAttribute('icon', 'av:play-circle-filled');
      }
      this.statePlay = !this.statePlay;
    } else {
      console.warn("You cannot play/pause! (There's no file or the track isn't recording)");
    }
  }

  loopTrack() {
    if (this.bufferSourceNode) {
      if (this.stateLoop == false) {
        this.bufferSourceNode.loop = true;
      } else {
        this.bufferSourceNode.loop = false;
      }
      this.stateLoop = !this.stateLoop;
    }
  }

  stopTrack() {
    if (this.bufferSourceNode && this.statePlay == true) {
      //this.bufferSourceNode.stop();
      this.bufferSourceNode.disconnect();
      this.recreateBuffer();
      this.pausedAt = undefined;
    }
    else if (this.bufferSourceNode && this.statePlay == false) {
      //this.bufferSourceNode.start();
      //this.bufferSourceNode.stop();
      this.bufferSourceNode.disconnect();
      this.recreateBuffer();
      this.pausedAt = undefined;
    }
    else {
      console.warn("You cannot stop when a track who doesn't exist!")
    }
  }

  addEmptyAudio() {
    if (this.addTime > 0) {
      let length = this.addTime * this.bufferSourceNode.buffer.sampleRate;
      let arrayBuffer = this.ac.createBuffer(2, length, this.bufferSourceNode.buffer.sampleRate);
      let buffer = this.appendBuffer(this.bufferSourceNode.buffer, arrayBuffer);
      //this.bufferSourceNode = this.ac.createBufferSource();
      //this.bufferSourceNode.buffer = buffer;
      /*this.bufferSourceNode.onended = function () {
        parent.recreateBuffer();
      }*/
      if (this.stateLoop) {
        this.bufferSourceNode.loop = true;
      }
      this.useSample(buffer);
      this.addTime = 0;
    }
  }

  appendBuffer(buffer1, buffer2) {
    let numberOfChannels = Math.min(buffer1.numberOfChannels, buffer2.numberOfChannels);
    let tmp = this.ac.createBuffer(numberOfChannels, (buffer1.length + buffer2.length), buffer1.sampleRate);
    for (let i = 0; i < numberOfChannels; i++) {
      let channel = tmp.getChannelData(i);
      channel.set(buffer1.getChannelData(i), 0);
      channel.set(buffer2.getChannelData(i), buffer1.length);
    }
    return tmp;
  }

  uploadAudio() {
    let parent = this;
    console.log(this.shadowRoot);
    let file = new FileReader();
    file.readAsArrayBuffer(this.audioFileChooser.files[0])
    file.onload = function (e) {
      parent.file = e.target.result;
      parent.stockAudioFile(e.target.result);
      //console.log(parent.shadowRoot);   
    }
  }

  stockAudioFile(file) {
    let parent = this;
    console.log(this.shadowRoot);
    this.ac.decodeAudioData(file, function (buffer) {
      parent.bufferSourceNode = parent.ac.createBufferSource();
      parent.bufferSourceNode.buffer = buffer;
      parent.bufferSourceNode.loop = parent.stateLoop;
    }).then(function () {
      parent.useSample(parent.bufferSourceNode.buffer);
      parent.blob = null
      console.log(parent.bufferSourceNode);
      // focus and blur in ord
      parent.recordButton.focus();
      parent.recordButton.blur();
    }
    );
  }
}

