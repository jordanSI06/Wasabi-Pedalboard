(function () {

  // Current document needs to be defined to get DOM access to imported HTML
  const _currentDoc = document.currentScript.ownerDocument;

  // Register the x-custom element with the browser
  customElements.define('wc-multitrack', class extends HTMLElement {

    // ----- METHODS: DEFAULT -----
    // is called when an instance of the element is created
    constructor() {
      super();

      //Global Context of Pedalboard
      this.gc = GlobalContext;

      //Graphic Element
      const parent = this;
      this.recordButton;
      this.stopButton;
      this.dlButton;
      this.canvas;

      //Audio element
      this.ac = new AudioContext();
      this.recorder;
      this.limiter = this.ac.createDynamicsCompressor();
      this.limiter.connect(this.ac.destination);

      //File element
      this.blob;
      this.recordedBlobs = [];
      this.fileReader;
      this.arrayBuffer;
      this.bufferSourceNode;
      this.data;
      this.channelData;
      this.url;
      this.link;

      this.params = {

      }

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

      //Extract attribute
      let parent = this;
      this.recordButton = this.shadowRoot.querySelector('#record');
      this.stopButton = this.shadowRoot.querySelector('#stop');
      this.dlButton = this.shadowRoot.querySelector('#download')
      this.canvas = this.shadowRoot.querySelector('canvas');
      navigator.mediaDevices.getUserMedia({
        audio: true
      })
        .then(function (stream) {
          parent.recordButton.disabled = false;
          parent.recordButton.addEventListener('click', parent.startRecording.bind(parent));
          parent.stopButton.addEventListener('click', parent.stopRecording.bind(parent));
          parent.dlButton.addEventListener('click', parent.download.bind(parent));
          parent.recorder = new MediaRecorder(stream);
          parent.recorder.addEventListener('dataavailable', parent.onRecordingReady.bind(parent));

          console.log('recorder is ready');
        });
    }
    // ----- METHODS: CUSTOM -----

    startRecording() {
      console.log('start recording');
      this.recordButton.disabled = true;
      this.stopButton.disabled = false;

      this.stopSample();

      this.recorder.start();
    }

    stopRecording() {
      console.log('stop recording');
      this.recordButton.disabled = false;
      this.stopButton.disabled = true;

      this.recorder.stop()
    }
    stopSample() {
      console.log('record something');
      this.startRecording();
    }

    onRecordingReady(e) {
      let parent = this;
      console.log("onRecordingReady");
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
      if (this.bufferSourceNode) {
        this.bufferSourceNode.stop();
        this.bufferSourceNode.disconnect()
      }

      this.bufferSourceNode = this.ac.createBufferSource();
      this.bufferSourceNode.loop = true;
      this.bufferSourceNode.connect(this.limiter);
      this.bufferSourceNode.start();

      this.data = [];
      this.channelData = sample.getChannelData(0);

      for (let i = 0; i < this.channelData.length; i++) {
        this.data.push(this.channelData[i]);
      }

      this.RenderWave(this.canvas, this.data);
    }

    download() {
      let parent = this;
      this.blob = new Blob(this.recordedBlobs, { type: 'audio/wav' });
      this.url = window.URL.createObjectURL(this.blob);
      this.link = document.createElement('a');
      this.link.style.display = 'none';
      this.link.href = this.url;
      this.link.download = 'pedalboard_song.wav';
      document.body.appendChild(this.link);
      this.link.click();

      setTimeout(function () {
        document.body.removeChild(parent.link);
        window.URL.revokeObjectURL(parent.url);
      }, 100);
    }

    stopSample() {
      console.log('stop sample');
      if (this.bufferSourceNode) {
        this.bufferSourceNode.stop();
        this.bufferSourceNode.disconnect();
        this.bufferSourceNode = undefined;
      }
    }

    RenderWave(canvas, data) {
      let context = this.canvas.getContext('2d');
      let canvasWidth = this.canvas.width;
      let canvasHeigth = this.canvas.height;
      let canvasHalfHeight = canvasHeigth * 0.5;

      this.bufferLength = data.length;

      context.fillStyle = 'rgb(255, 255, 255)';
      context.fillRect(0, 0, canvasWidth, canvasHeigth);

      context.lineWidth = 1;
      context.strokeStyle = 'rgb(0, 0, 0)';

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
      console.log('maximise sample in place');
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

  });
})();