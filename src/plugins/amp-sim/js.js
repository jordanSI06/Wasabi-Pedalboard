/**
 * `amp-sim`
 * 
 *
 * @customElement
 * @demo demo/index.html
 */
(function () {

  // Current document needs to be defined to get DOM access to imported HTML
  const _currentDoc = document.currentScript.ownerDocument;

  // Register the x-custom element with the browser
  customElements.define(`amp-sim`, class extends PBPlugin(HTMLElement) {

    // ----- METHODS: DEFAULT -----
    // is called when an instance of the element is created
    constructor() {
      // Toujours appeler "super" d'abord dans le constructeur
      super();

      // Ecrire la fonctionnalité de l'élément ici
      this.w = 742;
      this.h = 183;

      this.nbNodeIn = 1;
      this.nbNodeOut = 1;

      this.switchToggleSrc = this.resolveUrl("./src/img/switch_toggle.png");
      this.switchBoostSrc = this.resolveUrl("./src/img/boostSwitch.png");
      this.sliderBackgroundSrc = this.resolveUrl("./src/img/vsliderbody.png");
      this.sliderKnobSrc = this.resolveUrl("./src/img/vsliderknob.png");
      this.knobSrc = this.resolveUrl("./src/img/Prophet.png");
      this.showPreamp = false;
      this.showEqualizer = false;
      // for Wave Shaper Curves visualization
      this.DRAWER_CANVAS_SIZE = 100;
      this.wsFactory = new WaveShapers();
      this.demoSampleURLs = [
        this.resolveUrl("./src/assets/audio/Guitar_DI_Track.mp3"),
        this.resolveUrl("./src/assets/audio/LasseMagoDI.mp3"),
        this.resolveUrl("./src/assets/audio/RawPRRI.mp3"),
        this.resolveUrl("./src/assets/audio/Di-Guitar.mp3"),
        this.resolveUrl("./src/assets/audio/NarcosynthesisDI.mp3"),
        this.resolveUrl("./src/assets/audio/BlackSabbathNIB_rythmDI.mp3"),
        this.resolveUrl("./src/assets/audio/BlackSabbathNIBLead_DI.mp3"),
        this.resolveUrl("./src/assets/audio/BasketCase Greenday riff DI.mp3"),
        this.resolveUrl("./src/assets/audio/InBloomNirvanaRiff1DI.mp3"),
        this.resolveUrl("./src/assets/audio/Muse1Solo.mp3"),
        this.resolveUrl("./src/assets/audio/Muse2Rythm.mp3")
      ];

      this.presets = [{
        "name": "Hard Rock classic 1",
        "boost": false,
        "LS1Freq": 720,
        "LS1Gain": -6,
        "LS2Freq": 320,
        "LS2Gain": -5,
        "gain1": 1,
        "distoName1": "asymetric",
        "K1": "7.8",
        "HP1Freq": 6,
        "HP1Q": 0.707099974155426,
        "LS3Freq": 720,
        "LS3Gain": -6,
        "gain2": 1,
        "distoName2": "notSoDistorded",
        "K2": "7.8",
        "OG": "7.0",
        "BF": "8.2",
        "MF": "8.2",
        "TF": "3.8",
        "PF": "6.9",
        "EQ": [5, 11, -6, -10, 7, 2],
        "MV": "7.2",
        "RN": "Fender Hot Rod",
        "RG": "2.0",
        "CN": "Marshall 1960, axis",
        "CG": "9.4"
      }, {
        "name": "Clean and Warm",
        "boost": false,
        "LS1Freq": 720,
        "LS1Gain": -6,
        "LS2Freq": 320,
        "LS2Gain": 1.600000023841858,
        "gain1": 1,
        "distoName1": "asymetric",
        "K1": "7.8",
        "HP1Freq": 6,
        "HP1Q": 0.707099974155426,
        "LS3Freq": 720,
        "LS3Gain": -6,
        "gain2": 1,
        "distoName2": "standard",
        "K2": "0.9",
        "OG": "7.0",
        "BF": "6.7",
        "MF": "7.1",
        "TF": "3.2",
        "PF": "6.9",
        "EQ": [10, 5, -7, -7, 16, 0],
        "MV": "7.2",
        "RN": "Fender Hot Rod",
        "RG": "1.4",
        "CN": "Marshall 1960, axis",
        "CG": "8.8"
      }, {
        "name": "Strong and Warm",
        "boost": false,
        "LS1Freq": 720,
        "LS1Gain": -6,
        "LS2Freq": 320,
        "LS2Gain": -1,
        "gain1": 1.0299999713897705,
        "distoName1": "asymetric",
        "K1": "7.8",
        "HP1Freq": 6,
        "HP1Q": 0.707099974155426,
        "LS3Freq": 720,
        "LS3Gain": -6,
        "gain2": 1,
        "distoName2": "superClean",
        "K2": "7.8",
        "OG": "7.0",
        "BF": "8.2",
        "MF": "6.7",
        "TF": "5.0",
        "PF": "6.9",
        "EQ": [0, 0, 0, -1, 0, 1],
        "MV": "5.9",
        "RN": "Fender Hot Rod",
        "RG": "1.1",
        "CN": "Vox Custom Bright 4x12 M930 Axis 1",
        "CG": "8.0"
      }, {
        "name": "Clean no reverb",
        "boost": false,
        "LS1Freq": 720,
        "LS1Gain": -6,
        "LS2Freq": 320,
        "LS2Gain": -6.300000190734863,
        "gain1": 1,
        "distoName1": "asymetric",
        "K1": "2.1",
        "HP1Freq": 6,
        "HP1Q": 0.707099974155426,
        "LS3Freq": 720,
        "LS3Gain": -6,
        "gain2": 1,
        "distoName2": "crunch",
        "K2": "2.1",
        "OG": "7.0",
        "BF": "6.7",
        "MF": "5.0",
        "TF": "5.0",
        "PF": "8.9",
        "EQ": [4, 13, -8, -8, 15, 12],
        "MV": "3.7",
        "RN": "Fender Hot Rod",
        "RG": "0.0",
        "CN": "Marshall 1960, axis",
        "CG": "4.5"
      }, {
        "name": "Another Clean Sound",
        "boost": false,
        "LS1Freq": 720,
        "LS1Gain": -6,
        "LS2Freq": 320,
        "LS2Gain": -6.300000190734863,
        "gain1": 1,
        "distoName1": "asymetric",
        "K1": "6.4",
        "HP1Freq": 6,
        "HP1Q": 0.707099974155426,
        "LS3Freq": 720,
        "LS3Gain": -6,
        "gain2": 1,
        "distoName2": "crunch",
        "K2": "6.4",
        "OG": "7.0",
        "BF": "6.7",
        "MF": "5.0",
        "TF": "5.0",
        "PF": "8.9",
        "EQ": [4, 13, -8, -8, 15, 12],
        "MV": "3.7",
        "RN": "Fender Hot Rod",
        "RG": "2",
        "CN": "Marshall 1960, axis",
        "CG": "4.5"
      }, {
        "name": "Mostly even harmonics",
        "boost": false,
        "LS1Freq": 720,
        "LS1Gain": -6,
        "LS2Freq": 320,
        "LS2Gain": -7.5,
        "gain1": 1,
        "distoName1": "standard",
        "K1": "6.7",
        "HP1Freq": 6,
        "HP1Q": 0.707099974155426,
        "LS3Freq": 720,
        "LS3Gain": -6,
        "gain2": 1,
        "distoName2": "standard",
        "K2": "6.7",
        "OG": "7.0",
        "BF": "4.3",
        "MF": "2.6",
        "TF": "6.1",
        "PF": "4.2",
        "EQ": [5, 12, -5, -10, 2, 10],
        "MV": "1.7",
        "RN": "Fender Hot Rod",
        "RG": "0.0",
        "CN": "Vintage Marshall 1",
        "CG": "8.4"
      }, {
        "name": "Hard Rock classic 2",
        "boost": false,
        "LS1Freq": 720,
        "LS1Gain": -6,
        "LS2Freq": 320,
        "LS2Gain": -10.199999809265137,
        "gain1": 1,
        "distoName1": "standard",
        "K1": "5.2",
        "HP1Freq": 6,
        "HP1Q": 0.707099974155426,
        "LS3Freq": 720,
        "LS3Gain": -6,
        "gain2": 1,
        "distoName2": "notSoDistorded",
        "K2": "5.1",
        "OG": "7.0",
        "BF": "8.7",
        "MF": "8.0",
        "TF": "3.8",
        "PF": "9.4",
        "EQ": [19, 8, -6, -10, 7, 2],
        "MV": "5.5",
        "RN": "Fender Hot Rod",
        "RG": "0.7",
        "CN": "Marshall 1960, axis",
        "CG": "9.2"
      }, {
        "name": "SuperClean/Jazz",
        "boost": false,
        "LS1Freq": 720,
        "LS1Gain": -6,
        "LS2Freq": 320,
        "LS2Gain": -6.300000190734863,
        "gain1": 1,
        "distoName1": "crunch",
        "K1": "5.4",
        "HP1Freq": 6,
        "HP1Q": 0.707099974155426,
        "LS3Freq": 720,
        "LS3Gain": -6,
        "gain2": 1,
        "distoName2": "crunch",
        "K2": "5.4",
        "OG": "7.0",
        "BF": "7.0",
        "MF": "5.1",
        "TF": "5.2",
        "PF": "3.1",
        "EQ": [10, 7, 0, -10, 5, 12],
        "MV": "3.8",
        "RN": "Fender Hot Rod",
        "RG": "1.5",
        "CN": "Marshall 1960, axis",
        "CG": "4.5"
      }];
      this.reverbImpulses = [{
        name: "Fender Hot Rod",
        url: this.resolveUrl("./src/plugins/amp-sim/src/assets/impulses/reverb/cardiod-rear-levelled.wav")
      }, {
        name: "PCM 90 clean plate",
        url: this.resolveUrl("./src/plugins/amp-sim/src/assets/impulses/reverb/pcm90cleanplate.wav")
      },
      {
        name: "Scala de Milan",
        url: this.resolveUrl("./src/plugins/amp-sim/src/assets/impulses/reverb/ScalaMilanOperaHall.wav")
      }
      ];
      this.cabinetImpulses = [{
        name: "Marshall 1960, axis",
        url: this.resolveUrl("./src/plugins/amp-sim/src/assets/impulses/cabinet/Marshall1960.wav")
      }, {
        name: "Vintage Marshall 1",
        url: this.resolveUrl("./src/plugins/amp-sim/src/assets/impulses/cabinet/Block%20Inside.wav")
      }, {
        name: "Vox Custom Bright 4x12 M930 Axis 1",
        url: this.resolveUrl("./src/plugins/amp-sim/src/assets/impulses/cabinet/voxCustomBrightM930OnAxis1.wav")
      }, {
        name: "Fender Champ, axis",
        url: this.resolveUrl("./src/plugins/amp-sim/src/assets/impulses/cabinet/FenderChampAxisStereo.wav")
      }];

      this.audioContext;
      this.guitarPluggedIn = false;
      this.menuPresets;
      this.menuDisto1;
      this.menuDisto2;
      this.audioPlayer
      this.input;
      this.inputVisualization;
      this.outputVisualization;
      this.analyzerAtInput;
      this.analyzerAtOutput;
      this.guitarInput;
    }
    resolveUrl(_url) {
      return _url;
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
      console.log(`Custom element ${this.is} added to page.`);

      // Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
      const shadowRoot = this.attachShadow({ mode: `open` });
      const template = _currentDoc.querySelector(`template`);
      const instance = template.content.cloneNode(true);
      shadowRoot.appendChild(instance);

      this.runBehaviorMethods();
      // Create an AudioNode from the stream.
      //this.audioPlayer = this.$.player;
      this.audioPlayer = this.pedalboard.soundSample;
      this.audioContext = GlobalContext.context;

      var convolverSlider,
        convolverCabinetSlider,
        inputStream,
        inputStream2;
      //Declared into the constructor
      this.menuPresets = this.shadowRoot.querySelector('#QFPresetMenu2');
      this.menuDisto1 = this.shadowRoot.querySelector('#distorsionMenu1');
      this.menuDisto2 = this.shadowRoot.querySelector('#distorsionMenu2');
      this.currentDistoName = "standard";
      this.currentK = 2; // we have separates ks, but also a "global" one that
      // is the max of the two (the knob value)
      this.distoDrawer1 = new CurveDrawer(this.shadowRoot.querySelector('#distoDrawerCanvas1'));
      this.signalDrawer1 = new CurveDrawer(this.shadowRoot.querySelector('#signalDrawerCanvas1'));
      this.distoDrawer2 = new CurveDrawer(this.shadowRoot.querySelector('#distoDrawerCanvas2'));
      this.signalDrawer2 = new CurveDrawer(this.shadowRoot.querySelector('#signalDrawerCanvas2'));

      this.currentWSCurve = this.wsFactory.distorsionCurves[this.currentDistoName](this.currentK);

      // ------------
      // PREAM STAGE
      // ------------
      // Channel booster
      this.boost = new Boost(this.audioContext);
      // Main input and output and bypass

      // this.input = this.audioContext.createGain();
      this.input = this.soundNodeIn;
      this.output = this.audioContext.createGain();

      this.byPass = this.audioContext.createGain();
      this.byPass.gain.value = 0;
      // ampli input gain towards pream stage
      this.inputGain = this.audioContext.createGain();
      this.inputGain.gain.value = 1;
      // tonestack
      this.bassFilter;
      this.midFilter;
      this.trebleFilter;
      this.presenceFilter;
      // overdrives
      this.k = [2, 2, 2, 2]; // array of k initial values
      this.od = [];
      this.distoTypes = ['asymetric', 'standard'];
      this.gainsOds = [];
      // Tonestack in serie, cf Lepou's mail  
      /*
      for (var i = 0; i < 4; i++) {
          loCutFilters[i] = this.audioContext.createBiquadFilter();
          loCutFilters[i].type = "lowshelf";
          loCutFilters[i].frequency.value = 720;
          loCutFilters[i].gain.value = 3.3;
 
          hiCutFilters[i] = this.audioContext.createBiquadFilter();
          hiCutFilters[i].type = "lowpass";
          hiCutFilters[i].frequency.value = 12000;
          hiCutFilters[i].Q.value = 0.7071;
 
          highShelfBoosts[i] = this.audioContext.createBiquadFilter();
          highShelfBoosts[i].type = "highshelf";
          highShelfBoosts[i].frequency.value = 12000; // Which values ?
          highShelfBoosts[i].Q.value = 0.7071;        // Which values ?
 
          this.od[i] = this.audioContext.createWaveShaper();
          this.od[i].curve = this.makeDistortionCurve(k[i]);
          // Oversampling generates some (small) latency
          //this.od[i].oversample = '4x';
 
          // gains
          this.gainsOds[i] = this.audioContext.createGain();
          this.gainsOds[i].gain.value = 1;
      }
      */
      // JCM 800 preamp schematic...
      // Low shelf cut -6db à 720Hz
      this.lowShelf1 = this.audioContext.createBiquadFilter();
      this.lowShelf1.type = "lowshelf";
      this.lowShelf1.frequency.value = 720;
      this.lowShelf1.gain.value = -6;
      // Low shelf cut variable wired to volume knob
      // if vol = 50%, then filter at -6db, 320Hz
      // shoud go from -4db to -6db for +/- fatness
      this.lowShelf2 = this.audioContext.createBiquadFilter();
      this.lowShelf2.type = "lowshelf";
      this.lowShelf2.frequency.value = 320;
      this.lowShelf2.gain.value = -5;
      // Gain 1
      this.preampStage1Gain = this.audioContext.createGain();
      this.preampStage1Gain.gain.value = 1.0;
      // Distorsion 1, here we should use an asymetric function in order to 
      // generate odd harmonics
      this.od[0] = this.audioContext.createWaveShaper();
      this.od[0].curve = this.wsFactory.distorsionCurves[this.distoTypes[0]](0);
      this.menuDisto1.value = this.distoTypes[0];
      // HighPass at 7-8 Hz, rectify the signal that got a DC value due
      // to the possible asymetric transfer function
      this.highPass1 = this.audioContext.createBiquadFilter();
      this.highPass1.type = "highpass";
      this.highPass1.frequency.value = 6;
      this.highPass1.Q.value = 0.7071;
      // lowshelf cut -6db 720Hz
      this.lowShelf3 = this.audioContext.createBiquadFilter();
      this.lowShelf3.type = "lowshelf";
      this.lowShelf3.frequency.value = 720;
      this.lowShelf3.gain.value = -6;
      // Gain 2
      this.preampStage2Gain = this.audioContext.createGain();
      this.preampStage2Gain.gain.value = 1;
      // Distorsion 2, symetric function to generate even harmonics
      this.od[1] = this.audioContext.createWaveShaper();
      this.od[1].curve = this.wsFactory.distorsionCurves[this.distoTypes[1]](0);
      this.menuDisto2.value = this.distoTypes[1];
      this.changeDistorsionValues(4, 0);
      this.changeDistorsionValues(4, 1);
      // output gain after preamp stage
      this.outputGain = this.audioContext.createGain();
      this.changeOutputGainValue(7);
      // ------------------------------
      // TONESTACK STAGES
      // ------------------------------
      // Useless ?
      this.bassFilter = this.audioContext.createBiquadFilter();
      this.bassFilter.frequency.value = 100;
      this.bassFilter.type = "lowshelf";
      this.bassFilter.Q.value = 0.7071; // To check with Lepou

      this.midFilter = this.audioContext.createBiquadFilter();
      this.midFilter.frequency.value = 1700;
      this.midFilter.type = "peaking";
      this.midFilter.Q.value = 0.7071; // To check with Lepou

      this.trebleFilter = this.audioContext.createBiquadFilter();
      this.trebleFilter.frequency.value = 6500;
      this.trebleFilter.type = "highshelf";
      this.trebleFilter.Q.value = 0.7071; // To check with Lepou

      this.presenceFilter = this.audioContext.createBiquadFilter();
      this.presenceFilter.frequency.value = 3900;
      this.presenceFilter.type = "peaking";
      this.presenceFilter.Q.value = 0.7071; // To check with Lepou
      // -----------------------------------
      // POST PROCESSING STAGE (EQ, reverb)
      // -----------------------------------
      //  before EQ, filter highs and lows (Fred Miniere advise)
      this.eqhicut = this.audioContext.createBiquadFilter();
      this.eqhicut.frequency.value = 10000;
      this.eqhicut.type = "peaking";
      this.eqhicut.gain.value = -25;

      this.eqlocut = this.audioContext.createBiquadFilter();
      this.eqlocut.frequency.value = 60;
      this.eqlocut.type = "peaking";
      this.eqlocut.gain.value = -19;

      this.eq = new Equalizer(this.audioContext, this.shadowRoot);
      this.changeEQValues([0, 0, 0, 0, 0, 0]);
      this.bypassEQg = this.audioContext.createGain();
      this.bypassEQg.gain.value = 0; // by defaut EQ is in
      this.inputEQ = this.audioContext.createGain();
      // Master volume
      this.masterVolume = this.audioContext.createGain();
      this.changeMasterVolume(2);
      /*
          reverb = new Reverb(this.audioContext, function () {
              console.log("reverb created");
              cabinetSim = new CabinetSimulator(this.audioContext, function () {
                  console.log("cabinet sim created");
                  doAllConnections();
              });
          });
      */
      this.reverb = new Convolver(this.audioContext, this.reverbImpulses, this.shadowRoot.querySelector('#reverbImpulses'));
      this.cabinetSim = new Convolver(this.audioContext, this.cabinetImpulses, this.shadowRoot.querySelector('#cabinetImpulses'));
      this.doAllConnections();
      try {
        // if ShadowDOMPolyfill is defined, then we are using the Polymer
        // WebComponent polyfill that wraps the HTML audio
        // element into something that cannot be used with
        // createMediaElementSource. We use ShadowDOMPolyfill.unwrap(...)
        // to get the "real" HTML audio element
        this.audioPlayer = ShadowDOMPolyfill.unwrap(this.audioPlayer);
      } catch (e) {
        console.log(
          "ShadowDOMPolyfill undefined, running native Web Component code"
        );
      }
      console.log(this.pedalboard.sound.mediaSource);
      if (inputStream2 === undefined) inputStream2 = this.pedalboard.sound.mediaSource;
      //if (inputStream2 === undefined) inputStream2 = this.audioContext.createMediaElementSource(this.audioPlayer);
      var constraints = {
        audio: {
          echoCancellation: false,
          mozNoiseSuppression: false,
          mozAutoGainControl: false
        }
      };
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        window.stream = stream; // make stream available to console
        // Refresh button list in case labels have become available
        inputStream = this.audioContext.createMediaStreamSource(window.stream);
        this.guitarInput = this.convertToMono(inputStream);
        // create quadrafuzz
        this.analyzerAtInput = this.audioContext.createAnalyser();
        this.input.connect(this.analyzerAtInput);
        // build graph
        if (this.guitarPluggedIn) {
          this.guitarInput.connect(this.input);
        }
        // connect audio player to ampli for previewing presets
        inputStream2.connect(this.input);
        // output, add an analyser at the end
        this.analyzerAtOutput = this.audioContext.createAnalyser();
        this.output.connect(this.analyzerAtOutput);
        //this.analyzerAtOutput.connect(this.output);
        this.analyzerAtOutput.connect(this.soundNodeOut);

        convolverSlider = this.shadowRoot.querySelector('#convolverSlider');
        convolverCabinetSlider = this.shadowRoot.querySelector('#convolverCabinetSlider');
        this.initVisualizations();
        // Binding avec le vrai ampli
        // Volume
        this.shadowRoot.querySelector('#Knob1').addEventListener("change", (evt) => this.changeOutputGain(evt.target.value));
        // Master Volume
        this.shadowRoot.querySelector('#Knob2').addEventListener("change", (evt) => this.changeMasterVolume(evt.target.value));
        // Drive
        this.shadowRoot.querySelector('#Knob3').addEventListener("change", (evt) => this.changeDrive(evt.target.value));
        // Bass
        this.shadowRoot.querySelector('#Knob4').addEventListener("change", (evt) => this.changeBassFilterValue(evt.target.value));
        // Middle
        this.shadowRoot.querySelector('#Knob5').addEventListener("change", (evt) => this.changeMidFilterValue(evt.target.value));
        // Treble
        this.shadowRoot.querySelector('#Knob6').addEventListener("change", (evt) => this.changeTrebleFilterValue(evt.target.value));
        // Reverb
        this.shadowRoot.querySelector('#Knob7').addEventListener("change", (evt) => this.changeReverbGain(evt.target.value));
        // Presence 
        this.shadowRoot.querySelector('#Knob8').addEventListener("change", (evt) => this.changePresenceFilterValue(evt.target.value));
        // input gain
        this.shadowRoot.querySelector('#Knob9').addEventListener("change", (evt) => this.changeInputGainValue(evt.target.value));
        // output gain
        this.shadowRoot.querySelector('#Knob10').addEventListener("change", (evt) => this.changeOutputGainValue(evt.target.value));
        this.menuPresets.addEventListener("change", () => this.changePreset());
        this.menuDisto1.addEventListener("change", () => this.changeDistoType1());
        this.menuDisto2.addEventListener("change", () => this.changeDistoType2());
        // Equalizer
        for (var i = 1; i < 7; i++) {
          ((i) => {
            this.shadowRoot.querySelector("#slider" + i).addEventListener("change", (evt) => this.eq.changeGain(evt.target.value, i - 1));
          })(i)
        }
        // On / Off switch
        this.shadowRoot.querySelector('#switch1').addEventListener("change", (evt) => {
          var state = {};
          evt.target.value == 1 ? state.checked = false : state.checked = true;
          this.bypass(state);
        });
        // EQ on/off switch
        this.shadowRoot.querySelector('#switch2').addEventListener("change", (evt) => {
          var state = {};
          evt.target.value == 1 ? state.checked = false : state.checked = true;
          this.bypassEQ(state);
        });
        // Boost on/off
        this.shadowRoot.querySelector('#toggleBoost').addEventListener("change", (evt) => {
          var state = {};
          evt.target.value == 1 ? state.checked = false : state.checked = true;
          this.boostOnOff(state);
        });
      })

      Object.keys(this.presets).map(
        (el,index)=>{
          this.shadowRoot.querySelector('#QFPresetMenu2').insertAdjacentHTML('beforeEnd',`<option value="${index}">${this.presets[el].name}</option>`);
        }
      )

      this.listeners();
    }


    listeners() {
      this.shadowRoot.querySelector('#lowShelf1FreqSlider').addEventListener("input", (evt) => this._changeLowShelf1FrequencyValue(evt));
      this.shadowRoot.querySelector('#lowShelf1GainSlider').addEventListener("input", (evt) => this._changeLowShelf1GainValue(evt));


      this.shadowRoot.querySelector('#lowShelf2FreqSlider').addEventListener("input", (evt) => this._changeLowShelf2FrequencyValue(evt));
      this.shadowRoot.querySelector('#lowShelf2GainSlider').addEventListener("input", (evt) => this._changeLowShelf2GainValue(evt));

      this.shadowRoot.querySelector('#preampStage1GainSlider').addEventListener("input", (evt) => this._changePreampStage1GainValue(evt));
      this.shadowRoot.querySelector('#highPass1FreqSlider').addEventListener("input", (evt) => this._changeHighPass1FrequencyValue(evt));
      this.shadowRoot.querySelector('#highPass1QSlider').addEventListener("input", (evt) => this._changeHighPass1QValue(evt));
      this.shadowRoot.querySelector('#lowShelf3FreqSlider').addEventListener("input", (evt) => this._changeLowShelf3FrequencyValue(evt));
      this.shadowRoot.querySelector('#lowShelf3GainSlider').addEventListener("input", (evt) => this._changeLowShelf3GainValue(evt));

      this.shadowRoot.querySelector('#preampStage2GainSlider').addEventListener("input", (evt) => this._changePreampStage2GainValue(evt));
      this.shadowRoot.querySelector('#K1slider').addEventListener("input", (evt) => this._changeDistorsionValues(evt));
      this.shadowRoot.querySelector('#K2slider').addEventListener("input", (evt) => this._changeDistorsionValues(evt));

      this.shadowRoot.querySelector('#myonoffswitch').addEventListener("click", (evt) => this._changeOversampling(evt));
      this.shadowRoot.querySelector('#convolverCabinetSlider').addEventListener("input", (evt) => this._changeRoom(evt));
      this.shadowRoot.querySelector('#toggleGuitarIn').addEventListener("click", (evt) => this.toggleGuitarInput(evt));
    }

    changeDemoSample(event) {
      this.audioPlayer.src = this.demoSampleURLs[event.target.value];
      this.audioPlayer.play();
    }

    toggleGuitarInput(event) {
      var button = this.shadowRoot.querySelector('#toggleGuitarIn');
      if (!this.guitarPluggedIn) {
        this.guitarInput.connect(this.input);
        button.innerHTML = "Guitar input: <span style='color:green;'>ACTIVATED</span>, click to toggle on/off!";
        button.classList.remove("pulse");
      } else {
        this.guitarInput.disconnect();
        button.innerHTML = "Guitar input: <span style='color:red;'>NOT ACTIVATED</span>, click to toggle on/off!";
        button.classList.add("pulse");
      }
      this.guitarPluggedIn = !this.guitarPluggedIn;
    }

    initVisualizations() {
      this.inputVisualization = new Visualization();
      this.inputVisualization.configure(this.shadowRoot.querySelector('#inputSignalCanvas'), this.analyzerAtInput);
      this.outputVisualization = new Visualization();
      this.outputVisualization.configure(this.shadowRoot.querySelector('#outputSignalCanvas'), this.analyzerAtOutput);
      // start updating the visualizations

      requestAnimationFrame(() => {
        this.visualize()
      })
    }

    visualize() {
      this.inputVisualization.update();
      this.outputVisualization.update();
      requestAnimationFrame(() => {
        this.visualize()
      })
    }

    // END OF AMP STAGES
    // -------------------
    convertToMono(input) {
      var splitter = this.audioContext.createChannelSplitter(2);
      var merger = this.audioContext.createChannelMerger(2);
      input.connect(splitter);
      splitter.connect(merger, 0, 0);
      splitter.connect(merger, 0, 1);
      return merger;
    }

    doAllConnections() {
      // called only after reverb and cabinet sim could load and
      // decode impulses
      // Build web audio graph, set default preset
      this.buildGraph();
      this.changeRoom(7.5); // TO REMOVE ONCE PRESETS MANAGER WORKS
      this.setDefaultPreset();
      console.log("running");
    }

    buildGraph() {
      this.input.connect(this.inputGain);
      this.input.connect(this.byPass);
      // boost is not activated, it's just a sort of disto at 
      // the very beginning of the ampli route
      this.inputGain.connect(this.boost.input);
      // JCM 800 like...
      this.boost.output.connect(this.lowShelf1);
      this.lowShelf1.connect(this.lowShelf2);
      this.lowShelf2.connect(this.preampStage1Gain);
      this.preampStage1Gain.connect(this.od[0]);
      this.od[0].connect(this.highPass1);
      this.highPass1.connect(this.lowShelf3);
      this.lowShelf3.connect(this.preampStage2Gain);
      this.preampStage2Gain.connect(this.od[1])
      // end of preamp
      this.od[1].connect(this.outputGain);
      // tonestack
      this.outputGain.connect(this.trebleFilter);
      this.trebleFilter.connect(this.bassFilter);
      this.bassFilter.connect(this.midFilter);
      this.midFilter.connect(this.presenceFilter);
      // lo and hicuts
      this.presenceFilter.connect(this.eqlocut);
      this.eqlocut.connect(this.eqhicut);
      // post process
      this.eqhicut.connect(this.inputEQ);
      // bypass eq route
      this.eqhicut.connect(this.bypassEQg);
      this.bypassEQg.connect(this.masterVolume);
      // normal route
      this.inputEQ.connect(this.eq.input);
      this.eq.output.connect(this.masterVolume);
      this.masterVolume.connect(this.reverb.input);
      this.reverb.output.connect(this.cabinetSim.input);
      this.cabinetSim.output.connect(this.output);
      //this.eq.output.connect(output);
      //reverb.output.connect(output);
      // byPass route
      this.byPass.connect(this.output);
    }

    boostOnOff(cb) {
      // called when we click the switch on the GUI      
      this.boost.toggle();
      this.adjustOutputGainIfBoostActivated();
      this.updateBoostLedButtonState(this.boost.isActivated());
    }

    changeBoost(state) {
      console.log("changeBoost, boost before: " + this.boost.isActivated() + " output gain=" + this.output.gain.value);
      if (this.boost.isActivated() !== state) {
        // we need to adjust the output gain
        console.log("changeBoost: we change boost state");
        this.boost.onOff(state);
        this.adjustOutputGainIfBoostActivated();
        this.updateBoostLedButtonState(this.boost.isActivated());
      } else {
        console.log("changeBoost: we do not change boost state");
      }
      console.log("changeBoost, boost after: " + this.boost.isActivated());
    }

    // first parameter = curveDrawer to use, second = curve to draw 
    drawCurve(cd, c) {
      cd.setCurve(c);
      cd.drawAxis();
      cd.drawCurve('lightGreen', 2);
    }

    adjustOutputGainIfBoostActivated() {
      console.log("adjustOutputGainIfBoostActivated: output gain value before = " + this.output.gain.value)
      if (this.boost.isActivated()) {
        this.output.gain.value /= 2;
      } else {
        this.output.gain.value *= 2;
      }
      console.log("adjustOutputGainIfBoostActivated: output gain value after = " + this.output.gain.value)
    }

    updateBoostLedButtonState(activated) {
      // update buttons states
      if (this.boost.isActivated()) {
        this.shadowRoot.querySelector('#toggleBoost').setValue(1, false);
      } else {
        this.shadowRoot.querySelector('#toggleBoost').setValue(0, false);
      }
    }


    changeInputGainValue(sliderVal) {
      this.input.gain.value = parseFloat(sliderVal);
      console.log("changeInputGainValue value = " + this.input.gain.value);
    }

    changeOutputGainValue(sliderVal) {
      this.output.gain.value = parseFloat(sliderVal) / 10;
      console.log("changeOutputGainValue value = " + this.output.gain.value);
    }

    // PREAMP
    _changeLowShelf1FrequencyValue(evt) {
      this.changeLowShelf1FrequencyValue(evt.target.value)
    }

    changeLowShelf1FrequencyValue(sliderVal) {
      var value = parseFloat(sliderVal);
      this.lowShelf1.frequency.value = value;
      // update output labels
      this.shadowRoot.querySelector('#lowShelf1Freq').value = value.toFixed(1) + " Hz";
      // refresh slider state
      this.shadowRoot.querySelector('#lowShelf1FreqSlider').value = value.toFixed(1);
    }

    _changeLowShelf1GainValue(evt) {
      this.changeLowShelf1GainValue(evt.target.value)
    }

    changeLowShelf1GainValue(sliderVal) {
      var value = parseFloat(sliderVal);
      this.lowShelf1.gain.value = value;
      // update output labels
      this.shadowRoot.querySelector('#lowShelf1Gain').value = value.toFixed(1) + " dB";
      // refresh slider state
      this.shadowRoot.querySelector('#lowShelf1GainSlider').value = value.toFixed(1);
    }

    _changeLowShelf2FrequencyValue(evt) {
      this.changeLowShelf2FrequencyValue(evt.target.value)
    }

    changeLowShelf2FrequencyValue(sliderVal) {
      var value = parseFloat(sliderVal);
      this.lowShelf2.frequency.value = value;
      // update output labels
      this.shadowRoot.querySelector('#lowShelf2Freq').value = value.toFixed(1) + " Hz";
      // refresh slider state
      this.shadowRoot.querySelector('#lowShelf2FreqSlider').value = value.toFixed(1);
    }

    _changeLowShelf2GainValue(evt) {
      this.changeLowShelf2GainValue(evt.target.value)
    }

    changeLowShelf2GainValue(sliderVal) {
      var value = parseFloat(sliderVal);
      this.lowShelf2.gain.value = value;
      console.log("lowshelf 2 gain = " + value);
      // update output labels
      this.shadowRoot.querySelector('#lowShelf2Gain').value = value.toFixed(1) + " dB";
      // refresh slider state
      this.shadowRoot.querySelector('#lowShelf2GainSlider').value = value.toFixed(1);
    }

    _changePreampStage1GainValue(evt) {
      this.changePreampStage1GainValue(evt.target.value)
    }

    changePreampStage1GainValue(sliderVal) {
      var value = parseFloat(sliderVal);
      this.preampStage1Gain.gain.value = value;
      // update output labels
      this.shadowRoot.querySelector('#preampStage1Gain').value = value.toFixed(2);
      // refresh slider state
      this.shadowRoot.querySelector('#preampStage1GainSlider').value = value.toFixed(2);
    }
    _changeHighPass1FrequencyValue(evt) {
      this.changeHighPass1FrequencyValue(evt.target.value)
    }
    changeHighPass1FrequencyValue(sliderVal) {
      var value = parseFloat(sliderVal);
      this.highPass1.frequency.value = value;
      // update output labels
      this.shadowRoot.querySelector('#highPass1Freq').value = value.toFixed(1) + " Hz";
      // refresh slider state
      this.shadowRoot.querySelector('#highPass1FreqSlider').value = value.toFixed(1);
    }
    _changeHighPass1QValue(evt) {
      this.changeHighPass1QValue(evt.target.value)
    }
    changeHighPass1QValue
      (sliderVal) {
      var value = parseFloat(sliderVal);
      this.highPass1.Q.value = value;
      // update output labels
      this.shadowRoot.querySelector('#highPass1Q').value = value.toFixed(4);
      // refresh slider state
      this.shadowRoot.querySelector('#highPass1QSlider').value = value.toFixed(4);
    }
    _changeLowShelf3FrequencyValue(evt) {
      this.changeLowShelf3FrequencyValue(evt.target.value)
    }
    changeLowShelf3FrequencyValue(sliderVal) {
      var value = parseFloat(sliderVal);
      this.lowShelf3.frequency.value = value;
      // update output labels
      this.shadowRoot.querySelector('#lowShelf3Freq').value = value.toFixed(1) + " Hz";
      // refresh slider state
      this.shadowRoot.querySelector('#lowShelf3FreqSlider').value = value.toFixed(1);
    }

    _changeLowShelf3GainValue(evt) {
      this.changeLowShelf3GainValue(evt.target.value)
    }

    changeLowShelf3GainValue(sliderVal) {
      var value = parseFloat(sliderVal);
      this.lowShelf3.gain.value = value;
      // update output labels
      this.shadowRoot.querySelector('#lowShelf3Gain').value = value.toFixed(1) + " dB";
      // refresh slider state
      this.shadowRoot.querySelector('#lowShelf3GainSlider').value = value.toFixed(1);
    }

    _changePreampStage2GainValue(evt) {
      this.changePreampStage2GainValue(evt.target.value)
    }

    changePreampStage2GainValue(sliderVal) {
      var value = parseFloat(sliderVal);
      this.preampStage2Gain.gain.value = value;
      // update output labels
      this.shadowRoot.querySelector('#preampStage2Gain').value = value.toFixed(2);
      // refresh slider state
      this.shadowRoot.querySelector('#preampStage2GainSlider').value = value.toFixed(2);
    }

    //-------------------------------------------------END OF PREAMP-------------------------------------------------
    //fabrice : never used
    // changeHicutFreqValue(sliderVal) {
    //     var value = parseFloat(sliderVal);
    //     for (var i = 0; i < 4; i++) {
    //         hiCutFilters[i].frequency.value = value;
    //     }
    //     // update output labels
    //     var output = this.$.hiCutFreq;
    //     output.value = parseFloat(sliderVal).toFixed(1) + " Hz";
    //     // refresh slider state
    //     var slider = this.$.hiCutFreqSlider;
    //     slider.value = parseFloat(sliderVal).toFixed(1);
    // }

    changeBassFilterValue(sliderVal) {
      // sliderVal is in [0, 10]
      this.bassFilter.gain.value = (parseFloat(sliderVal) - 10) * 7;
      console.log("bass gain set to " + this.bassFilter.gain.value);
      // update output labels
      //var output = this.$.bassFreq;
      //output.value = parseFloat(sliderVal).toFixed(1);
      // refresh slider state
      //var slider = this.$.bassFreqSlider;
      //slider.value = parseFloat(sliderVal).toFixed(1);
      // refresh knob state
      //sliderVal = value / 7 + 10;
      this.shadowRoot.querySelector('#Knob4').setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changeMidFilterValue(sliderVal) {
      // sliderVal is in [0, 10]
      this.midFilter.gain.value = (parseFloat(sliderVal) - 5) * 4;
      // update output labels
      //var output = this.$.midFreq;
      //output.value = parseFloat(sliderVal).toFixed(1);
      // refresh slider state
      //var slider = this.$.midFreqSlider;
      //slider.value = parseFloat(sliderVal).toFixed(1);
      // refresh knob state
      //sliderVal = value /4 + 5;
      this.shadowRoot.querySelector('#Knob5').setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changeTrebleFilterValue(sliderVal) {
      // sliderVal is in [0, 10]
      this.trebleFilter.gain.value = (parseFloat(sliderVal) - 10) * 10;
      // update output labels
      //var output = this.$.trebleFreq;
      //output.value = parseFloat(sliderVal).toFixed(1);
      // refresh slider state
      //var slider = this.$.trebleFreqSlider;
      //slider.value = parseFloat(sliderVal).toFixed(1);
      // refresh knob state
      //sliderVal = value /10 + 10;
      this.shadowRoot.querySelector('#Knob6').setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changePresenceFilterValue(sliderVal) {
      // sliderVal is in [0, 10]
      this.presenceFilter.gain.value = (parseFloat(sliderVal) - 5) * 2;
      //console.log("set presence freq to " + this.presenceFilter.frequency.value)
      // update output labels
      //var output = this.$.presenceFreq;
      //output.value = parseFloat(sliderVal).toFixed(1);
      // refresh slider state
      //var slider = this.$.presenceFreqSlider;
      //slider.value = parseFloat(sliderVal).toFixed(1);
      // refresh knob state
      this.shadowRoot.querySelector('#Knob8').setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changeDistoType1() {
      console.log("Changing disto1 to : " + this.menuDisto1.value);
      this.currentDistoName = this.menuDisto1.value;
      this.distoTypes[0] = this.currentDistoName;
      this.changeDrive(this.currentK);
    }

    changeDistoType2() {
      console.log("Changing disto2 to : " + this.menuDisto2.value);
      this.currentDistoName = this.menuDisto2.value;
      this.distoTypes[1] = this.currentDistoName;
      this.changeDrive(this.currentK);
    }

    changeDisto1TypeFromPreset(name) {
      this.currentDistoName = name;
      this.menuDisto1.value = name;
      this.distoTypes[0] = this.currentDistoName;
      //this.changeDrive(this.currentK);
    }

    changeDisto2TypeFromPreset(name) {
      this.currentDistoName = name;
      this.menuDisto2.value = name;
      this.distoTypes[1] = this.currentDistoName;
      //this.changeDrive(this.currentK);
    }

    changeDrive(sliderValue) {
      // sliderValue in [0,10]
      // We can imagine having some "profiles here" -> generate
      // different K values from one single sliderValue for the
      // drive.
      // other values i.e [0.5, 0.5, 0.8, 1] -> less distorsion
      // on bass frequencies and top high frequency
      for (var i = 0; i < 2; i++) {
        this.changeDistorsionValues(sliderValue, i);
      }
    }

    _changeDistorsionValues(evt) {
      this.changeDistorsionValues(evt.target.value, evt.target.dataset.disto);
    }

    changeDistorsionValues(sliderValue, numDisto) {
      // sliderValue is in [0, 10] range, adjust to [0, 1500] range  
      var value = 150 * parseFloat(sliderValue);
      var numDisto = Number(numDisto);
      var minp = 0;
      var maxp = 1500;
      // The result should be between 10 an 1500
      var minv = Math.log(10);
      var maxv = Math.log(1500);
      // calculate adjustment factor
      var scale = (maxv - minv) / (maxp - minp);
      value = Math.exp(minv + scale * (value - minp));
      // end of logarithmic adjustment
      this.k[numDisto] = value;
      //console.log("this.k = " + value + " pos = " + this.logToPos(value));
      //console.log("distoTypes = " + this.distoTypes[numDisto]);
      this.od[numDisto].curve = this.wsFactory.distorsionCurves[this.distoTypes[numDisto]](this.k[numDisto]); //makeDistortionCurve(k[numDisto]);
      this.currentWSCurve = this.od[numDisto].curve;
      //this.od[numDisto].curve = this.makeDistortionCurve(sliderValue);
      //this.makeDistortionCurve(this.k[numDisto]);
      //this.od[numDisto].curve = this.makeDistortionCurve(sliderValue);
      // update output labels
      var output = this.shadowRoot.querySelector("#k" + numDisto);
      output.value = parseFloat(sliderValue).toFixed(1);
      // update sliders
      var numSlider = numDisto + 1;
      this.shadowRoot.querySelector("#K" + numSlider + "slider").value = parseFloat(sliderValue).toFixed(1);
      // refresh knob state
      var maxPosVal1 = Math.max(this.logToPos(this.k[2]), this.logToPos(this.k[3]));
      var maxPosVal2 = Math.max(this.logToPos(this.k[0]), this.logToPos(this.k[1]));
      var maxPosVal = Math.max(maxPosVal1, maxPosVal2);
      //var maxPosVal = Math.max(this.logToPos(this.k[2]), this.logToPos(this.k[3]));
      var linearValue = parseFloat(maxPosVal).toFixed(1);
      this.shadowRoot.querySelector('#Knob3').setValue(linearValue, false);
      // in [0, 10]
      this.currentK = linearValue;
      // redraw curves
      this.drawCurrentDistos();
    }

    logToPos(logValue) {
      var minp = 0;
      var maxp = 1500;
      // The result should be between 10 an 1500
      var minv = Math.log(10);
      var maxv = Math.log(1500);
      // calculate adjustment factor
      var scale = (maxv - minv) / (maxp - minp);
      return (minp + (Math.log(logValue) - minv) / scale) / 150;
    }

    _changeOversampling(evt) {
      for (var i = 0; i < 2; i++) {
        if (evt.target.checked) {
          // Oversampling generates some (small) latency
          this.od[i].oversample = '4x';
          this.boost.setOversampling('4x');
          console.log("set oversampling to 4x");
        } else {
          this.od[i].oversample = 'none';
          this.boost.setOversampling('none');
          console.log("set oversampling to none");
        }
      }
      // Not sure if this is necessary... My ears can't hear the difference
      // between oversampling=node and 4x ? Maybe we should re-init the
      // waveshaper curves ?
      //changeDistoType1();
      //changeDistoType2();
    }

    // Returns an array of distorsions values in [0, 10] range
    getDistorsionValue(numChannel) {
      var pos = this.logToPos(this.k[numChannel]);
      return parseFloat(pos).toFixed(1);
    }

    drawCurrentDistos() {
      // draws both the transfer function and a sinusoidal
      // signal transformed, for each distorsion stage
      this.drawDistoCurves(this.distoDrawer1, this.signalDrawer1, this.od[0].curve);
      this.drawDistoCurves(this.distoDrawer2, this.signalDrawer2, this.od[1].curve);
    }

    drawDistoCurves(distoDrawer, signalDrawer, curve) {
      var c = curve;
      distoDrawer.clear();
      this.drawCurve(distoDrawer, c);
      // draw signal
      signalDrawer.clear();
      signalDrawer.drawAxis();
      signalDrawer.makeCurve(Math.sin, 0, Math.PI * 2);
      signalDrawer.drawCurve('red', 2);
      //signalDrawer.makeCurve(distord, 0, Math.PI*2);
      var cTransformed = this.distord(c);
      this.drawCurve(signalDrawer, cTransformed);
    }

    distord(c) {
      // return the curve of sin(x) transformed by the current wave shaper
      // function
      // x is in [0, 2*Math.PI]
      // sin(x) in [-1, 1]
      // current distorsion curve
      var curveLength = c.length;
      var c2 = new Float32Array(this.DRAWER_CANVAS_SIZE);
      // sin(x) -> ?
      // [-1, 1] -> [0, length -1]
      // 100 is the canvas size.
      var incX = 2 * Math.PI / this.DRAWER_CANVAS_SIZE;
      var x = 0;
      for (var i = 0; i < this.DRAWER_CANVAS_SIZE; i++) {
        var index = Utils.map(Math.sin(x), -1, 1, 0, curveLength - 1);
        c2[i] = c[Math.round(index)];
        x += incX;
      }
      return c2;
    }

    //fabrice: Never used
    changeQValues(sliderVal, numQ) {
      var value = parseFloat(sliderVal);
      this.eq.filters[numQ].Q.value = value;
      // update output labels
      var output = this.shadowRoot.querySelector("#q" + numQ);
      output.value = value.toFixed(1);
      // update sliders
      var numSlider = numQ + 1;
      var slider = this.shadowRoot.querySelector("#Q" + numSlider + "slider");
      slider.value = value;
    }

    //fabrice: Never used
    changeFreqValues(sliderVal, numF) {
      var value = parseFloat(sliderVal);
      this.eq.filters[numF].frequency.value = value;
      // update output labels
      var output = this.shadowRoot.querySelector("#freq" + numF);
      output.value = value + " Hz";
      // refresh slider state
      var numSlider = numF + 1;
      var slider = this.shadowRoot.querySelector("#F" + numSlider + "slider");
      slider.value = value;
    }

    // volume aka preamp output volume
    changeOutputGain(sliderVal) {
      // sliderVal is in [0, 10]
      // Adjust to [0, 1]
      this.outputGain.gain.value = parseFloat(sliderVal / 10);
      // update output labels
      //var output = this.$.outputGain;
      //output.value = parseFloat(sliderVal).toFixed(1);
      // refresh slider state
      //var slider = this.$.OGslider;
      //slider.value = parseFloat(sliderVal).toFixed(1);
      // refresh knob state
      this.shadowRoot.querySelector('#Knob1').setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    //fabrice: Never used
    // volume aka preamp output volume
    changeInputGain(sliderVal) {
      // sliderVal is in [0, 10]
      // Adjust to [0, 1]
      this.inputGain.gain.value = parseFloat(sliderVal / 10);
      // update output labels
      //var output = this.$.outputGain;
      //output.value = parseFloat(sliderVal).toFixed(1);
      // refresh slider state
      //var slider = this.$.OGslider;
      //slider.value = parseFloat(sliderVal).toFixed(1);
      // refresh knob state
      this.shadowRoot.querySelector('#Knob1').setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changeMasterVolume(sliderVal) {
      // sliderVal is in [0, 10]
      this.masterVolume.gain.value = parseFloat(sliderVal);;
      // update output labels
      //var output = this.$.MVOutputGain;
      //output.value = parseFloat(sliderVal).toFixed(1);
      // refresh slider state
      //var slider = this.$.MVslider;
      //slider.value = parseFloat(sliderVal).toFixed(1);
      // refresh knob state
      this.shadowRoot.querySelector('#Knob2').setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changeReverbGain(sliderVal) {
      // slider val in [0, 10] range
      // adjust to [0, 1]
      this.reverb.setGain(parseFloat(sliderVal) / 10);
      // update output labels
      //var output = this.$.reverbGainOutput;
      //output.value = parseFloat(sliderVal).toFixed(1);
      // refresh slider state
      //var slider = this.$.convolverSlider;
      //slider.value = parseFloat(sliderVal).toFixed(1);
      // refresh knob state
      this.shadowRoot.querySelector('#Knob7').setValue(parseFloat(sliderVal).toFixed(1), false);
    }

    changeReverbImpulse(name) {
      this.reverb.loadImpulseByName(name);
    }

    _changeRoom(evt) {
      this.changeRoom(evt.target.value);
    }

    changeRoom(sliderVal) {
      // slider val in [0, 10] range
      // adjust to [0, 1]
      console.log('change room');
      var value = parseFloat(sliderVal) / 10;
      this.cabinetSim.setGain(value);
      // update output labels
      var output = this.shadowRoot.querySelector('#cabinetGainOutput');
      output.value = parseFloat(sliderVal).toFixed(1);
      // refresh slider state
      var slider = this.shadowRoot.querySelector('#convolverCabinetSlider');
      slider.value = parseFloat(sliderVal).toFixed(1);
    }

    changeCabinetSimImpulse(name) {
      this.cabinetSim.loadImpulseByName(name);
    }

    changeEQValues(eqValues) {
      this.eq.setValues(eqValues);
    }

    makeDistortionCurve(k) {
      // compute a new ws curve for current disto name and current k
      this.currentWSCurve = this.wsFactory.distorsionCurves[this.currentDistoName](this.k);
      return this.currentWSCurve;
    }

    changePreset() {
      this.setPreset(this.presets[this.menuPresets.value]);
    }

    setPreset(p) {
      if (p.distoName1 === undefined) p.distoName1 = "standard";
      if (p.distoName2 === undefined) p.distoName2 = "standard";
      if (p.boost === undefined) p.boost = false;
      this.changeBoost(p.boost);
      // stage 1
      this.changeLowShelf1FrequencyValue(p.LS1Freq);
      this.changeLowShelf1GainValue(p.LS1Gain);
      this.changeLowShelf2FrequencyValue(p.LS2Freq);
      this.changeLowShelf2GainValue(p.LS2Gain);
      this.changePreampStage1GainValue(p.gain1);
      this.changeDisto1TypeFromPreset(p.distoName1);
      this.changeDistorsionValues(p.K1, 0);
      // stage 2
      this.changeLowShelf3FrequencyValue(p.LS3Freq);
      this.changeLowShelf3GainValue(p.LS3Gain);
      this.changePreampStage2GainValue(p.gain2);
      this.changeDisto2TypeFromPreset(p.distoName2);
      this.changeDistorsionValues(p.K2, 1);
      this.changeOutputGain(p.OG);
      this.changeBassFilterValue(p.BF);
      this.changeMidFilterValue(p.MF);
      this.changeTrebleFilterValue(p.TF);
      this.changePresenceFilterValue(p.PF);
      this.changeMasterVolume(p.MV);
      this.changeReverbGain(p.RG);
      this.changeReverbImpulse(p.RN);
      this.changeRoom(p.CG);
      this.changeCabinetSimImpulse(p.CN);
      this.changeEQValues(p.EQ);
    }

    getPresets() {
      return this.presets;
    }

    setDefaultPreset() {
      this.setPreset(this.presets[0]);
    }

    printCurrentAmpValues() {
      var currentPresetValue = {
        name: 'current',
        boost: this.boost.isActivated(),
        LS1Freq: this.lowShelf1.frequency.value,
        LS1Gain: this.lowShelf1.gain.value,
        LS2Freq: this.lowShelf2.frequency.value,
        LS2Gain: this.lowShelf2.gain.value,
        gain1: this.preampStage1Gain.gain.value,
        distoName1: this.menuDisto1.value,
        K1: this.getDistorsionValue(0),
        HP1Freq: this.highPass1.frequency.value,
        HP1Q: this.highPass1.Q.value,
        LS3Freq: this.lowShelf3.frequency.value,
        LS3Gain: this.lowShelf3.gain.value,
        gain2: this.preampStage2Gain.gain.value,
        distoName2: this.menuDisto2.value,
        K2: this.getDistorsionValue(1),
        OG: (this.output.gain.value * 10).toFixed(1),
        BF: ((this.bassFilter.gain.value / 7) + 10).toFixed(1), // bassFilter.gain.value = (value-5) * 3;
        MF: ((this.midFilter.gain.value / 4) + 5).toFixed(1), // midFilter.gain.value = (value-5) * 2;
        TF: ((this.trebleFilter.gain.value / 10) + 10).toFixed(1), // trebleFilter.gain.value = (value-5) * 5;
        PF: ((this.presenceFilt.gain.value / 2) + 5).toFixed(1), // presenceFilter.gain.value = (value-5) * 2;
        EQ: this.eq.getValues(),
        MV: this.masterVolume.gain.value.toFixed(1),
        RN: this.reverb.getName(),
        RG: (this.reverb.getGain() * 10).toFixed(1),
        CN: this.cabinetSim.getName(),
        CG: (this.cabinetSim.getGain() * 10).toFixed(1)
      };
      console.log(JSON.stringify(currentPresetValue));
    }

    // END PRESETS
    bypass(cb) {
      console.log("byPass : " + cb.checked);
      if (cb.checked) {
        // byPass mode
        this.inputGain.gain.value = 1;
        this.byPass.gain.value = 0;
      } else {
        // normal ampli running mode
        this.inputGain.gain.value = 0;
        this.byPass.gain.value = 1;
      }
      // update buttons states
      //var onOffButton = this.$.myonoffswitch;
      //onOffButton.checked = cb.checked;
      var onOffSwitch = this.shadowRoot.querySelector('#switch1');
      if (cb.checked) {
        onOffSwitch.setValue(0, false);
        this.shadowRoot.querySelector('#led').setValue(1, false);
      } else {
        onOffSwitch.setValue(1, false);
        this.shadowRoot.querySelector('#led').setValue(0, false);
      }
    }

    bypassEQ(cb) {
      console.log("EQ byPass : " + cb.checked);
      if (cb.checked) {
        // byPass mode
        this.inputEQ.gain.value = 1;
        this.bypassEQg.gain.value = 0;
      } else {
        // normal ampli running mode
        this.inputEQ.gain.value = 0;
        this.bypassEQg.gain.value = 1;
      }
      // update buttons states
      //var onOffButton = this.$.myonoffswitch;
      //onOffButton.checked = cb.checked;
      var eqOnOffSwitch = this.shadowRoot.querySelector('#switch2');
      if (cb.checked) {
        eqOnOffSwitch.setValue(0, false);
      } else {
        eqOnOffSwitch.setValue(1, false);
      }
    }

    _toArray(obj) {
      return Object.keys(obj.distorsionCurves).map(function (key) {
        return key;
      });
    }

  });
})();