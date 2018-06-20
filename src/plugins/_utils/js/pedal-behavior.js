/** A behavior defining the functions and properties every pedal must have **/
PBPlugin = function (superClass) {
  return class extends superClass {

    constructor() {
      super();
      // elem html
      this.inputP = [];
      this.outputP = [];

      this.inputJacks = [];
      this.outputJacks = [];

      this.x = 0;
      this.y = 0;

      this.w = 0;
      this.h = 0;

      this.nbNodeIn = "";
      this.nbNodeOut = "";

      this.bestInputNumber =0 ;
      this.bestOutputNumber =0;

      // this.inputHighlighted = [];
      // this.outputHighlighted = [];

      // relative position of input and output
      this.IOsize = 15;

      // this.inputOffset ={}
      // //this.outputOffsetX = 2*this.IOsize-2;
      // this.outputOffset = {
      //   x: this.w + 2 * this.IOsize - 2,
      //   y: this.IOsize
      // }

      this.isOn = false;
      this.nodeintab = [];
      this.soundNodeIn = GlobalContext.context.createGain();
      this.soundNodeOut = GlobalContext.context.createGain();
      this.nodeintab.push(this.soundNodeIn);

     
    }
    // get isOn() {
    //   return false;
    // }

    // set isOn(_isOn) {
    //   this.isOn = _isOn;
    // }

    // get inputP(){
    //   return this.inputP;
    // }
    // set inputP(_inputP){
    //  this.inputP=_inputP;
    // }
    runBehaviorMethods() {
      /*
      once all is loaded, we create bases elements of pedals :
      -  delete knob
      -  menu knob
      - input
      - output
      */

      // console.log("Position jack input / output : ");
      // console.log(this.elem);
      // console.log(this.elem.getBoundingClientRect());
      // console.log(this.elem.pedalboard);

      let elem = this.shadowRoot.querySelector(".laPedale");

      //console.log("this.nbNodeIn", this.nbNodeIn);
      for (var i = 0; i < this.nbNodeIn; i++) {
        this.inputP[i] = document.createElement("div");
        this.inputP[i].style = 'margin-top :' + 40 * i + 'px';
        this.inputP[i].classList.add("input");
        if (typeof this.nbNodeIn == "undefined" || (this.nbNodeIn > 0)) elem.appendChild(this.inputP[i]);
      }

      // - output
      //console.log("this.nbNodeOut", this.nbNodeOut);

      for (var i = 0; i < this.nbNodeOut; i++) {
        this.outputP[i] = document.createElement("div");
        this.outputP[i].style = 'margin-top :' + 40 * i + 'px';
        this.outputP[i].classList.add("output");
        if (typeof this.nbNodeOut == "undefined" || (this.nbNodeOut > 0)) elem.appendChild(this.outputP[i]);
      }

      if (this.classList.contains("draggable")) {
        // - bouton delete
        this.delete = document.createElement("button");
        this.delete.title += 'delete';
        this.delete.className += 'delete';
        this.delete.innerHTML += '<iron-icon icon="icons:close"></iron-icon>';
        this.delete.addEventListener("click", (e) => {
          this.pedalboard.removePedal(this);
        });
        // - bouton menu
        this.optionMenu = document.createElement("button");
        this.optionMenu.title += 'option menu';
        this.optionMenu.className += 'optionMenu';
        this.optionMenu.innerHTML += '<iron-icon icon="icons:info-outline"></iron-icon>';
        this.optionMenu.addEventListener("click", (e) => {
          this.showEqualizer = (true);
        });


        this.menuLabel = document.createElement("div");
        this.menuLabel.className = "div_menuPanel";

        this.menuLabel.appendChild(this.optionMenu);
        this.menuLabel.appendChild(this.delete);
        //elem.appendChild(this.menuLabel);
        elem.insertAdjacentElement("beforebegin", this.menuLabel);
      }
    }

    setPosition(x, y) {
      this.x = x;
      this.y = y;

      this.style.left = x + "px";
      this.style.top = y + "px";
    }

    // getPosition(){
    //   return {
    //     x:this.style.left,
    //     y:this.style.top
    //   }
    // }

    /** The abstract functions every pedal must override **/
    createAllInternNodes() { }

    connectInternNodes() { }

    setKnobsListeners() { }

    //setRolesToKnobs() {}

    getDefaultButtonsValues() { }

    bypass() { }

    reactivate() { }

    /**Some function common to every pedal **/

    /** Link the pedal to a src audioNode and a destination audioNode
    It is the equivalent of connectIn(src); connectOut(destination);
    @param src : the source audioNode
    @param destination : the destination audioNode
    **/
    connect(src, destination) {
      this.connectIn(src);
      this.connectOut(destination);
    }

    /**
    Set a listener to the switch to bypass/reactivate the pedal when it is clicked
    **/
    // setSwitchListener() {
    //   this.shadowRoot.querySelector('#switch1').addEventListener('change', (e) => {
    //     if (this.isOn) this.bypass();
    //     else this.reactivate();

    //     this.isOn = !this.isOn;
    //     console.log("this.isOn",this.isOn);
    //   });
    // }

    /**
    *  Set the pedal to an active or bypassed state
    *  @param active : a Boolean indicating whether the pedal sould be active or not
    *  if active if undefined, it is considered false
    **/
    // setPedalActive(active) {
    //   if (active == undefined || active == false) {
    //     this.isOn = false;
    //     this.bypass();
    //     this.shadowRoot.querySelector('#switch1').value = 0;
    //   } else if (active) {
    //     this.isOn = true;
    //     this.reactivate();
    //     this.shadowRoot.querySelector('#switch1').value = 1;
    //   }
    // }

    /**
    * Set values to the knobs
    * @param options : the values that must be set, if it undefined the default values are used
    **/
    setValuesToKnobs(options) {
      var defaultValues = options == undefined ? this.getDefaultButtonsValues() : options;
      for (var key in defaultValues) {
        this.shadowRoot.querySelector("[data-role='" + key + "']").value = defaultValues[key];
      }
    }

    /**
    * Retrieves the current knob values of the pedal
    * @return an object containing a list of label : value , the label are the roles of the knobs
    * defined in setRolesToKnobs
    **/
    getCurrentKnobsValues() {
      var values = {};
      var knobs = this.getElementsByTagName("webaudio-knob");
      var i, l = knobs.length;
      for (i = 0; i < l; i++) {
        if (knobs[i].dataset.role)
          values[knobs[i].dataset.role] = knobs[i].value;
      }
      return values;
    }

    /**
    * Reset all the knobs values, giving them the NaN value
    **/
    resetKnobs() {
      var knobs = this.getElementsByTagName("webaudio-knob");
      for (var i = 0; i < knobs.length; i++)
        knobs[i].value = NaN;
    }

    /**
    * Disconnect the out node of the pedal
    **/
    disconnectOut() {
      this.soundNodeOut.disconnect();
    }

    /**
    * Connect the out node of the pedal
    * Updates the new destination of the pedal
    **/
    connectOut(audioNode) {
      this.destination = audioNode;
      this.soundNodeOut.connect(audioNode);
    }

    /**
    * Disconnect the in node of the pedal
    **/
    disconnectIn() {
      this.src.disconnect(this.soundNodeIn);
    }

    /**
    * Cconnect the in node of the pedal
    * Updates the new source of the pedal
    **/
    connectIn(audioNode) {
      audioNode.connect(this.soundNodeIn);
      this.src = audioNode;
    }

    getNodeIn() {
      return this.soundNodeIn;
    }

    getNodeOut() {
      return this.soundNodeOut;
    }

    getWidth() {
      return this.offsetWidth;
    }

    getInputPos() {
      //let _zoom = this.pedalboard.zoom;
      let _zoom =1;

      var xpos = [];
      var ypos = [];
      for (var i = 0; i < this.nbNodeIn; i++) {
        xpos[i] = (_zoom * this.x) + this.IOsize / 2 + (-this.IOsize / 2);
        ypos[i] = ((_zoom * this.y) + this.IOsize / 2 + (this.IOsize - 4) + 12) + 40 * i;
      }
      return { xpos, ypos }
    }

    getOutputPos() {
      let _zoom =1;
      
      var xpos = [];
      var ypos = [];
      for (var i = 0; i < this.nbNodeOut; i++) {
        xpos[i] = (_zoom * this.x) + this.IOsize / 2 + (this.w + 2 * this.IOsize - 2),
          ypos[i] = (_zoom * (this.y) + this.IOsize / 2 + (this.IOsize) + 8) + 20 * i;
      }
      return { xpos, ypos }
    }

    // ---------------------- JACK ---------------------------------
    addJackAtInput(jack) {
      this.inputJacks.push(jack);
    }

    addJackAtOutput(jack) {
      this.outputJacks.push(jack);
    }

    // ---------------------- PEDAL ---------------------------------
    move(x, y) {
      this.x = x;
      this.y = y;
      this.style.left = x + "px";
      this.style.top = y + "px";

      // Update jacks
      this.updateJackPosition();
    }

    updateJackPosition() {
      this.inputJacks.forEach((j) => j.update());
      this.outputJacks.forEach((j) => j.update());
    }

    highLightInput(i, flag) {
      if (flag) {
        this.inputP[i].style.backgroundColor = "red";
        this.inputP[i].style.borderColor = "red";
        this.inputP[i].style.borderWidth = "5px";
        this.inputP[i].style.borderStyle = "solid";
      }
      else {
        this.inputP[i].style.backgroundColor = null;
        this.inputP[i].style.borderColor = "red";
        this.inputP[i].style.borderWidth = "5px";
        this.inputP[i].style.borderStyle = null;
      }
      this.inputHighlighted = flag;
    }

    highLightOutput(i, flag) {
      if (flag) this.outputP[i].style.backgroundColor = "red";
      else this.outputP[i].style.backgroundColor = null;
      this.outputHighlighted = flag;
    }


    removeJackAtInput(jack) {
      let index = -1;
      for (let j in this.inputJacks) {
        if (this.inputJacks[j].p1 == jack.p1) {
          index = j;
        }
      }
      this.inputJacks.splice(index, 1);
    }

    removeJackAtOutput(jack) {
      let index = -1;
      let j;
      for (j in this.outputJacks) {
        if (this.outputJacks[j].p2 == jack.p2) {
          index = j;
        }
      }
      this.outputJacks.splice(index, 1);
    }
  }
}