const _currentDocPedalIn = document.currentScript.ownerDocument;
console.log("PEDAL IN");
class pedalIn extends PBPlugin(HTMLElement) {
  // ----- METHODS: DEFAULT -----
  // is called when an instance of the element is created
  constructor() {
    // Toujours appeler "super" d'abord dans le constructeur
    super();
    console.log("PEDAL IN CONSTRUCTOR");

    // Ecrire la fonctionnalité de l'élément ici
    this.w = 20;
    this.h = 20;
    this.nbNodeIn = 1;
    this.nbNodeOut = 1;
  }

  get is() {
    return this.nodeName.toLowerCase();
  }

  // observedAttributes : Specify observed attributes so that attributeChangedCallback will work
  static get observedAttributes() {
    return [""];
  }

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
    // console.log(`Custom element ${this.is} added to page.`);
    console.log("PEDAL IN CONNECTED CALLBACK");

    // Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
    try {
      const shadowRoot = this.attachShadow({ mode: `open` });
      const template = _currentDocPedalIn.querySelector(`#pedalinTemplate`);
      const instance = template.content.cloneNode(true);
      shadowRoot.appendChild(instance);
    } catch (error) {
      console.log(error);
    }

    this.runBehaviorMethods();
  }
}
customElements.define(`pedal-in`, pedalIn);

/*



(function() {
  // Current document needs to be defined to get DOM access to imported HTML
  const _currentDocPedalIn = document.currentScript.ownerDocument;

  // Register the x-custom element with the browser
  customElements.define(
    `pedal-in`,
    class extends PBPlugin(HTMLElement) {
      // ----- METHODS: DEFAULT -----
      // is called when an instance of the element is created
      constructor() {
        // Toujours appeler "super" d'abord dans le constructeur
        super();

        // Ecrire la fonctionnalité de l'élément ici
        this.w = 20;
        this.h = 20;
        this.nbNodeIn = 1;
        this.nbNodeOut = 1;
      }

      get is() {
        return this.nodeName.toLowerCase();
      }

      // observedAttributes : Specify observed attributes so that attributeChangedCallback will work
      static get observedAttributes() {
        return [""];
      }

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
        // console.log(`Custom element ${this.is} added to page.`);

        // Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
        try {
          const shadowRoot = this.attachShadow({ mode: `open` });
          const template = _currentDocPedalIn.querySelector(`#pedalinTemplate`);
          const instance = template.content.cloneNode(true);
          shadowRoot.appendChild(instance);
        } catch (error) {
          console.log(error);
        }

        this.runBehaviorMethods();
      }

      // ----- METHODS: CUSTOM -----
    }
  );
})();
*/
