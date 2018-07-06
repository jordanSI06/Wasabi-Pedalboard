/**
 * PBPlugin is a wrapper allows each plugin fethed to the pedalboard to has a common behavior
 * -it's draggable
 * -it's connectable
 */
PBPlugin = function (superClass) {
  return class extends superClass {

    constructor() {
      super();

      //HTML I/O Arrays
      this.inputP = [];
      this.outputP = [];

      this.inputJacks = [];
      this.outputJacks = [];

      // Position and with/heigth 
      this.x = 0;
      this.y = 0;
      this.w = 0;
      this.h = 0;

      // Count the I/O
      this.nbNodeIn = "";
      this.nbNodeOut = "";

      // The nearest I/O
      this.bestInputNumber = 0;
      this.bestOutputNumber = 0;

      // relative position of input and output
      this.IOsize = 15;

      // audio input array
      this.nodeintab = [];

      // The default I/O
      this.soundNodeIn = GlobalContext.context.createGain();
      this.soundNodeOut = GlobalContext.context.createGain();
      this.nodeintab.push(this.soundNodeIn);
    }

    runBehaviorMethods() {
      /*
      once all is loaded, we create bases elements of pedals :
      -  delete knob
      -  menu knob
      - input
      - output
      */

      // Pre-selector 
      let elem = this.shadowRoot.querySelector(".laPedale");

      //Creation of as much graphic inputs as nbNodeIn. nbNodeIn has been set in factory just before the runbehaviormethod is called
      for (var i = 0; i < this.nbNodeIn; i++) {
        this.inputP[i] = document.createElement("div");
        this.inputP[i].style = 'margin-top :' + 40 * i + 'px';
        this.inputP[i].classList.add("input");
        if (typeof this.nbNodeIn == "undefined" || (this.nbNodeIn > 0)) elem.appendChild(this.inputP[i]);
      }

      //Creation of as much graphic outputs as nbNodeOut. nbNodeOut has been set in factory just before the runbehaviormethod is called
      for (var i = 0; i < this.nbNodeOut; i++) {
        this.outputP[i] = document.createElement("div");
        this.outputP[i].style = 'margin-top :' + 40 * i + 'px';
        this.outputP[i].classList.add("output");
        if (typeof this.nbNodeOut == "undefined" || (this.nbNodeOut > 0)) elem.appendChild(this.outputP[i]);
      }

      if (this.classList.contains("draggable")) {
        //delete button 
        this.delete = document.createElement("button");
        this.delete.title += 'delete';
        this.delete.className += 'delete';
        this.delete.innerHTML += '<iron-icon icon="icons:close"></iron-icon>';
        this.delete.addEventListener("click", (e) => {
          this.pedalboard.removePedal(this);
        });
        // menu button 
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


    /** The abstract functions every pedal must override **/

    // observedAttributes : Specify observed attributes so that attributeChangedCallback will work
    static get observedAttributes() { }

    // Called if one of the observed attribute changed.
    attributeChangedCallback() { }

    // called when the plugin is moved to another document
    adoptedCallback() {
      console.log(`Custom element ${this.is} moved to new page.`);
    }

    // Called when the pedal is disconnected from the dom 
    disconnectedCallback() {
      console.log(`Custom element ${this.is} removed from page.`);
    }

    // is called every time the element is inserted into the DOM. It is useful for running setup code, such as fetching resources or rendering.
    connectedCallback() { }
    // Code for fetching/loading/appening the module
    loadandBuildPlugin() { }


    /**Some function common to every pedal **/

    /** Link the pedal to a src audioNode and a destination audioNode
    It is the equivalent of connectIn(src); connectOut(destination);
    @param src : the source audioNode
    @param destination : the destination audioNode
    **/

    /**
     * Method used when you do a standard connection (using soundNodeIn, soundNodeOut)
     */
    connect(src, destination) {
      this.connectIn(src);
      this.connectOut(destination);
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

    /**
     * Return the position of each input on the PBPlugin
     */
    getInputPos() {
      let _zoom = this.pedalboard.zoom;// That is why when zoom is under 1, the input pos a bad calculated !!!!!!!
      var xpos = [];
      var ypos = [];
      for (var i = 0; i < this.nbNodeIn; i++) {
        xpos[i] = ((this.x) + this.IOsize / 2 + (-this.IOsize / 2));
        ypos[i] = (((this.y) + this.IOsize / 2 + (this.IOsize - 4) + 12) + 40 * i) ;
      }
      
      return { xpos, ypos }
    }

    /**
    * Return the position of each output on the PBPlugin
    */
    getOutputPos() {
      let _zoom = this.pedalboard.zoom;// That is why when zoom is under 1, the input pos a bad calculated !!!!!!!

      var xpos = [];
      var ypos = [];
      for (var i = 0; i < this.nbNodeOut; i++) {
        xpos[i] = ((this.x) + this.IOsize / 2 + (this.w + 2 * this.IOsize - 2)),
        ypos[i] = (((this.y) + this.IOsize / 2 + (this.IOsize) + 8) + 20 * i);

      }
      //console.log(xpos, ypos)
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

    /**
     * Transform the style of the bestInput (nearest)
     * @param {Int} i number of input chosen
     * @param {boolean} flag active highlight
     */
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
    /**
     * Transform the style of the bestOutput (nearest)
     * @param {Int} i number of input chosen
     * @param {boolean} flag active highlight
     */
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