(function () {

  /**
   * This WC is about save/load presets
   * the actual storage is the localstorage.
   * the save system has a banks/presets/plugin/settings tree architecture
   */
  const _currentDoc = document.currentScript.ownerDocument;
  customElements.define('wc-save', class extends HTMLElement {
    constructor() {
      super();
      this.pedalboard = document.querySelector('pedal-board');
      this.params = {
        dataSave: this.getAttribute('dataSave') || null,
      }
      this.isAPresetSlected = false;
      this.bankSelected;
      this.availablePdb = true;
      this.allbanks;
      this.url = new URL(window.location.href),
      this.resultBank=this.url.searchParams.get("bank");
      this.resultPreset=this.url.searchParams.get("preset");
    
      //Laisser le temps à la page de se charger
      if(this.resultBank != null && this.resultPreset != null){
        setTimeout(() => {
          this.loadPresetOnLoad();
        }, 500);
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

    adoptedCallback() {
      console.log(`Custom element ${this.is} moved to new page.`);
    }
    disconnectedCallback() {
      console.log(`Custom element ${this.is} removed from page.`);
    }

    // is called every time the element is inserted into the DOM. It is useful for running setup code, such as fetching resources or rendering.
    connectedCallback() {
      // console.log(`Custom element ${this.is} added to page.`);

      // Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
      const shadowRoot = this.attachShadow({ mode: `open` });
      const template = _currentDoc.querySelector(`template`);
      const instance = template.content.cloneNode(true);
      shadowRoot.appendChild(instance);

      // Extract the attribute from our element. 
      this.bt_loadPreset = this.shadowRoot.querySelector('#bt_loadPreset');
      this.div_dialog = this.shadowRoot.querySelector('#div_dialog');
      this.bt_openDialog = this.shadowRoot.querySelector('#bt_openDialog');
      this.bt_saveBank = this.shadowRoot.querySelector('#bt_saveBank');
      this.bt_savePreset = this.shadowRoot.querySelector('#bt_savePreset');
      this.input_presetName = this.shadowRoot.querySelector('#input_presetName');
      this.nav_banks = this.shadowRoot.querySelector('#nav_banks');
      this.nav_presets = this.shadowRoot.querySelector('#nav_presets');
      this.img_screenshot = this.shadowRoot.querySelector('#img_screenshot');

      this.bankSelected = '';
      this.plugsConnexions = '';

      if (localStorage.getItem('banks')) {
        this.banks = JSON.parse(localStorage.getItem('banks'));
      }
      else this.banks = [];
      localStorage.setItem('banks', JSON.stringify(this.banks));
      this.loadBanks();
      this.listeners();
    }

    // takeScreenshot() {
    //   console.log('takeScreenshot');
    //   html2canvas(this.pedalboard, {
    //     allowTaint: true,
    //     // foreignObjectRendering:true
    //   }).then(canvas => {
    //     console.log('onrendered', canvas);
    //     // var tempcanvas = document.createElement('canvas');
    //     // tempcanvas.width = 350;
    //     // tempcanvas.height = 350;

    //     // var context = tempcanvas.getContext('2d');
    //     // context.drawImage(canvas, 112, 0, 288, 200, 0, 0, 350, 350);

    //     let img = document.createElement('img');
    //     img.src = canvas.toDataURL('image/png');
    //     img.style.width = "400px";
    //     this.pedalboard.appendChild(img);


    //     // var link = document.createElement("a");
    //     // link.href = canvas.toDataURL('image/jpg');   //function blocks CORS
    //     // link.download = 'screenshot.jpg';
    //     // link.click();
    //   })
    // }

    /**
     * First step : load and render the bank stage
     */
    loadBanks() {
      this.nav_banks.innerHTML = '';
      Object.keys(this.banks).map(
        (elem, index) => {
          this.nav_banks.insertAdjacentHTML('beforeEnd', this.renderLink(this.banks[elem]));
        }
      )

      Object.keys(buildInBank).map(
        (elem, index) => {
          this.nav_banks.insertAdjacentHTML('beforeEnd', this.renderLink(buildInBank[elem]));
        }
      )

      //this.nav_banks.insertAdjacentHTML('beforeEnd', this.renderLink(buildInBank));
      this.allbanks = this.banks.concat(buildInBank);
      this.selectBanksListeners();
      
    }

    /**
     * Listeners for the different elements
     * TODO: add LOAD button
     */
    listeners() {
      // Load presets only if a preset is selected
      this.bt_loadPreset.onclick = (e) => {
        if (this.isAPresetSlected) {
          this.loadPreset();
        }
        else alert("Select a preset first");
        console.log(this.shadowRoot.querySelector("#div_dialog"));
        this.shadowRoot.querySelector("#div_dialog").classList.toggle('hidden');
      }
      this.bt_openDialog.onclick = (e) => {
        if (!this.pedalboard.shadowRoot.querySelector("#divAudioPlayer").classList.contains("hidden")) this.pedalboard.shadowRoot.querySelector('#divAudioPlayer').classList.toggle('hidden');
        if (!this.pedalboard.shadowRoot.querySelector("#divSoundIn").classList.contains("hidden")) this.pedalboard.shadowRoot.querySelector('#divSoundIn').classList.toggle('hidden');
        this.openDialog();
      };
      this.bt_saveBank.onclick = (e) => this.addNewBank();

      // save presets only if a bank is selected and (a name written or a preset selected)
      this.bt_savePreset.onclick = (e) => {
        if (this.bankSelected) {
          if (this.isAPresetSlected || this.input_presetName.value) this.savePreset();
          else alert("Tape name of choose a preset to overwrite")
          this.shadowRoot.querySelector("#div_dialog").classList.toggle('hidden');
        }
      }
    }

    openDialog() {
      this.div_dialog.classList.toggle('hidden');
    }

    loadPresets() {
      this.banks = JSON.parse(localStorage.banks);
      this.allbanks = this.banks.concat(buildInBank);
      let bankSelected = this.allbanks.find(item => item._id == this.bankSelected);
      console.log(bankSelected);
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
      this.pedalboard.clearPedalboard();
      // this.showWaiting(this.availablePdb);
      this.availablePdb = false;
      let bankSelected = this.allbanks.find(item => item._id == this.bankSelected);
      this.plugs = bankSelected.presets.find(item => item._id == this.presetSelected).plugs;
      this.plugsConnexions = bankSelected.presets.find(item => item._id == this.presetSelected).connexions;
      //console.log('LOADING',bankSelected.presets.find(item => item._id == this.presetSelected));
      //console.log(`START: LOAD PRESET ${this.bankSelected} > ${this.presetSelected}`, this.plugs);
      //console.log(this.plugs);
      //console.log("plugconnexions", this.plugsConnexions);

      this.nbPluginTraitee = 0;

      //this.pedalboard.loadPresets(this.plugs);
      console.log(this.plugs)
      this.loadNewPlugins(this.plugs);
    }

    //Appelé si on a mi des params à l'URL
    loadPresetOnLoad(){
       let bankSelected = this.allbanks.find(item => item.label == this.resultBank);
        this.plugs = bankSelected.presets.find(item => item.label == this.resultPreset).plugs;
        this.plugsConnexions = bankSelected.presets.find(item => item.label == this.resultPreset).connexions;
        this.loadNewPluginsOnLoad(this.plugs);
    }

    loadNewPluginsOnLoad(plugs) {
      var promises = [];
      plugs.forEach((p, index) => {
        promises[index] = this.pedalboard.loadPlugin(p);
      });

      Promise.all(promises).then(() => {
        this.loadPluginStatesOnLoad(plugs);
       setTimeout(()=>{this.loadConnexionsOnLoad()},1500);
      });
    }

    loadPluginStatesOnLoad(plugs) {
      for (let i = 0; i < plugs.length; i++) {
        console.log(plugs[i]);
        this.pedalboard.querySelector(`#${plugs[i].id}`).setAttribute('params', JSON.stringify(plugs[i].settings));
      }
    }

    loadConnexionsOnLoad() {
      console.log(`-------------- loadConnexions (${this.plugsConnexions.length}) --------------`);
      for (let i = 0; i < this.plugsConnexions.length; i++) {
        let tabId = [];
        // console.log(this.plugsConnexions[i]);
        // console.log(this.pedalboard.pedals[this.pedalboard.pedals.length - 1].id);
        for (let i = 0; i < this.pedalboard.pedals.length; i++) {
          tabId.push(this.pedalboard.pedals[i].id);
        }
        if (this.plugsConnexions[i].out == 'pedalIn2') this.pedalboard.changetomono();
        console.log(this.plugsConnexions[i].in.inputnumber);
        this.pedalboard.connect(this.pedalboard.querySelector(`#${this.plugsConnexions[i].out}`), this.pedalboard.querySelector(`#${this.plugsConnexions[i].in.id}`), this.plugsConnexions[i].in.inputnumber);

      }

      this.availablePdb = true;
    }


    loadNewPlugins(plugs) {
      var promises = [];
      plugs.forEach((p, index) => {
        promises[index] = this.pedalboard.loadPlugin(p);
      });

      Promise.all(promises).then(() => {
        this.loadPluginStates();
       setTimeout(()=>{this.loadConnexions()},1500);
      });
    }

    loadPluginStates() {
      for (let i = 0; i < this.plugs.length; i++) {
        console.log(this.plugs[i]);
        this.pedalboard.querySelector(`#${this.plugs[i].id}`).setAttribute('params', JSON.stringify(this.plugs[i].settings));
      }
    }

    

    loadConnexions() {
      console.log(`-------------- loadConnexions (${this.plugsConnexions.length}) --------------`);
      for (let i = 0; i < this.plugsConnexions.length; i++) {
        let tabId = [];
        // console.log(this.plugsConnexions[i]);
        // console.log(this.pedalboard.pedals[this.pedalboard.pedals.length - 1].id);
        for (let i = 0; i < this.pedalboard.pedals.length; i++) {
          tabId.push(this.pedalboard.pedals[i].id);
        }
        if (this.plugsConnexions[i].out == 'pedalIn2') this.pedalboard.changetomono();
        console.log(this.plugsConnexions[i].in.inputnumber);
        this.pedalboard.connect(this.pedalboard.querySelector(`#${this.plugsConnexions[i].out}`), this.pedalboard.querySelector(`#${this.plugsConnexions[i].in.id}`), this.plugsConnexions[i].in.inputnumber);

      }

      this.availablePdb = true;
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
        e.ondblclick = (e) => {
          this.loadPreset();
          this.shadowRoot.querySelector("#div_dialog").classList.toggle('hidden');
        }
      })
    }

    selectPreset(_id) {
      this.nav_presets.querySelectorAll('a').forEach(e => {
        if (e.id == _id) {
          this.isAPresetSlected = true;
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
      console.log(JSON.parse(localStorage.getItem('banks')));
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
    async  savePreset() {
      //this.takeScreenshot();
      //this.takeScreenshot().then(_screenshot=>{
      //  console.log('_screenshot',_screenshot);
      let _presetName = this.input_presetName.value.trim();
      let bankSelected = this.allbanks.find(item => item._id == this.bankSelected);

      let _currentPlugs = [];
      let _currentConnexions = this.pedalboard.pluginConnected;
      console.log(_currentConnexions); // OK pour le gainnode

      let _plugin = '';
      let _plugsToSave = {};
      let _settings = [];
      for (let i = 0; i < this.pedalboard.pedals.length; i++) {
        _plugin = this.pedalboard.pedals[i];
        _settings = [];
        if (_plugin.id != "pedalIn1" && _plugin.id != "pedalIn2" && _plugin.id != "pedalOut") {

          // Await from the plugin to return its state so save the preset
          if (_plugin.node.getState != null) {
            await _plugin.node.getState().then((params) => {
              _settings = params;
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
            });
            console.log(_plugsToSave)
          }
          else {
            _settings = {};
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
        console.log(_newPreset)// ok pour le gainNode
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