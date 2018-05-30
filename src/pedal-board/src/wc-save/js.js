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
      this.bt_saveBank = this.shadowRoot.querySelector('#bt_saveBank');
      this.bt_savePreset = this.shadowRoot.querySelector('#bt_savePreset');
      this.input_presetName = this.shadowRoot.querySelector('#input_presetName');
      this.nav_banks = this.shadowRoot.querySelector('#nav_banks');
      this.nav_presets = this.shadowRoot.querySelector('#nav_presets');
      this.img_screenshot = this.shadowRoot.querySelector('#img_screenshot');

      // customListeners
      this.bankSelected = '';
      this.plugsConnexions = '';

      //
      if (localStorage.getItem('banks')) this.banks = JSON.parse(localStorage.getItem('banks'));
      else this.banks = [];
      localStorage.setItem('banks', JSON.stringify(this.banks));
      this.loadBanks();

      this.listeners();
    }

    takeScreenshot() {
      console.log('takeScreenshot');
      html2canvas(this.pedalboard,{
        allowTaint:true,
        // foreignObjectRendering:true
      }).then(canvas=>{
          console.log('onrendered',canvas);
          // var tempcanvas = document.createElement('canvas');
          // tempcanvas.width = 350;
          // tempcanvas.height = 350;

          // var context = tempcanvas.getContext('2d');
          // context.drawImage(canvas, 112, 0, 288, 200, 0, 0, 350, 350);

          let img=document.createElement('img');
          img.src=canvas.toDataURL('image/png');
          img.style.width="400px";
          this.pedalboard.appendChild(img);


          // var link = document.createElement("a");
          // link.href = canvas.toDataURL('image/jpg');   //function blocks CORS
          // link.download = 'screenshot.jpg';
          // link.click();
      })
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

    listeners() {
      // button savePreset
      this.bt_openDialog.onclick = (e) => this.openDialog();
      this.bt_saveBank.onclick = (e) => this.addNewBank();
      this.bt_savePreset.onclick = (e) => this.savePreset();
    }

    openDialog() {
      this.div_dialog.classList.toggle('hidden');
    }

    loadPresets() {
      let bankSelected = this.banks.find(item => item._id == this.bankSelected);
      let _presets = bankSelected.presets;
      this.nav_presets.innerHTML = '';
      Object.keys(_presets).map(
        (elem, index) => {
          this.nav_presets.insertAdjacentHTML('beforeEnd', this.renderLink(_presets[elem]));
        }
      )
      this.selectPresetsListeners();
    }

    renderLink(_json) {
      //console.log('screenshot', _json.screenshot);
      // <img src="${_json.screenshot}" width=200>
      return `<a href='#' id='${_json._id}' value='${_json.label}'>${_json.label}</a>`;
    }

    loadPreset() {
      let bankSelected = this.banks.find(item => item._id == this.bankSelected);
      this.plugs = bankSelected.presets.find(item => item._id == this.presetSelected).plugs;
      this.plugsConnexions = bankSelected.presets.find(item => item._id == this.presetSelected).connexions;
      //console.log('LOADING',bankSelected.presets.find(item => item._id == this.presetSelected));
      //console.log(`START: LOAD PRESET ${this.bankSelected} > ${this.presetSelected}`, this.plugs);

      this.nbPluginTraitee = 0;

      //this.pedalboard.loadPresets(this.plugs);
      this.loadNewPlugin(this.plugs[0]);
    }

    loadNewPlugin(p) {
      this.pedalboard.loadPlugin(p).then(plugin => {
        // console.log('plugin',plugin);
        // console.log('p.settings',p.settings);
        // plugin.setAttribute('params', JSON.stringify(p.settings));
        console.log('----- !!!! PLUGIN LOADED !!!!! -----', plugin);
        console.log('NEXT : -----{{{{ this.nbPluginTraitee----- }}}}}', this.nbPluginTraitee);
        this.nbPluginTraitee += 1;
        if (this.nbPluginTraitee < this.plugs.length) this.loadNewPlugin(this.plugs[this.nbPluginTraitee]);
        else this.loadConnexions();
      })
    }

    async loadConnexions() {
      console.log(`-------------- loadConnexions (${this.plugsConnexions.length}) --------------`);
      for (let i = 0; i < this.plugsConnexions.length; i++) {
        this.pedalboard.connect(this.pedalboard.querySelector(`#${this.plugsConnexions[i].out}`), this.pedalboard.querySelector(`#${this.plugsConnexions[i].in}`));
      }
      await this.sleep(1000);
      console.log('finished to sleep');
      for (let i = 0; i < this.plugs.length; i++) {
        console.log(this.plugs[i]);
        this.pedalboard.querySelector(`#${this.plugs[i].id}`).setAttribute('params', JSON.stringify(this.plugs[i].settings));
      }
    }

    sleep(_mms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(_mms), _mms);
      })
    }

    selectBanksListeners() {
      this.nav_banks.querySelectorAll('a').forEach(e => {
        //console.log('a', e);
        e.onclick = (e) => this.selectBank(e.target.id);
      })
    }

    selectBank(_id) {
      //console.log('selectBank', _id);
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
        //console.log('a', e);
        e.onclick = (e) => this.selectPreset(e.target.id);
        e.ondblclick = (e) => this.loadPreset();
      })
    }

    selectPreset(_id) {
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
      this.takeScreenshot();
      //this.takeScreenshot().then(_screenshot=>{
      //  console.log('_screenshot',_screenshot);
      let _presetName = this.input_presetName.value.trim();
      let bankSelected = this.banks.find(item => item._id == this.bankSelected);

      let _currentPlugs = [];
      let _currentConnexions = this.pedalboard.pluginConnected;

      let _plugin = '';
      let _plugsToSave = {};
      let _settings = [];
      for (let i = 0; i < this.pedalboard.pedals.length; i++) {
        _plugin = this.pedalboard.pedals[i];
        _settings = [];
        if (_plugin.id != "pedalIn" && _plugin.id != "pedalOut") {
          _settings = _plugin.params;
          console.log(`#${_plugin.id}`, _settings);

          _plugsToSave = {
            id: _plugin.id,
            type: _plugin.tagName.toLowerCase(),
            position: {
              x: _plugin.x,
              y: _plugin.y
            },
            settings: _settings
          }

          _currentPlugs.push(_plugsToSave);
        }
      }
      if (!bankSelected.presets.find(item => item.label == _presetName)) {
        //console.log('preset not exist');

        let _newPreset = {
          "_id": `${Date.now()}_preset`,
          "label": `${_presetName}`,
          "date": `${new Date().toJSON().slice(0, 10)}`,
          "plugs": _currentPlugs,
          "connexions": _currentConnexions,
          //"screenshot":_screenshot
        }
        bankSelected.presets.push(_newPreset);
      } else {
        //console.log('preset exist', bankSelected.presets.find(item => item.label == _presetName));
        // Not every plugin have an "params" getter, you need to try catch when using it
        bankSelected.presets.find(item => item._id == this.presetSelected).plugs = _currentPlugs;
        bankSelected.presets.find(item => item._id == this.presetSelected).connexions = _currentConnexions;
        // bankSelected.presets.find(item => item._id == this.presetSelected).screenshot = _screenshot;
      }

      this.saveBank();
      this.loadPresets();
      alert('Preset was successfully saved!');
      console.log("preset saved!!!", this.banks);

      //})
    }

  });
})();