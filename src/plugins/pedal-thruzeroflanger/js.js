(function () {

  // Current document needs to be defined to get DOM access to imported HTML
  const _currentDoc = document.currentScript.ownerDocument;

  // Register the x-custom element with the browser
  customElements.define(`pedal-thruzeroflanger`, class extends PBPlugin(HTMLElement) {

    // ----- METHODS: DEFAULT -----
    // is called when an instance of the element is created
    constructor() {
      // Toujours appeler "super" d'abord dans le constructeur
      super();

      // Ecrire la fonctionnalité de l'élément ici
      this.w = 120;
      this.h = 50;

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
      console.log(this);

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
        var tzf = this;
        var host = this.shadowRoot.querySelector("#TZF");
        host.context = GlobalContext.context;
        host.load("https://wasabi.i3s.unice.fr/WebAudioPluginBank/Oliver-Larkin/ThruZeroFlanger/FaustThruZeroFlanger.html").then(function (node) {
        // ppd.w = node._gui.properties.dataWidth.value;
        // ppd.h = node._gui.properties.dataHeight.value;  
        tzf.soundNodeIn.connect(node);
        node.connect(tzf.soundNodeOut);
        });
      }
  });
})();