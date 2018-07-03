(function () {

  // Current document needs to be defined to get DOM access to imported HTML
  const _currentDoc = document.currentScript.ownerDocument;

  // Register the x-custom element with the browser
  customElements.define('wc-tabspedals', class extends HTMLElement {

    // ----- METHODS: DEFAULT -----
    // is called when an instance of the element is created
    constructor() {
      // Toujours appeler "super" d'abord dans le constructeur
      super();

      // Ecrire la fonctionnalité de l'élément ici
      this._pedalList = "";

      this.currentOpenedTab = {};
      this.params = {
        pedalesDefault: this.getAttribute('data-pedallist') || this._pedalList
      }
    }

    get is() { return this.nodeName.toLowerCase(); }

    // observedAttributes : Specify observed attributes so that attributeChangedCallback will work
    static get observedAttributes() { return ['data-pedallist']; }

    // appelé lorsque l'un des attributs de l'élément personnalisé est ajouté, supprimé ou modifié.
    attributeChangedCallback(name, oldValue, newValue) {
 //  console.log(`Custom element ${this.is} attributes changed.`);
      try {
        // console.log(`name: ${name}`);
        // console.log(`oldValue:`, oldValue);
        // console.log(`newValue:`, newValue);
      }
      catch (err) {
        console.log(err);
      }
      if (newValue) {
        try {
          this._pedalList = JSON.parse(newValue);
          // Fetch the data from the API and call the render method 
          Object.keys(this._pedalList).map(
            (el, index) => {
              this.render(this._pedalList[el]);
            }
          )
        } catch (error) {
          console.log(error);
        }
        try {
          this.shadowRoot.querySelector("#div_tabs").querySelectorAll("label").forEach(l => {
            l.onclick = e => this.listeners(e);
          })
          this.shadowRoot.querySelector(".bt_pinViewTabs").onclick = e => this.listeners(e);
        } catch (error) {
          console.log(error);
        }
      }
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
    }

    // ----- METHODS: CUSTOM -----
    render(_data) {

      let div_container = this.shadowRoot.querySelector('#div_container');
      if (div_container.querySelector(`#content-${_data.label}`) == null) {
        // create New Tab
        this.shadowRoot.querySelector('#div_tabs').insertAdjacentHTML('beforeEnd', `<input id='tab-${_data.label}' type='radio' value='${_data.label}' name='input-tab' checked />`);
        this.shadowRoot.querySelector('#div_tabs').insertAdjacentHTML('beforeEnd', `<label for='tab-${_data.label}'>${_data.label} (${_data.contents.length})</label>`);
        div_container.insertAdjacentHTML('beforeEnd', `<div id='content-${_data.label}' class='content hidden'></div>`);
      }
      for (let i = 0; i < _data.contents.length; i++) {
        div_container.querySelector(`#content-${_data.label}`).insertAdjacentHTML('beforeEnd', `<div class='pedals'><div id='${_data.contents[i].id}' class='pedal' draggable='true'></div><img src='${_data.contents[i].Thumbnail}'><span>${_data.contents[i].id}</span></div>`);
      }
    }

    listeners(event) {
      // viewPedalMenu
      if (event.target.textContent === "") {
        if (this.currentOpenedTab.status === "opened") {
          this.shadowRoot.querySelector("#div_app").classList.add("bottomTabs");
          this.currentOpenedTab.status = "closed";
          // change character ^ to reverse
          this.shadowRoot.querySelector("#icon_view").setAttribute("icon", "icons:expand-less");
        } else {
          this.shadowRoot.querySelector("#div_app").classList.remove("bottomTabs");
          this.currentOpenedTab.status = "opened";
          this.shadowRoot.querySelector("#icon_view").setAttribute("icon", "icons:expand-more");
        }
        // display default content
        let checked = this.shadowRoot.querySelectorAll("[name='input-tab']:checked");
        this.viewTabs(checked[0].value);

        return;
      }
      //clearTimeout(this.tabsAnimation);
      if (this.shadowRoot.querySelector("#div_app").classList.contains("bottomTabs")) {
        this.currentOpenedTab.name = event.target.textContent;

        // the clicked tab corresponds to a closed dashaboard
        // Let's open it by removing the CSS class bottomTabs
        this.shadowRoot.querySelector("#div_app").classList.remove("bottomTabs");
        this.shadowRoot.querySelector("#icon_view").setAttribute("icon", "icons:expand-more");
        this.currentOpenedTab.status = "opened";
      } else {
        // The clicked tab corresponds to an opened dashboard. We close it only if it's a click
        // on the current opened tab
        if (this.currentOpenedTab.name === event.target.textContent) {

          this.shadowRoot.querySelector("#div_app").classList.add("bottomTabs");
          this.shadowRoot.querySelector("#icon_view").setAttribute("icon", "icons:expand-less");
          this.currentOpenedTab.status = "closed";
        } else {
          // We clicked on an oped tab that is different than the current one
          // We do not close, but we need to set the new current opened tab
          this.currentOpenedTab.name = event.target.textContent;
        }

      }



      // viewTabs
      this.shadowRoot.querySelectorAll("[name='input-tab']").forEach((elem) => {
        elem.onclick = (e) => {
          this.viewTabs(e.target.value);
        }
      });

      // pedalDragStart
      this.shadowRoot.querySelectorAll(".pedal").forEach((p) => {
        p.addEventListener('dragstart', this.pedalDragStart, false);
      });
    }

    pedalDragStart(event) {
      event.dataTransfer.setData("pedalId", event.target.id);
    }

    viewTabs(_idTab) {
      this.shadowRoot.querySelectorAll('.content').forEach((e) => {
        if (e.id == `content-${_idTab}`) {
          if (e.classList.contains('hidden')) {
            e.classList.remove('hidden');
          }
        }
        else {
          if (!e.classList.contains('hidden')) {
            e.classList.add('hidden');
          }
        }
      })
    }

  });
})();