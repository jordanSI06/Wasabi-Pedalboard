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
    this.parentPlayButton = document.querySelector('#pedalboard').shadowRoot.querySelector('#wc-multitrack').shadowRoot.querySelector('#btn_play_img');

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
    this.pannerInput;

    // Request animation frame part
    this.playBarDisplay = {
      x: 0,
      oldx: 0,
      vx: 0,
      color: 'red',
      thikness: -2133 * 5 / window.innerWidth,
      draw: function (ctx) {
        ctx.fillStyle = this.color;
        ctx.clearRect(0, 0, 2000, 100);
        ctx.beginPath();
        ctx.fillRect(this.x, 0, this.thikness, 200);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      }
    };
    this.timestart = 0;
    this.biais = 0;
    this.raf;
    this.timestp;
    this.stockCurrentTime;

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
    this.stateBegin = true;
    this.keepPlaying = false;

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
        window.addEventListener('resize', parent.resizeLoadingBar.bind(parent))
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

  resizeLoadingBar() {
    this.playBarDisplay.thikness = -2133 * 5 / window.innerWidth;
    if (this.bufferSourceNode) this.playBarDisplay.draw(this.canvasBar.getContext('2d'));
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
      this.stateBegin = true;
    } else {
      this.needResize = false;
    }
  }

  stopSample() {
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
      parent.parentPlayButton.setAttribute('icon', 'av:play-circle-filled');
      parent.bufferSourceNode.disconnect();
      parent.recreateBuffer();
      parent.stateBegin = true;
    }
    if (this.stateLoop) {
      this.bufferSourceNode.loop = true;
    }
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
        parent.useSample(decoded);
      }, function (fail) {
        console.error('fail!', fail);
      });
    }
    this.fileReader.readAsArrayBuffer(this.blob);

  }

  useSample(sample) {
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
       // console.log(this.volumeMax);
       // console.log(this.volume);
        this.output.gain.value = this.volume;
      }
    }
  }

  changePanner(e) {
    this.pannerValue = e.target.value;
    if (this.bufferSourceNode) {
      this.panner.pan.value = this.pannerValue;
     // console.log(this.panner.pan);
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
    if (this.bufferSourceNode) this.renderBar(context2.offsetLeft);
  }




  renderBar(xcor) {
    let localState = false;
    if (this.bufferSourceNode) {
      this.playBar = this.canvasBar.getContext('2d');
      this.playBar.globalAlpha = 0;
      this.playBar.clearRect(0, 0, this.canvasBar.width, this.canvasBar.height);
      this.playBar.globalAlpha = 1;
      this.playBar.lineWidth = 3;
      this.playBar.strokeStyle = 'red';
      let canvasWidth = this.canvasDiv.clientWidth;
      let pos = (xcor - this.canvasDiv.offsetLeft) / canvasWidth;
      window.cancelAnimationFrame(this.raf)
      if (this.statePlay) {
        this.playingTrack();
        this.keepPlaying = true;
        localState = true
      }
      this.pausedAt = this.bufferSourceNode.buffer.duration * pos * 1000;
      this.startedAt = Date.now() - this.pausedAt;
      this.playbarCor = pos;
      this.playBarDisplay.oldx = pos * 2000;
      this.playBarDisplay.x = pos * 2000;
      this.stockCurrentTime = Date.now();
      this.playBarDisplay.draw(this.canvasBar.getContext('2d'));
    }
  }

  draw() {
    if (this.bufferSourceNode) {
      let ctx = this.canvasBar.getContext('2d');
      ctx.clearRect(0, 0, this.canvasBar.width, this.canvasBar.height);
      this.playBarDisplay.draw(ctx);
      this.playBarDisplay.x = ((Date.now() - this.stockCurrentTime) / this.bufferSourceNode.buffer.duration) * 2 + this.playBarDisplay.oldx;
      if (this.playBarDisplay.x > 2000) {
        if(!this.stateLoop){
        this.playBarDisplay.x = 0;
        this.playBarDisplay.oldx = 0;
        ctx.clearRect(0, 0, this.canvasBar.width, this.canvasBar.height);
        this.playBarDisplay.draw(ctx);
        window.cancelAnimationFrame(this.raf);
        } else {
          this.playBarDisplay.x =0;
          this.playBarDisplay.oldx =0;
          this.stockCurrentTime = Date.now();
          ctx.clearRect(0, 0, this.canvasBar.width, this.canvasBar.height);
          this.raf = window.requestAnimationFrame(() => this.draw()); // parent?
        }
      } else {
        this.raf = window.requestAnimationFrame(() => this.draw()); // parent?
      }
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
            this.timeEllapsed = Date.now();
          }
          this.timeEllapsed = Date.now() - this.timeEllapsed;
          this.startedAt += this.timeEllapsed;
          if (this.pausedAt < 0) this.pausedAt = 0
          this.bufferSourceNode.start(0, this.pausedAt / 1000);
          this.pausedAt = undefined;
        } else {
          this.startedAt = Date.now()
          this.bufferSourceNode.start();
          this.parentPlayButton.setAttribute('icon', 'av:play-circle-filled');
        }

        this.bufferSourceNode.connect(this.panner);
      } else {
        this.bufferSourceNode.stop()
        this.recreateBuffer();
        this.pausedAt = Date.now() - this.startedAt;
        // time ellapsed allow us to update playAt value when paused/played.
        this.timeEllapsed = Date.now();
      }
      this.statePlay = !this.statePlay;
    } else {
      console.warn("You cannot play/pause! (There's no file or the track isn't recording)");
    }
    this.keepPlaying = false;
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
    if (this.bufferSourceNode) {
      if (!this.stateBegin || this.statePlay) this.bufferSourceNode.stop();
      this.pausedAt = undefined;
      this.playBarDisplay.x = 0;
      this.playBarDisplay.oldx = 0;
      window.cancelAnimationFrame(this.raf);
      this.playBarDisplay.draw(this.canvasBar.getContext('2d'));
      this.recreateBuffer();
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
    let file = new FileReader();
    let name = this.audioFileChooser.files[0].name;
    file.readAsArrayBuffer(this.audioFileChooser.files[0])
    file.onloadend = function (e) {
      parent.file = e.target.result;
      parent.stockAudioFile(e.target.result);
      parent.titleTrack.textContent  = name.substr(0,name.length-4);
      parent.fileName = name.substr(0,name.length-4);
      parent.buttonDlImg.setAttribute('style', 'fill: rgb(191, 255, 194);');
    }
  }

  stockAudioFile(file) {
    let parent = this;
    this.ac.decodeAudioData(file, function (buffer) {
      parent.bufferSourceNode = parent.ac.createBufferSource();
      parent.bufferSourceNode.buffer = buffer;
      parent.bufferSourceNode.loop = parent.stateLoop;
    }).then(function () {
      parent.useSample(parent.bufferSourceNode.buffer);
      parent.blob = null
      // focus and blur in order to get listener working fine!!
      parent.recordButton.focus();
      parent.recordButton.blur();
    }
    );
  }
}

