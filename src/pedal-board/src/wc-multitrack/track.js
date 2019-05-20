class Track {
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
    this.output = this.ac.createGain();
    this.dest = this.ac.createMediaStreamDestination();

    // Build graph
    this.input.connect(this.output);
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

    // Icon buttons element
    //this.buttonPlayImg;
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

    // Element value
    this.volume = volume;
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

  }

  callListeners() {
    // Buttons assigned with query selector
    let parent = this;
    this.titleTrack = this.shadowRoot.querySelector('#title');
    this.deleteButton = this.shadowRoot.querySelector('#delete')
    this.recordButton = this.shadowRoot.querySelector('#record');
    //this.playButton = this.shadowRoot.querySelector('#play');
    this.muteButton = this.shadowRoot.querySelector("#mute");
    this.dlButton = this.shadowRoot.querySelector('#download');
    this.titleTrack = this.shadowRoot.querySelector('#title');
    this.addButton = this.shadowRoot.querySelector('#addTrack');

    // Buttons icons assigned with query selector
    this.buttonRecImg = this.shadowRoot.querySelector('#btn_rec_img');
    this.buttonPlayImg = this.shadowRoot.querySelector('#btn_play_img');
    this.buttonMuteImg = this.shadowRoot.querySelector('#btn_mute_img');
    this.buttonDlImg = this.shadowRoot.querySelector('#btn_dl_img');

    // Volume range slider assigned with query selector
    this.volumeRange = this.shadowRoot.querySelector('#volume');

    // Canvas assigned with query selector
    this.canvas = this.shadowRoot.querySelector('canvas');

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
        parent.canvas.addEventListener('click', parent.timerWave.bind(parent, parent.canvas));
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
    if(!this.needResize){
    if (this.stateRecord == false) {
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
    console.log('stop sample');
    if (this.bufferSourceNode) {
      this.bufferSourceNode.disconnect();
      this.bufferSourceNode = undefined;
    }
  }

  recreateBuffer() {
    let parent = this;
    this.statePlay = false;
    if(this.addTime>0){
      this.oldBufferSourceNode = this.bufferSourceNode;
      this.bufferSourceNode = this.ac.createBufferSource();
      this.bufferSourceNode.buffer = this.oldBufferSourceNode.buffer;
    } else {
    this.bufferSourceNode = this.ac.createBufferSource();
    this.bufferSourceNode.buffer = this.sample;
    }
    this.bufferSourceNode.onended = function () {
      parent.recreateBuffer();
    }
    if (this.stateLoop) {
      this.bufferSourceNode.loop = true;
    }
    //TODO: erase it
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

    // 8640000 correspond to 3 mins. To get one sec: 8640000/3/60. This values will be a var soon.
    let sliceWidth = canvasWidth * 1.0 / this.bufferLength * 100;
    let x = 0 - sliceWidth;
    //console.log(sliceWidth);
    //console.log(this.bufferLength);

    for (let i = 0; i < this.bufferLength / 100; i++) {
      let v = 1 - this.data[i * 100];
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

  timerWave(canvas, e) {
    if (this.bufferSourceNode) {
      // 8640000 correspond to 3 mins. To get one sec: 8640000/3/60. This values will be a var soon.
      this.clearCanvas();
      this.RenderWave(this.canvas, this.data)
      let playBar = this.canvas.getContext('2d');
      //playBar.fillStyle = 'red';
      playBar.lineWidth = 5;
      playBar.strokeStyle = 'red';
      let canvasWidth = this.canvas.width;
      let canvasHeigth = this.canvas.height;
      let canvasHalfHeight = canvasHeigth * 0.5;
      let maxDuration = this.bufferLength / 48000;
      let pos = (e.clientX - canvas.offsetLeft) / canvas.offsetWidth;
      let timeStamp = Math.floor(pos * maxDuration * 1000);
      let min = Math.floor(timeStamp / 1000 / 60);
      let sec = Math.floor((timeStamp / 1000 - min * 60) * 100) / 100;
      console.log(pos);
      console.log("TimeStamp =  " + timeStamp);
      console.log(min + " minutes et " + sec + " secondes.");
      playBar.beginPath();
      playBar.moveTo(canvasWidth * pos, 0);
      playBar.lineTo(canvasWidth * pos, canvasHeigth);
      playBar.stroke();
    } else {
      console.log("this buffer source node doesnt exists");
    }
  }

  /*MaximiseSampleInPlace(sample) {
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
  }*/

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

        this.bufferSourceNode.connect(this.output);
        this.buttonPlayImg.setAttribute('icon', 'av:pause');
      } else if (this.statePlay == true) {
        this.bufferSourceNode.stop()
        this.recreateBuffer();
        this.pausedAt = Date.now() - this.startedAt;
        // time ellapsed allow us to update playAt value when paused/played.
        this.timeEllapsed = Date.now();
        this.buttonPlayImg.setAttribute('icon', 'av:play-circle-filled');
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
      let n = this.addTime;
      parent = this;
      let length = n;
      let context = new AudioContext;
      length = length * 48000;
      let arrayBuffer = context.createBuffer(2, length, 48000);
      console.log(this.bufferSourceNode);
      let buffer = this.appendBuffer(this.bufferSourceNode.buffer, arrayBuffer);
      this.bufferSourceNode = this.ac.createBufferSource();
      this.bufferSourceNode.buffer = buffer;
      console.log(this.bufferSourceNode);
      console.log(this.sample);
      this.bufferSourceNode.onended = function () {
        parent.recreateBuffer();
      }
      if (this.stateLoop) {
        this.bufferSourceNode.loop = true;
      }
      this.useSample(buffer);
      this.addTime = 0;
    }
  }

  appendBuffer(buffer1, buffer2) {
    let context = new AudioContext;
    let numberOfChannels = Math.min(buffer1.numberOfChannels, buffer2.numberOfChannels);
    let tmp = context.createBuffer(numberOfChannels, (buffer1.length + buffer2.length), buffer1.sampleRate);
    for (let i = 0; i < numberOfChannels; i++) {
      let channel = tmp.getChannelData(i);
      channel.set(buffer1.getChannelData(i), 0);
      channel.set(buffer2.getChannelData(i), buffer1.length);
    }
    return tmp;
  }
}

