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
      //this.dest = this.ac.createMediaStreamDestination();

      // Build graph
      //this.input.connect(this.output);
      //this.output.connect(this.dest); // associated to MediaRecorder

      // Graphic Element
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
      this.buttonPlayImg;
      this.buttonStopImg;
      this.buttonLoopImg;
      this.buttonMuteImg;
      this.buttonDlImg;

      // Element state
      this.statePlay = false;
      this.statePause = false;
      this.stateMute = false;
      this.stateLoop = false;
      this.stateNewBar = true;
      this.countStateRecord=0;
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

      // mouse coordinate
      this.xcor;
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
      this.stopButton = this.shadowRoot.querySelector('#stop');
      this.playButton = this.shadowRoot.querySelector('#play');
      this.muteButton = this.shadowRoot.querySelector("#mute");
      this.loopButton = this.shadowRoot.querySelector('#loop');
      this.dlButton = this.shadowRoot.querySelector('#download');
      //this.titleTrack = this.shadowRoot.querySelector('#title');
      this.addButton = this.shadowRoot.querySelector('#addTrack');
      this.deleteButton = this.shadowRoot.querySelector('#delete');

      // Buttons icons assigned with query selector
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
          parent.stopButton.addEventListener('click', parent.setStopTrack.bind(parent));
          parent.dlButton.addEventListener('click', parent.download.bind(parent));
          parent.volumeRange.addEventListener('input', parent.changeVolume.bind(parent));
          parent.playButton.addEventListener('click', parent.setPlayTrack.bind(parent));
          //parent.muteButton.addEventListener('click', parent.muteVolume.bind(parent));
          //parent.recorder = new MediaRecorder(parent.dest.stream);
          //parent.recorder.addEventListener('dataavailable', parent.onRecordingReady.bind(parent));
          parent.loopButton.addEventListener('click', parent.setLoopTrack.bind(parent));
          //parent.titleTrack.addEventListener('click', parent.changeTilte.bind(parent));
          parent.addButton.addEventListener('click', parent.addTrack.bind(parent));
          parent.addButton.addEventListener('mouseover', parent.addTrackButtonOver.bind(parent));
          parent.addButton.addEventListener('mouseout', parent.addTrackButtonOut.bind(parent));
          parent.deleteButton.addEventListener('click', parent.deleteTrackFromArray.bind(parent));
          //console.log('recorder is ready');
        });
    }
    // ----- METHODS: CUSTOM -----

    getMouseX(e) {
      this.xcor = e.clientX;
    }

    addTrackButtonOver() {
      this.addButton.setAttribute('style', 'background-color: #888')
    }

    addTrackButtonOut() {
      this.addButton.setAttribute('style', 'background-color: #333')
    }
    // ----- Method of the menu -----
    stockTrack() {
      this.trackHTML = this.shadowRoot.querySelector('#onetrack0');
      this.shadowRoot.querySelector('#onetrack0').remove();
    }

    setPlayTrack() {
      if (this.buttonPlayImg.icon == 'av:play-circle-filled') this.statePlay = false;
      for (let i = 0; i < this.trackEntity.length; i++) {
        this.trackEntity[i].playingTrack();
      }
      if (this.statePlay == false) {
        this.buttonPlayImg.setAttribute('icon', 'av:pause');
        let time = Date.now();
        for (let i = 0; i < this.trackEntity.length; i++) {
          this.trackEntity[i].stockCurrentTime = time;
          this.trackEntity[i].raf = window.requestAnimationFrame(() => this.trackEntity[i].draw(this.trackEntity[i].canvasBar.getContext('2d')));
        }
      }
      else {
        this.buttonPlayImg.setAttribute('icon', 'av:play-circle-filled');
        for (let i = 0; i < this.trackEntity.length; i++) {
          window.cancelAnimationFrame(this.trackEntity[i].raf);
        }
        for (let i = 0; i < this.trackEntity.length; i++) {
          this.trackEntity[i].playBarDisplay.oldx = this.trackEntity[i].playBarDisplay.x;
        }
      }
      this.statePlay = !this.statePlay;
    }

    setStopTrack() {
      for (let i = 0; i < this.trackEntity.length; i++) {
        this.trackEntity[i].stopTrack();
      }
      this.buttonPlayImg.setAttribute('icon', 'av:play-circle-filled');
      this.statePlay = false;
    }

    setLoopTrack() {
      if (this.stateLoop == false) {
        for (let i = 0; i < this.trackEntity.length; i++) {
          this.trackEntity[i].loopTrack();
          this.trackEntity[i].stateLoop = true;
        }
        this.buttonLoopImg.setAttribute('style', 'fill : rgb(191, 255, 194);')
      }
      else if (this.stateLoop == true) {
        for (let i = 0; i < this.trackEntity.length; i++) {
          this.trackEntity[i].loopTrack();
          this.trackEntity[i].stateLoop = false;
        }
        this.buttonLoopImg.setAttribute('style', 'fill : white;')
      }
      this.stateLoop = !this.stateLoop;
    }

    /*checkMaxTime(){
      for (let i = 0; i < this.trackEntity.length; i++) {
        if(this.trackEntity[i+1].bufferSourceNode.buffer.duration > this.trackEntity[i].bufferSourceNode.buffer.duration);{
          this.maxTime=this.trackEntity[i+1].bufferSourceNode.buffer.duration;
          this.trackEntity[i+1].bufferSourceNode.buffer.duration = this.maxTime;
        }
      }
    }*/

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
      for (let i = 0; i < this.trackEntity.length; i++) {
        if (this.trackEntity[i].bufferSourceNode) {
          if (!this.trackEntity[i].stateMute) {
            this.output.gain.value = this.volume;
          }
        }
      }
    }

    // ----- Method of the creation of track -----

    createDiv() {
      this.main = this.shadowRoot.querySelector('#main');
      //The div will be created in the shadow-root
      let div = document.createElement("div");
      div.setAttribute('id', 'trackN' + this.trackId);
      this.main.appendChild(div);
    }

    addTrack() {
      if (this.shadowRoot.querySelectorAll("[id^=trackN]").length < 4) {
        //Create the div HTML element
        this.createDiv();
        //Select the div to clone the HTML content
        this.main = this.shadowRoot.querySelector('#trackN' + this.trackId);
        //Create the track object
        let track = new Track(this.trackId, this.trackHTML, this.stateLoop, this.volume);
        //Push the track in array
        this.trackEntity.push(track);
        this.checkVolumeMax();
        //console.log(this.trackEntity);
        //Clone the div template
        let track_clone = this.trackEntity[this.trackEntity.length - 1].getTrackHTML.cloneNode(true);
        //Create the content inside the div
        this.main.appendChild(track_clone);
        //Call the listeners of the track
        track.callListeners();
        this.eventListenerUpdate("#trackN" + this.trackId);
        this.input.connect(this.trackEntity[this.trackEntity.length - 1].getInput());
        this.trackEntity[this.trackEntity.length - 1].getOutput().connect(this.output);
        this.trackId++;
      } else {
        console.warn("Too much tracks buddy! You need premium.")
      }
    }

    eventListenerUpdate(dom) {
      let btnDelete = this.shadowRoot.querySelector(dom + ' #delete');
      let btnRecord = this.shadowRoot.querySelector(dom + ' #record');
      let canvas = this.shadowRoot.querySelector(dom + ' #bar');
      btnDelete.addEventListener('click', this.deleteTrackFromArray.bind(this, btnDelete));
      btnRecord.addEventListener('blur', this.regulateTime.bind(this, btnRecord));
      canvas.addEventListener('mousedown', this.getMouseX.bind(this));
      canvas.addEventListener('mousedown', this.timeSelector.bind(this, canvas));
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
      // console.log(dom);
      let element = this.getDivParent(dom);
      for (let i = 0; i < this.trackEntity.length; i++) {
        if (element == this.trackEntity[i].shadowRoot) {
          //   console.log(this.trackEntity[i].shadowRoot)
          this.trackEntity[i].stopSample();
          this.input.disconnect(this.trackEntity[i].getInput());
          this.trackEntity[i].getOutput().disconnect(this.output);
          this.trackEntity.splice(i, 1);
        }
      }
      this.checkMaxTime();
      this.checkVolumeMax();
      //console.log(this.trackEntity);
    }

    regulateTime() {
      this.countStateRecord=0;
      let time = this.checkMaxTime();
      let addtime = 0;
      for(let i=0;i<this.trackEntity.length;i++){
        if(this.trackEntity[i].stateRecord) {this.countStateRecord += 42;}
      }
      for (let i = 0; i < this.trackEntity.length; i++) {
        this.trackEntity[i].canvasBar.getContext('2d').clearRect(0, 0, 2000, 100)
        if (this.trackEntity[i].bufferSourceNode) {
          if (this.countStateRecord==0) {
          addtime = time - this.trackEntity[i].bufferSourceNode.buffer.duration;
          if (addtime > 0) {
            this.trackEntity[i].addTime = addtime;
            this.trackEntity[i].addEmptyAudio();
          }
          //console.log(this.trackEntity[i].stateRecord);
          this.setStopTrack();}

        }

      }
    }

    checkMaxTime() {
      let trackDurationMax = 0;
      for (let i = 0; i < this.trackEntity.length; i++) {
        if (this.trackEntity[i].bufferSourceNode && !this.trackEntity[i].stateRecord) {
          trackDurationMax = Math.max(this.trackEntity[i].bufferSourceNode.buffer.duration, trackDurationMax);
        }
      }
      //console.log(this.terackDurationMax);
      return trackDurationMax;
    }

    timeSelector(e) {
      for (let i = 0; i < this.trackEntity.length; i++) {
        if (this.trackEntity[i].bufferSourceNode) {
          this.trackEntity[i].renderBar(this.xcor);
        }
      }
    }

    checkVolumeMax() {
      for (let i = 0; i < this.trackEntity.length; i++) {
        this.trackEntity[i].volume = this.trackEntity[i].volume / this.trackEntity.length;
        this.trackEntity[i].volumeMax = 100 / this.trackEntity.length;
      }
    }

    // HERE, WE ARE GOING TO CREATE THE GESTURE OF DYNAMIC BAR. WE SHOULD CALL THE STATE IN TRACK.JS AND MAKE SURE THAT EVERY SLICE ARE THE SAME. SHOULD CONFIGURE THIS HERE
    //this.trackEntity[i].playBarDisplay.vx = this.trackEntity[i].canvasDiv.clientWidth / (this.trackEntity[i].bufferSourceNode.buffer.duration * 60);
  });
})();

