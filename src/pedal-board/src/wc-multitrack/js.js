(function () {

  // Current document needs to be defined to get DOM access to imported HTML
  const _currentDoc = document.currentScript.ownerDocument;

  // Register the x-custom element with the browser
  customElements.define('wc-multitrack', class extends HTMLElement {

    // ----- METHODS: DEFAULT -----
    // is called when an instance of the element is created
    constructor() {
      super();

      // Global Context of Pedalboard
      this.ac = GlobalContext.context;

      // Graph node creation
      this.input = this.ac.createGain();
      this.input.gain.value = 0;
      this.output = this.ac.createGain();
      this.dest = this.ac.createMediaStreamDestination();

      // Build graph
      this.input.connect(this.output);
      this.output.connect(this.dest); // associated to MediaRecorder

      // Graphic Element
      this.recordButton;
      this.playButton;
      this.stopButton;
      this.loopButton;
      this.dlButton;
      this.titleTrack;
      this.volumeRange;
      this.canvas;
      this.addButton;


      // Icon buttons element
      this.buttonRecImg;
      this.buttonPlayImg;
      this.buttonStopImg;
      this.buttonLoopImg;
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
      this.trackId = 1;

      // Start/Pause manager time
      this.startedAt;
      this.pausedAt;
      this.timeEllapsed;

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

    getInput() {
      return this.input;
    }

    getOutput() {
      return this.output;
    }
    get is() { return this.nodeName.toLowerCase(); }

    // observedAttributes : Specify observed attributes so that attributeChangedCallback will work
    static get observedAttributes() { return ['']; }

    // appelé lorsque l'un des attributs de l'élément personnalisé est ajouté, supprimé ou modifié.
    attributeChangedCallback() {
      console.log(`Custom element ${this.is} attributes changed.`);
    }

    // appelé lorsque l'élément personnalisé est déplacé vers un nouveau document
    adoptedCallback() {
      console.log(`Custom element ${this.is} moved to new page.`);
    }

    // appelé lorsque l'élément personnalisé est déconnecté du DOM du document 
    disconnectedCallback() {
      console.log(`Custom element ${this.is} removed from page.`);
    }

    // is called every time the element is inserted into the DOM. It is useful for running setup code, such as fetching resources or rendering.
    // appelé lorsque l'élément personnalisé est connecté pour la première fois au DOM du document
    connectedCallback() {
      //console.log(`Custom element ${this.is} added to page.`);

      // Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
      const shadowRoot = this.attachShadow({ mode: `open` });
      const template = _currentDoc.querySelector(`template`);
      const instance = template.content.cloneNode(true);
      shadowRoot.appendChild(instance);

      //Extract attribute from parents
      let parent = this;

      // Buttons assigned with query selector
      this.titleTrack = this.shadowRoot.querySelector('#title')
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
          parent.recordButton.addEventListener('click', parent.recordingTrack.bind(parent));
          parent.stopButton.addEventListener('click', parent.stopTrack.bind(parent));
          parent.dlButton.addEventListener('click', parent.download.bind(parent));
          parent.volumeRange.addEventListener('input', parent.changeVolume.bind(parent));
          parent.playButton.addEventListener('click', parent.playingTrack.bind(parent));
          parent.muteButton.addEventListener('click', parent.muteVolume.bind(parent));
          parent.recorder = new MediaRecorder(parent.dest.stream);
          parent.recorder.addEventListener('dataavailable', parent.onRecordingReady.bind(parent));
          parent.loopButton.addEventListener('click', parent.loopTrack.bind(parent));
          parent.titleTrack.addEventListener('click', parent.changeTilte.bind(parent));
          parent.addButton.addEventListener('click', parent.addTrack.bind(parent));
          //console.log('recorder is ready');
        });
    }
    // ----- METHODS: CUSTOM -----

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

    //TODO: exception with audio start
    stopTrack() {
      if (this.bufferSourceNode && this.statePlay == true) {
        //this.bufferSourceNode.stop();
        this.bufferSourceNode.disconnect();
        this.recreateBuffer();
        this.pausedAt=undefined;
      }
      else if (this.bufferSourceNode && this.statePlay == false) {
        //this.bufferSourceNode.start();
        //this.bufferSourceNode.stop();
        this.bufferSourceNode.disconnect();
        this.recreateBuffer();
        this.pausedAt=undefined;
      }
      else {
        console.warn("You cannot stop when a track who doesn't exist!")
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

    loopTrack() {
      if (this.bufferSourceNode) {
        if (this.stateLoop == false) {
          this.bufferSourceNode.loop = true;
          this.buttonLoopImg.setAttribute('style', 'fill : rgb(191, 255, 194);')
        } else {
          this.bufferSourceNode.loop = false;
          this.buttonLoopImg.setAttribute('style', 'fill : white;')
        }
        this.stateLoop = !this.stateLoop;
      }
    }

    changeTilte() {
      let nameTrack = prompt('Please type the title of your track (between 1-20 characters): ');
      if (nameTrack.length > 20 && nameTrack.length > 0) {
        alert("Enter a shorter name (1 to 20 character allowed)");
        this.changeTilte();
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

    stopSample() {
      console.log('stop sample');
      if (this.bufferSourceNode) {
        this.bufferSourceNode.disconnect();
        this.bufferSourceNode = undefined;
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

    createDiv() {
      this.main = this.shadowRoot.querySelector('#main');
      var div = document.createElement("div");
      div.setAttribute('id', 'trackN' + this.trackId);
      this.main.appendChild(div);
    }

    addTrack() {
      /*
      * TODO: Create a i var for id, the button must to be usable with this js and
      * have 4 track max
      */
      if (this.shadowRoot.querySelectorAll("[id^=trackN]").length < 3) {
        this.createDiv();
        this.main = this.shadowRoot.querySelector('#trackN' + this.trackId);
        var track = new Track(this.trackId, this.shadowRoot.querySelector('#onetrack'));
        var track_clone = track.trackCreation.cloneNode(true);
        console.log(track.trackCreation);
        console.log(this.main);
        this.main.appendChild(track_clone);
        this.shadowRoot.querySelector("#trackN" + this.trackId + " #title").textContent = track.titleCreation;
        this.trackId++;
      } else {
        console.warn("Too much tracks buddy! You need premium.")
      }
    }

  });
})();