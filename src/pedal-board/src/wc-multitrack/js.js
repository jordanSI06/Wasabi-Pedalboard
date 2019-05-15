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
      this.input.gain.value = 1;
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
      this.deleteButton;


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
      this.trackId = 0;
      this.trackHTML;
      this.trackEntity = [];

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
      //this.titleTrack = this.shadowRoot.querySelector('#title');
      this.addButton = this.shadowRoot.querySelector('#addTrack');
      this.deleteButton = this.shadowRoot.querySelector('#delete');

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
          parent.shadowRoot.onload = parent.stockTrack();
          parent.recordButton.addEventListener('click', parent.recordingTrack.bind(parent));
          parent.stopButton.addEventListener('click', parent.stopTrack.bind(parent));
          parent.dlButton.addEventListener('click', parent.download.bind(parent));
          parent.volumeRange.addEventListener('input', parent.changeVolume.bind(parent));
          parent.playButton.addEventListener('click', parent.playingTrack.bind(parent));
          parent.muteButton.addEventListener('click', parent.muteVolume.bind(parent));
          parent.recorder = new MediaRecorder(parent.dest.stream);
          parent.recorder.addEventListener('dataavailable', parent.onRecordingReady.bind(parent));
          parent.loopButton.addEventListener('click', parent.loopTrack.bind(parent));
          //parent.titleTrack.addEventListener('click', parent.changeTilte.bind(parent));
          parent.addButton.addEventListener('click', parent.addTrack.bind(parent));
          parent.deleteButton.addEventListener('click', parent.deleteTrackFromArray.bind(parent));
          //console.log('recorder is ready');
        });
    }
    // ----- METHODS: CUSTOM -----

    stockTrack() {
      this.trackHTML = this.shadowRoot.querySelector('#onetrack0');
      this.shadowRoot.querySelector('#onetrack0').remove();
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

    /*loopTrack() {
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
    }*/

    loopTrack() {
      if (this.stateLoop == false) {
        for (let i = 0; i < this.trackEntity.length; i++) {
          if (this.trackEntity[i].bufferSourceNode) {
            this.trackEntity[i].bufferSourceNode.loop = true;
            console.log(this.trackEntity[i].bufferSourceNode.loop);
          }
        }
        this.buttonLoopImg.setAttribute('style', 'fill : rgb(191, 255, 194);')
      } else if (this.stateLoop == true) {
        for (let i = 0; i < this.trackEntity.length; i++) {
          if (this.trackEntity[i].bufferSourceNode) {
            this.trackEntity[i].bufferSourceNode.loop = false;
            console.log(this.trackEntity[i].bufferSourceNode.loop);
          }
        }
        this.buttonLoopImg.setAttribute('style', 'fill : white;')
      }
      this.stateLoop = !this.stateLoop;
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

    changeVolume(e){
      this.volume = e.target.value/100;
      for(let i = 0; i < this.trackEntity.length; i++){
        if(this.trackEntity[i].bufferSourceNode){
          if(!this.trackEntity[i].stateMute){
            this.output.gain.value = this.volume;
          }
        }
      }
    }

    createDiv() {
      this.main = this.shadowRoot.querySelector('#main');
      //The div will be created in the shadow-root
      let div = document.createElement("div");
      div.setAttribute('id', 'trackN' + this.trackId);
      this.main.appendChild(div);
    }

    addTrack() {
      let parent = this;
      if (this.shadowRoot.querySelectorAll("[id^=trackN]").length < 4) {
        //Create the div HTML element
        this.createDiv();
        //Select the div to clone the HTML content
        this.main = this.shadowRoot.querySelector('#trackN' + this.trackId);
        //Create the track object
        let track = new Track(this.trackId, this.trackHTML, this.stateLoop, this.volume);
        //Push the track in array
        this.trackEntity.push(track);
        console.log(this.trackEntity);
        //Clone the div template
        let track_clone = this.trackEntity[this.trackEntity.length - 1].getTrackHTML.cloneNode(true);
        //Create the content inside the div
        this.main.appendChild(track_clone);
        //Call the listeners of the track
        track.callListeners();
        this.eventListenerUpdate("#trackN" + this.trackId);
        this.input.connect(this.trackEntity[this.trackEntity.length - 1].getInput());
        this.trackEntity[this.trackEntity.length - 1].getInput().connect(this.trackEntity[this.trackEntity.length - 1].getOutput());
        this.trackEntity[this.trackEntity.length - 1].getOutput().connect(this.output);
        this.output.connect(this.dest);
        this.trackId++;
      } else {
        console.warn("Too much tracks buddy! You need premium.")
      }
    }

    eventListenerUpdate(dom) {
      let parent = this;
      let btnDelete = this.shadowRoot.querySelector(dom + ' #delete');
      btnDelete.addEventListener('click', this.deleteTrackFromArray.bind(parent, btnDelete));
    }

    getDivParent(dom) {
      let divSearch = dom.parentNode.id;
      dom = dom.parentNode;
      divSearch = divSearch.slice(0, 6);
      while (divSearch != "trackN") {
        divSearch = dom.parentNode.id;
        dom = dom.parentNode;
        divSearch = divSearch.slice(0, 6);
      }
      return (dom);
    }

    deleteTrackFromArray(dom) {

      console.log(dom);
      let element = this.getDivParent(dom);
      for (let i = 0; i < this.trackEntity.length; i++) {
        if (element == this.trackEntity[i].shadowRoot) {
          console.log(this.trackEntity[i].shadowRoot)
          this.trackEntity.splice(i, 1);
        }
      }
      console.log(this.trackEntity);
    }

  });
})();