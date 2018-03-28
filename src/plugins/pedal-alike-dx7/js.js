(function () {

  // Current document needs to be defined to get DOM access to imported HTML
  const _currentDoc = document.currentScript.ownerDocument;

  // Register the x-custom element with the browser
  customElements.define(`pedal-alike-dx7`, class extends PBPlugin(HTMLElement) {

    // ----- METHODS: DEFAULT -----
    // is called when an instance of the element is created
    constructor() {
      // Toujours appeler "super" d'abord dans le constructeur
      super();

      // Ecrire la fonctionnalité de l'élément ici
      this.w = 825;
      this.h = 120;

      this.nbNodeIn = 0;
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
    }

    // ----- METHODS: CUSTOM -----
    createAllInternNodes() {
      let actx, dx = this;

      if (AWPF.isAudioWorkletPolyfilled)
        actx = AWPF.context;
      else actx = GlobalContext.context;

      var host = this.shadowRoot.querySelector('#dx7');
      var rect = host.getBoundingClientRect();



      host.context = actx;
      host.load("https://webaudiomodules.org/synths/dx7.js").then(function (wam) {
        wam.connect(dx.soundNodeOut); // Jari: this.soundNoteOut is inherited too...
      });
    }

  });
})();