class Track {
  constructor(id, content) {
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
    this.output = this.ac.createGain();
    this.dest = this.ac.createMediaStreamDestination();

    // Build graph
    this.input.connect(this.output);
    this.output.connect(this.dest); // associated to MediaRecorder

    this.shadowRoot = document.querySelector('#pedalboard').shadowRoot.querySelector('#wc-multitrack').shadowRoot.querySelector('#trackN' + this.id);

    //HTML Element
    // Graphic Element
    this.recordButton;
    this.dlButton;
    this.titleTrack;
    this.volumeRange;
    this.canvas;
    this.deleteButton;

    // Icon buttons element
    this.buttonRecImg;
    this.buttonMuteImg;
    this.buttonDlImg;

    // Element state
    this.stateRecord = false;
    this.statePlay = false;
    this.statePause = false;
    this.stateMute = false;
    this.stateLoop = false;

    // Element value
    this.volume = 0.5;
    this.trackId = 0;

    // File element
    this.blob;
    this.sample;
    this.recordedBlobs = [];
    this.fileReader;
    this.arrayBuffer;
    this.bufferSourceNode;
    this.data;
    this.channelData;
    this.url;
    this.link;
    this.fileName = "Untitled track";
    this.main;
  }

  callListeners() {
    // Buttons assigned with query selector
    let parent=this;
    this.titleTrack = this.shadowRoot.querySelector('#title');
    this.titleTrack.textContent=this.title;
    this.deleteButton = this.shadowRoot.querySelector('#delete')
    this.recordButton = this.shadowRoot.querySelector('#record');
    this.stopButton = this.shadowRoot.querySelector('#stop');
    this.playButton = this.shadowRoot.querySelector('#play');
    this.muteButton = this.shadowRoot.querySelector("#mute");
    this.loopButton = this.shadowRoot.querySelector('#loop');
    this.dlButton = this.shadowRoot.querySelector('#download');
    this.titleTrack = this.shadowRoot.querySelector('#title');
    this.addButton = this.shadowRoot.querySelector('#addTrack');

    // Buttons icons assigned with query selector
    this.buttonRecImg = this.shadowRoot.querySelector('#btn_rec_img');
    this.buttonStopImg = this.shadowRoot.querySelector('#btn_stop_img');
    this.buttonPlayImg = this.shadowRoot.querySelector('#btn_play_img');
    this.buttonLoopImg = this.shadowRoot.querySelector('#btn_loop_img');
    this.buttonMuteImg = this.shadowRoot.querySelector('#btn_mute_img');
    this.buttonDlImg = this.shadowRoot.querySelector('#btn_dl_img');

    // Volume range slider assigned with query selector
    this.volumeRange = this.shadowRoot.querySelector('#volume');

    // Canvas assigned with query selector
    this.canvas = this.shadowRoot.querySelector('canvas');

    navigator.mediaDevices.getUserMedia({
      audio: true
    })
      .then(function (stream) {
        navigator.mediaDevices.getUserMedia
        parent.recordButton.addEventListener('click', parent.recordingTrack.bind(parent));
        parent.dlButton.addEventListener('click', parent.download.bind(parent));
        parent.volumeRange.addEventListener('input', parent.changeVolume.bind(parent));
        parent.muteButton.addEventListener('click', parent.muteVolume.bind(parent));
        parent.recorder = new MediaRecorder(parent.dest.stream);
        parent.recorder.addEventListener('dataavailable', parent.onRecordingReady.bind(parent));
        parent.titleTrack.addEventListener('click', parent.changeTitle.bind(parent));
        parent.deleteButton.addEventListener('click', parent.deleteTrack.bind(parent));
      });
  }

  getInput() {
    return this.input;
  }

  getOutput() {
    return this.output;
  }

  get getTrackHTML() {
    console.log(this.mainContainer.childNodes[3].childNodes[2])
    return this.mainContainer;
  }

  get titleCreation() {
    return this.title;
  }

  recordingTrack() {
    if (this.stateRecord == false) {
      //console.log('start recording');
      this.input.gain.value = 1;
      this.statePlay = false;

      this.stopSample();
      this.clearCanvas();
      this.recorder.start();

      this.buttonPlayImg.setAttribute('icon', 'av:play-circle-filled');
      this.buttonRecImg.setAttribute('style', 'fill:red;');
      this.buttonDlImg.setAttribute('style', 'fill: #fff');
    }
    if (this.stateRecord == true) {
      //console.log('stop recording');
      this.input.gain.value = 0;

      this.recorder.stop()

      this.buttonRecImg.setAttribute('style', 'fill:#fff;');
      this.buttonDlImg.setAttribute('style', 'fill: rgb(191, 255, 194);');
    }
    this.stateRecord = !this.stateRecord;
    this.pausedAt = undefined;
    this.startedAt = 0;
  }

  stopSample() {
    console.log('stop sample');
    if (this.bufferSourceNode) {
      this.bufferSourceNode.disconnect();
      this.bufferSourceNode = undefined;
    }
  }

  recreateBuffer() {
    let parent = this;
    this.statePlay = false;
    //if(this.bufferSourceNode) this.bufferSourceNode.disconnect();
    this.bufferSourceNode = this.ac.createBufferSource();
    this.bufferSourceNode.buffer = this.sample;

    //this.bufferSourceNode.connect(this.output);
    //this.bufferSourceNode.disconnect(this.output);

    this.bufferSourceNode.onended = function () {
      //console.log("Etape 2");
      parent.recreateBuffer();
    }
    this.buttonLoopImg.setAttribute('style', 'fill : white;');
    if (this.stateLoop) {
      this.bufferSourceNode.loop = true;
      this.buttonLoopImg.setAttribute('style', 'fill : rgb(191, 255, 194);')
    }
    this.buttonPlayImg.setAttribute('icon', 'av:play-circle-filled');
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
      console.log("recording...")
    }
    this.fileReader.onload = function () {
      parent.arrayBuffer = this.result;
      parent.ac.decodeAudioData(parent.arrayBuffer, function (decoded) {
        console.log('finished!', decoded.length);
        parent.useSample(decoded);
      }, function (fail) {
        console.error('fail!', fail);
      });
    }
    this.fileReader.readAsArrayBuffer(this.blob);
  }

  useSample(sample) {
    let parent = this;
    if (this.bufferSourceNode) {
      this.bufferSourceNode.disconnect()
    }

    this.sample = sample
    this.recreateBuffer();
    this.data = [];
    this.channelData = sample.getChannelData(0);

    for (let i = 0; i < this.channelData.length; i++) {
      this.data.push(this.channelData[i]);
    }

    this.RenderWave(this.canvas, this.data);
  }

  download() {
    if (!this.stateRecord && this.bufferSourceNode) {
      let parent = this;
      this.url = window.URL.createObjectURL(this.blob);
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
        this.output.gain.value = this.volume;
      }
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

  RenderWave(canvas, data) {
    let context = this.canvas.getContext('2d');
    let canvasWidth = this.canvas.width;
    let canvasHeigth = this.canvas.height;
    let canvasHalfHeight = canvasHeigth * 0.5;

    this.bufferLength = data.length;

    context.fillStyle = 'rgb(85, 85, 85)';
    context.fillRect(0, 0, canvasWidth, canvasHeigth);
    context.lineWidth = 1;
    context.strokeStyle = 'rgb(205, 205, 205)';
    context.beginPath();

    let sliceWidth = canvasWidth * 1.0 / this.bufferLength;
    let x = 0 - sliceWidth;

    for (let i = 0; i < this.bufferLength; i++) {
      let v = 1 - this.data[i];
      let y = v * canvasHalfHeight;

      if (i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }

      x += sliceWidth;
    }

    context.lineTo(canvasWidth, canvasHalfHeight);
    context.stroke();
  }

  MaximiseSampleInPlace(sample) {
    //console.log('maximise sample in place');
    let length = sample.length;
    let numChannels = sample.numberOfChannels;
    let maxValue = 0;

    for (let i = 0; i < numChannels; i++) {
      this.data = sample.getChannelData(i);

      for (let j = 0; j < length; j++) {
        let value = Math.abs(this.data[j]);
        maxValue = Math.max(value, maxValue);
      }
    }

    let amp = 1.0 / maxValue;

    for (let i = 0; i < numChannels; i++) {
      //let inData = sample.getChannelData(i);
      for (let j = 0; j < length; j++) {
        let value = this.data[j];
        this.data[j] = value * amp;
      }
    }
  }

  deleteTrack() {
    this.shadowRoot.remove();
  }
}

