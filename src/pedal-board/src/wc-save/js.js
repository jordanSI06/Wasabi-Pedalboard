(function () {

  // Current document needs to be defined to get DOM access to imported HTML
  const _currentDoc = document.currentScript.ownerDocument;

  // Register the x-custom element with the browser
  customElements.define('wc-save', class extends HTMLElement {

    // ----- METHODS: DEFAULT -----
    // is called when an instance of the element is created
    constructor() {
      // Toujours appeler "super" d'abord dans le constructeur
      super();

      // Ecrire la fonctionnalité de l'élément ici
      this.pedalboard = document.querySelector('pedal-board');

      this.params = {
        dataSave: this.getAttribute('dataSave') || null,
      }
    }

    get is() { return this.nodeName.toLowerCase(); }

    // observedAttributes : Specify observed attributes so that attributeChangedCallback will work
    static get observedAttributes() { return ['data-save']; }

    // appelé lorsque l'un des attributs de l'élément personnalisé est ajouté, supprimé ou modifié.
    attributeChangedCallback(name, oldValue, newValue) {
      console.log(`Custom element ${this.is} attributes changed.`);
      try {
        console.log(`name: ${name}`);
        console.log(`oldValue:`, oldValue);
        console.log(`newValue:`, JSON.parse(newValue));
      }
      catch (err) {
        console.log(err);
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
      console.log(`Custom element ${this.is} added to page.`);

      // Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
      const shadowRoot = this.attachShadow({ mode: `open` });
      const template = _currentDoc.querySelector(`template`);
      const instance = template.content.cloneNode(true);
      shadowRoot.appendChild(instance);

      // Extract the attribute from our element. 
      this.div_dialog = this.shadowRoot.querySelector('#div_dialog');
      this.bt_openDialog = this.shadowRoot.querySelector('#bt_openDialog');
      this.bt_closeDialog = this.shadowRoot.querySelector('#bt_closeDialog');
      this.bt_saveBank = this.shadowRoot.querySelector('#bt_saveBank');
      this.bt_savePreset = this.shadowRoot.querySelector('#bt_savePreset');
      this.input_presetName = this.shadowRoot.querySelector('#input_presetName');
      this.nav_banks = this.shadowRoot.querySelector('#nav_banks');
      this.nav_presets = this.shadowRoot.querySelector('#nav_presets');

      // customListeners
      this.bankSelected = '';

      //
      if (localStorage.getItem('banks')) this.banks = JSON.parse(localStorage.getItem('banks'));
      else this.banks = [];
      localStorage.setItem('banks', JSON.stringify(this.banks));
      this.loadBanks();

      this.listeners();
    }


    listeners() {
      // button savePreset
      this.bt_openDialog.onclick = (e) => this.openDialog();
      this.bt_closeDialog.onclick = (e) => this.closeDialog();
      this.bt_saveBank.onclick = (e) => this.addNewBank();
      this.bt_savePreset.onclick = (e) => this.savePreset();

    }

    openDialog() {
      this.div_dialog.classList.remove('hidden');
    }
    closeDialog() {
      this.div_dialog.classList.add('hidden');
    }

    loadBanks() {
      this.nav_banks.innerHTML = '';
      Object.keys(this.banks).map(
        (elem, index) => {
          this.nav_banks.insertAdjacentHTML('beforeEnd', this.renderLink(this.banks[elem]));
        }
      )
      this.selectBanksListeners();
    }

    loadPresets() {
      let bankSelected = this.banks.find(item => item._id == this.bankSelected);
      let _presets = bankSelected.presets;
      console.log(_presets);
      this.nav_presets.innerHTML = '';
      Object.keys(_presets).map(
        (elem, index) => {
          this.nav_presets.insertAdjacentHTML('beforeEnd', this.renderLink(_presets[elem]));
        }
      )
      this.selectPresetsListeners();
    }

    loadPreset() {
      let bankSelected = this.banks.find(item => item._id == this.bankSelected);
      this.plugs = bankSelected.presets.find(item => item._id == this.presetSelected).plugs;
      console.log(`START: LOAD PRESET ${this.bankSelected} > ${this.presetSelected}`, this.plugs);

      this.nbPluginTraitee=0;
      this.loadPlugin(this.plugs[0]);
    }

    loadPlugin(p){
      this.pedalboard.addImportLinkNEW(p.type, this.pedalboard, { x: p.position.left, y: p.position.top }).then(e=>{
        this.nbPluginTraitee+=1;
        if (this.nbPluginTraitee<this.plugs.length) this.loadPlugin(this.plugs[this.nbPluginTraitee]);
        else console.log(`END: ALL ${this.nbPluginTraitee} PLUGINS WERE LOADED`);
      })
    }

    selectBanksListeners() {
      this.nav_banks.querySelectorAll('a').forEach(e => {
        console.log('a', e);
        e.onclick = (e) => this.selectBank(e.target.id);
      })
    }
    
    selectBank(_id) {
      console.log('selectBank', _id);
      this.nav_banks.querySelectorAll('a').forEach(e => {
        if (e.id == _id) {
          e.classList.add('a_selected');
          this.bankSelected = e.id;
          this.loadPresets();
        } else {
          e.classList.remove('a_selected');
        }
      })
    }


    selectPresetsListeners() {
      this.nav_presets.querySelectorAll('a').forEach(e => {
        console.log('a', e);
        e.onclick = (e) => this.selectPreset(e.target.id);
        e.ondblclick = (e) => this.loadPreset();
      })
    }
    selectPreset(_id) {
      console.log('selectPreset', _id);
      this.nav_presets.querySelectorAll('a').forEach(e => {
        if (e.id == _id) {
          e.classList.add('a_selected');
          this.presetSelected = e.id;
          this.input_presetName.value = e.getAttribute('value');
          //this.loadPresets();
        } else {
          e.classList.remove('a_selected');
        }
      })
    }

    saveBank() {
      localStorage.setItem('banks', JSON.stringify(this.banks));
    }

    clearBanks() {
      localStorage.clear();
    }

    renderLink(_json) {
      return `<a href='#' id='${_json._id}' value='${_json.label}'>${_json.label}</a>`;
    }

    addNewBank() {
      let _bankName = prompt("Bank name", "");
      if (_bankName == null || _bankName == "") {
        console.log('nothing to save!');
      } else {
        _bankName = _bankName.trim();

        let _newBank = {
          "_id": `${Date.now()}_bank`,
          "label": `${_bankName}`,
          "date": `${new Date().toJSON().slice(0, 10)}`,
          "presets": []
        }
        this.banks.push(_newBank);
        this.saveBank();
        this.loadBanks();
      }
    }

    // create preset name
    savePreset() {
      let _presetName = this.input_presetName.value.trim();
      let bankSelected = this.banks.find(item => item._id == this.bankSelected);
      let _newPreset = {};
      console.log("bankSelected", bankSelected);
      if (!bankSelected.presets.find(item => item.label == _presetName)) {
        console.log('preset not exist');

        let _newPreset = {
          "_id": `${Date.now()}_preset`,
          "label": `${_presetName}`,
          "date": `${new Date().toJSON().slice(0, 10)}`,
          "plugs": this.pedalboard.pluginList
        }
        bankSelected.presets.push(_newPreset);
      } else {
        console.log('preset exist',bankSelected.presets.find(item => item.label == _presetName));
        // Not every plugin have an "params" getter, you need to try catch when using it
        bankSelected.presets.find(item => item._id == this.presetSelected).plugs = this.pedalboard.pluginList;
      }
      this.saveBank();
      this.loadPresets();
      alert('Preset was successfully saved!');
      console.log("preset saved!!!", this.banks);
    }

  });
})();