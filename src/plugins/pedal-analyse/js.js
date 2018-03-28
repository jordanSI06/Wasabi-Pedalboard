(function () {

  // Current document needs to be defined to get DOM access to imported HTML
  const _currentDoc = document.currentScript.ownerDocument;

  // Register the x-custom element with the browser
  customElements.define(`pedal-analyse`, class extends PBPlugin(HTMLElement) {

    // ----- METHODS: DEFAULT -----
    // is called when an instance of the element is created
    constructor() {
      // Toujours appeler "super" d'abord dans le constructeur
      super();

      // Ecrire la fonctionnalité de l'élément ici
      this.w = 230;
      this.h = 320;

      this.nbNodeIn = 1;
      this.nbNodeOut = 1;

      var visualiser, analyseWrapper, canvas, mode, state, clipWrapper, oscilloWrapper;
      this.mode = 2;
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

      this.createAllInternNodes();
      this.connectInternNodes();
      this.resetKnobs();
      this.setKnobsListeners();
      this.setValuesToKnobs();
      this.setPedalActive();
      this.setSwitchListener();
    }

    // ----- METHODS: CUSTOM -----
    createAllInternNodes() {
      this.shadowRoot.querySelector("#columnSlider").addEventListener("mousedown", function (event) {
        event.stopPropagation();
      }, false);

      this.analyseWrapper = this.shadowRoot.querySelector("#analyseWrapper");
      this.visualNode = GlobalContext.context.createGain(2);
    }

    connectInternNodes() {
      this.soundNodeIn.connect(this.soundNodeOut);
      this.soundNodeIn.connect(this.visualNode);
    }

    setKnobsListeners() {
      this.shadowRoot.querySelector("#slider1").addEventListener('change', (e) => {
        e.stopPropagation();
        this.setMode(e.target.value);
      });
    }

    setMode(numMode) {
      if (this.state == 0) this.mode = numMode;
    }

    getDefaultButtonsValues() {
      return { mode: 2 };
    }

    reactivate() {
      this.state = 1;
      console.log(this.mode);

      switch (this.mode) {
        case 2:
          this.visualiser = new FrequencyAnalyzer(GlobalContext.context, this.analyseWrapper, "Check by frequency");
          this.visualiser.start();
          break;
        case 1:
          this.visualiser = createAudioMeter(GlobalContext.context);
          this.canvas = document.createElement("canvas");
          this.canvas.setAttribute("id", "clipWrapper");
          this.analyseWrapper.appendChild(this.canvas);
          this.clipWrapper = this.canvas.getContext("2d");

          break;
        case 3:
          this.oscilloWrapper = document.createElement("div");
          this.oscilloWrapper.setAttribute("id", "oscilloscope");
          let sensitivity = document.createElement("input");
          sensitivity.setAttribute("id", "sensivityOsc1")
          sensitivity.setAttribute("type", "range");
          sensitivity.setAttribute("min", "-100");
          sensitivity.setAttribute("max", "100");
          sensitivity.setAttribute("value", "20");
          sensitivity.setAttribute("width", "190");
          sensitivity.setAttribute("style", "width: inherit");
          let labelOsc = document.createElement("label");
          labelOsc.setAttribute("id", "labelOsc");
          labelOsc.setAttribute("for", "sensivityOsc1");
          this.analyseWrapper.appendChild(this.oscilloWrapper);
          this.analyseWrapper.appendChild(sensitivity);
          this.analyseWrapper.appendChild(labelOsc);

          this.visualiser = new Oscilloscope(GlobalContext.context, this.oscilloWrapper, "Oscilloscope");
          sensitivity.addEventListener('input', (e) => this.visualiser.sensitivity = sensitivity.value);
          sensitivity.addEventListener("mousedown", function (event) {
            event.stopPropagation();
          }, false);
          break;
      }
      //this.soundNodeIn.connect(this.visualiser);
      this.visualNode.connect(this.visualiser);
      this.visualize();
    }

    visualize() {
      switch (this.mode) {
        case 2:
          this.visualiser.update();
          break;
        case 1:
          this.clipWrapper.clearRect(10, 150, 180, -150);
          if (this.visualiser.checkClipping())
            this.clipWrapper.fillStyle = "red";
          else
            this.clipWrapper.fillStyle = "white";
          this.clipWrapper.fillRect(10, 150, 180, -this.visualiser.volume * 100 * 3);
          break;
        case 3: this.visualiser.update();
          break;
      }
      requestAnimationFrame(this.visualize.bind(this));
    }

    bypass() {
      this.state = 0;
      if (this.mode == 2 && this.visualiser) { this.visualiser.stop(); }
      if (this.analyseWrapper) {
        while (this.analyseWrapper.firstChild) {
          this.analyseWrapper.removeChild(this.analyseWrapper.firstChild);
        }
      }
      this.visualNode.disconnect(this.visualiser);
    }

  });
})();