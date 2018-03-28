(function () {

  // Current document needs to be defined to get DOM access to imported HTML
  const _currentDoc = document.currentScript.ownerDocument;

  // Register the x-custom element with the browser
  customElements.define(`pedal-zita_rev`, class extends PBPlugin(HTMLElement) {

    // ----- METHODS: DEFAULT -----
    // is called when an instance of the element is created
    constructor() {
      // Toujours appeler "super" d'abord dans le constructeur
      super();

      // Ecrire la fonctionnalité de l'élément ici
      this.w = 280;
      this.h = 200;

      this.nbNodeIn = 1;
      this.nbNodeOut = 1;
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
      this.createAllInternNodes();
      this.resetKnobs();
      this.setKnobsListeners();
      this.setSwitchListener();
    }

    // ----- METHODS: CUSTOM -----
    createAllInternNodes() {
      this.fst = faust.createzitaRev(GlobalContext.context, ((dsp) => {
        console.log("GOT ZITA REV WA!!!");
        this.effect = dsp;
        this.soundNodeIn.connect(this.effect);
        this.effect.connect(this.soundNodeOut);
        console.log("zitarev créée et connectée à la soundNodeOut");
        let jsonDesc = this.effect.getJSON();
        var params = this.effect.getParams();
        this.shadowRoot.querySelector('#knob1').addEventListener('change', (e) => this.effect.setParamValue("/Zita_Rev1/Input/In_Delay", e.target.value));
        this.shadowRoot.querySelector('#knob2').addEventListener('change', (e) => this.effect.setParamValue("/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/LF_X", e.target.value));
        this.shadowRoot.querySelector('#knob3').addEventListener('change', (e) => this.effect.setParamValue("/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/Low_RT60", e.target.value));
        this.shadowRoot.querySelector('#knob4').addEventListener('change', (e) => this.effect.setParamValue("/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/Mid_RT60", e.target.value));
        this.shadowRoot.querySelector('#knob5').addEventListener('change', (e) => this.effect.setParamValue("/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/HF_Damping", e.target.value));
        this.shadowRoot.querySelector('#knob6').addEventListener('change', (e) => this.effect.setParamValue("/Zita_Rev1/RM_Peaking_Equalizer_1/Eq1_Freq", e.target.value));
        this.shadowRoot.querySelector('#knob7').addEventListener('change', (e) => this.effect.setParamValue("/Zita_Rev1/RM_Peaking_Equalizer_1/Eq1_Level", e.target.value));
        this.shadowRoot.querySelector('#knob8').addEventListener('change', (e) => this.effect.setParamValue("/Zita_Rev1/RM_Peaking_Equalizer_2/Eq2_Freq", e.target.value));
        this.shadowRoot.querySelector('#knob9').addEventListener('change', (e) => this.effect.setParamValue("/Zita_Rev1/RM_Peaking_Equalizer_2/Eq2_Level", e.target.value));
        this.shadowRoot.querySelector('#knob10').addEventListener('change', (e) => this.effect.setParamValue("/Zita_Rev1/Output/Dry/Wet_Mix", e.target.value));
        this.shadowRoot.querySelector('#knob11').addEventListener('change', (e) => this.effect.setParamValue("/Zita_Rev1/Output/Level", e.target.value));

      }));
    }

    bypass() {
      this.soundNodeIn.disconnect(this.effect);
      this.soundNodeIn.connect(this.soundNodeOut);
    }

    reactivate() {
      this.soundNodeIn.connect(this.effect);
      try {
        this.soundNodeIn.disconnect(this.soundNodeOut);
      }
      catch(error){
        console.log("plugin was not connected");
      }
    }

  });
})();