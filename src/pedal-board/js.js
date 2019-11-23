// (function () {

// Current document needs to be defined to get DOM access to imported HTML
const _currentDocPB = document.currentScript.ownerDocument;

// Register the x-custom element with the browser
class PedalBoard extends HTMLElement {
  // ----- METHODS: DEFAULT -----
  // is called when an instance of the element is created
  constructor() {
    super();
    window.PedalBoard = this;

    // Ecrire la fonctionnalité de l'élément ici
    this.pedals = [];

    // getAudioPlugins
    this.pluginConnected = [];
    this.pluginSettings = [];

    this.pIn;
    this.pIn2;
    this.pOut;

    // clip detector
    this.meter1;
    this.meter2;
    this.meter3;
    this.meter4;
    this.canvasInputContext1;
    this.canvasInputContext2;
    this.canvasInputContext3;
    this.canvasInputContext4;

    this.currentState = "none";
    this.oldMousePosX = 0;
    this.oldMousePosY = 0;
    this.menuState = 0;
    this.currentDraggablePedal = "";
    this.currentPedalOppened = "";
    this.pedalboardOrigin = [];
    //this.nbPedalsAdded = 0;

    this.w = 0;
    this.h = 0;
    this.wO = 0;
    this.hO = 0;

    this.zoomtab = [
      0.6,
      0.7,
      0.8,
      0.9,
      1,
      1.1,
      1.2,
      1.3,
      1.4,
      1.5,
      1.6,
      1.7,
      1.8,
      1.9,
      2
    ];
    this.zoomindex = 2;
    this.zoom = this.zoomtab[this.zoomindex];

    // factory
    this.factory = new factory();
    this.repo;

    // ===== ===== SOUND ===== =====
    this.sound = {
      context: null,
      audioDestination: null,
      gainNodeIn: null,
      gainNodeOut: null,
      gainUserMedia: null,
      gainUserMedia2: null,
      mediaSource: null,
      userMediaSource: null,
      monouserMediaSource: null,
      state: 0
    };
  }
  get is() {
    return this.nodeName.toLowerCase();
  }

  // observedAttributes : Specify observed attributes so that attributeChangedCallback will work
  static get observedAttributes() {
    return ["data-newzoom"];
  }

  // appelé lorsque l'un des attributs de l'élément personnalisé est ajouté, supprimé ou modifié.
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Custom element ${this.is} attributes changed.`);
    try {
      console.log(`name: ${name}`);
      console.log(`oldValue:`, oldValue);
      console.log(`newValue:`, newValue);
      this.newZoom = newValue;
      console.log("this.newZoom", this.newZoom);
    } catch (err) {
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
    //  console.log(`Custom element ${this.is} added to page.`);

    // Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
    const shadowRoot = this.attachShadow({ mode: `open` });
    const template = _currentDocPB.querySelector(`#pedalboardTemplate`);
    const instance = template.content.cloneNode(true);
    shadowRoot.appendChild(instance);

    this.soundSample = shadowRoot
      .querySelector("wc-audio")
      .shadowRoot.querySelector("audio");

    // Get the multitrack component
    this.multitrackPlayer = shadowRoot.querySelector("wc-multitrack");

    this.w = this.offsetWidth;
    this.wO = this.w;

    this.h = this.getBoundingClientRect().height;
    this.hO = this.h;

    this.pIn = document.createElement("pedal-in");
    this.pIn.id = "pedalIn1";
    this.pIn.classList.add("pedalIn");
    // for the second channel of usermedia input
    this.pIn2 = document.createElement("pedal-in");
    this.pIn2.id = "pedalIn2";

    this.pOut = document.createElement("pedal-out");
    this.pOut.id = "pedalOut";

    // create SVG canvas
    PedalBoard.createSVGcanvas(this.w, this.h);

    this.main = this.shadowRoot.querySelector("#mainPedalboard");

    // clip detector
    this.meter1 = createAudioMeter(GlobalContext.context);
    this.meter2 = createAudioMeter(GlobalContext.context);
    this.meter3 = createAudioMeter(GlobalContext.context);
    this.meter4 = createAudioMeter(GlobalContext.context);
    this.canvasInputContext1 = shadowRoot
      .querySelector("#meter1")
      .getContext("2d");
    this.canvasInputContext2 = shadowRoot
      .querySelector("#meter2")
      .getContext("2d");
    this.canvasInputContext3 = shadowRoot
      .querySelector("#meter3")
      .getContext("2d");
    this.canvasInputContext4 = shadowRoot
      .querySelector("#meter4")
      .getContext("2d");

    // Handles the WebAudio graph initialization
    this.soundHandler();

    // Adding I/O src
    this.pIn.setPosition(-20, this.h / 2);
    this.pOut.setPosition(this.w, this.h / 2);

    this.addPedal(this.pIn);
    this.addPedal(this.pOut);

    this.setMediadevicesToSoundIn();
    this.listeners();

    // Dynamic loading PART
    this._pedalList = null;
    this.nbrcat = 0;

    // to add another repository  : Uncomment the promise.all block, set the urls and comment the "this.request" line
    Promise.all([
      this.request("https://webaudiomodules.org/repository.json"),
      //this.request("https://wasabi.i3s.unice.fr/WebAudioPluginBank/repository.json")]).then(repo => {
      this.request(
        "https://mainline.i3s.unice.fr/WebAudioPluginBank/repository.json"
      )
    ]).then(repo => {
      for (var i = 0; i < repo.length; i++) {
        if (i == repo.length - 1) var lastrepo = true;
        this.explorerepo(repo[i], lastrepo);
      }
    });
    this.doZoom();
  }

  // ----- METHODS: CUSTOM -----

  // fetching a json file asynchronously and return it
  async request(URL) {
    const response = await fetch(URL);
    this.repo = await response.json();
    return this.repo;
  }

  // for each plugin of a repository, get the data (classname, tagName, categorie) and call appendtoPedalList
  explorerepo(repo, last) {
    var count = 0;
    Object.keys(repo.plugs).map((key, index) => {
      var baseURL = repo.plugs[key];
      let MetadataFileURL = baseURL + "/main.json";
      let scriptURL = baseURL + "/main.js";
      // get the main.json for this plugin
      let metadata;
      fetch(MetadataFileURL)
        .then(responseJSON => {
          return responseJSON.json();
        })
        .then(metadata => {
          let className = metadata.vendor + metadata.name;
          let tagName = `pedal-` + metadata.name;
          let thumbnail = baseURL + "/" + metadata.thumbnail;
          this.appendToPedalList(
            metadata.category,
            tagName,
            className,
            baseURL,
            thumbnail
          );

          // set the attribute of wc-pedals to activate the callback in case :
          // this is the last plugin to be append, this is the last repo to be fetch.
          if (count == Object.keys(repo.plugs).length - 1 && last)
            this.shadowRoot
              .querySelector("wc-tabspedals")
              .setAttribute("data-pedallist", JSON.stringify(this._pedalList));
          count++;
        })
        .catch(e => {
          console.log(e);
        });
    });
  }

  // Append the json to pedalList
  appendToPedalList(categorie, tagName, className, URL, thumbnail) {
    var catExist;
    var catMatchRank;
    for (var cat in this._pedalList) {
      if (this._pedalList[cat].label == categorie) {
        catExist = true;
        catMatchRank = cat;
      }
    }

    var currentCat = "cat" + this.nbrcat;
    // first case :  the json is empty, so we create a first categorie and append the linked content
    if (this._pedalList === null) {
      var tempMeta = {
        ["cat" + this.nbrcat]: {
          label: `${categorie}`,
          contents: [
            {
              id: `${tagName.toLowerCase()}`,
              classname: `${className}`,
              BaseUrl: `${URL}`,
              Thumbnail: `${thumbnail}`
            }
          ]
        }
      };
      this.nbrcat++;
      // merge the json objects
      this._pedalList = Object.assign(tempMeta, this._pedalList);
    } else {
      // 2nd case : the categorie exist : we just need to append the plugin into it
      if (catExist) {
        this._pedalList[catMatchRank].contents.push({
          id: `${tagName.toLowerCase()}`,
          classname: `${className}`,
          BaseUrl: `${URL}`,
          Thumbnail: `${thumbnail}`
        });
      } else {
        // 3rd case : the categorie does not exist, so we add it and append the content into it
        var tempMeta = {
          ["cat" + this.nbrcat]: {
            label: `${categorie}`,
            contents: [
              {
                id: `${tagName.toLowerCase()}`,
                classname: `${className}`,
                BaseUrl: `${URL}`,
                Thumbnail: `${thumbnail}`
              }
            ]
          }
        };
        // merge the json objects
        this._pedalList = Object.assign(tempMeta, this._pedalList);
        this.nbrcat++;
      }
    }
  }

  listeners() {
    // For pedals to be draggable
    this.addDraggableListeners();

    // Hide menu if the window is resized: toggleMenuOff();
    // Repositions the pedal located on the right according to the new width
    window.onresize = e => this.resizeElements();

    this.addChangeAudioListeners();

    this.shadowRoot.querySelector("#mainPedalboard").ondragover = e => {
      this.dragPedalHandler(e);
    };
    this.shadowRoot.querySelector("#mainPedalboard").ondrop = e => {
      this.dropPedalHandler(e);
    };

    //Listeners for well working tabs
    this.shadowRoot.querySelector("#bt_openMicroDevices").onclick = e => {
      if (
        !this.shadowRoot
          .querySelector("#divAudioPlayer")
          .classList.contains("hidden")
      )
        this.shadowRoot
          .querySelector("#divAudioPlayer")
          .classList.toggle("hidden");
      if (
        !this.shadowRoot
          .querySelector("wc-save")
          .shadowRoot.querySelector("#div_dialog")
          .classList.contains("hidden")
      )
        this.shadowRoot
          .querySelector("wc-save")
          .shadowRoot.querySelector("#div_dialog")
          .classList.toggle("hidden");
      if (
        !this.shadowRoot
          .querySelector("#divMultiTrack")
          .classList.contains("hidden")
      )
        this.shadowRoot
          .querySelector("#divMultiTrack")
          .classList.toggle("hidden");
      this.openMediaDevices();
    };
    this.shadowRoot.querySelector("#bt_openMicroDevices").onmouseover = e => {};

    this.shadowRoot.querySelector("#bt_openAudio").onclick = e => {
      if (
        !this.shadowRoot
          .querySelector("#divSoundIn")
          .classList.contains("hidden")
      )
        this.shadowRoot.querySelector("#divSoundIn").classList.toggle("hidden");
      if (
        !this.shadowRoot
          .querySelector("wc-save")
          .shadowRoot.querySelector("#div_dialog")
          .classList.contains("hidden")
      )
        this.shadowRoot
          .querySelector("wc-save")
          .shadowRoot.querySelector("#div_dialog")
          .classList.toggle("hidden");
      if (
        !this.shadowRoot
          .querySelector("#divMultiTrack")
          .classList.contains("hidden")
      )
        this.shadowRoot
          .querySelector("#divMultiTrack")
          .classList.toggle("hidden");
      this.openAudioPlayer();
    };

    this.querySelector("#svg-canvas").onclick = e => {
      if (
        !this.shadowRoot
          .querySelector("#divAudioPlayer")
          .classList.contains("hidden")
      )
        this.shadowRoot
          .querySelector("#divAudioPlayer")
          .classList.toggle("hidden");
      if (
        !this.shadowRoot
          .querySelector("#divSoundIn")
          .classList.contains("hidden")
      )
        this.shadowRoot.querySelector("#divSoundIn").classList.toggle("hidden");
      if (
        !this.shadowRoot
          .querySelector("wc-save")
          .shadowRoot.querySelector("#div_dialog")
          .classList.contains("hidden")
      )
        this.shadowRoot
          .querySelector("wc-save")
          .shadowRoot.querySelector("#div_dialog")
          .classList.toggle("hidden");
      if (
        !this.shadowRoot
          .querySelector("#divMultiTrack")
          .classList.contains("hidden")
      )
        this.shadowRoot
          .querySelector("#divMultiTrack")
          .classList.toggle("hidden");
    };

    this.shadowRoot.querySelector("#bt_multiTrack").onclick = e => {
      if (
        !this.shadowRoot
          .querySelector("#divAudioPlayer")
          .classList.contains("hidden")
      )
        this.shadowRoot
          .querySelector("#divAudioPlayer")
          .classList.toggle("hidden");
      if (
        !this.shadowRoot
          .querySelector("#divSoundIn")
          .classList.contains("hidden")
      )
        this.shadowRoot.querySelector("#divSoundIn").classList.toggle("hidden");
      if (
        !this.shadowRoot
          .querySelector("wc-save")
          .shadowRoot.querySelector("#div_dialog")
          .classList.contains("hidden")
      )
        this.shadowRoot
          .querySelector("wc-save")
          .shadowRoot.querySelector("#div_dialog")
          .classList.toggle("hidden");
      this.openMultiTrack();
    };

    this.shadowRoot.querySelector("#bt_fullScreen").onclick = e => {
      this.openFullScreen();
    };

    this.shadowRoot.querySelector("#bt_hideHeader").onclick = e => {
      this.openHeader();
    };

    this.shadowRoot.querySelector("#bt_zoom_in").onclick = e => {
      if (this.zoomindex < this.zoomtab.length - 1) {
        this.zoomindex++;
        this.zoom = this.zoomtab[this.zoomindex];
        this.doZoom();
      } else console.log("You cannot zoom in more");
    };

    this.shadowRoot.querySelector("#bt_zoom_out").onclick = e => {
      if (this.zoomindex > 0) {
        this.zoomindex--;
        this.zoom = this.zoomtab[this.zoomindex];
        this.doZoom();
      } else console.log("You cannot zoom out more");
    };

    this.shadowRoot.querySelector("#bt_stereo").onclick = e => {
      this.changetomono();
    };

    this.shadowRoot.querySelector("#bt_clearPedalboard").onclick = e => {
      if (confirm("Do you want to clear the pedalboard?"))
        this.clearPedalboard();
    };
  }

  openHeader() {
    let bt_hideHeader = this.shadowRoot
      .querySelector("#bt_hideHeader")
      .querySelector("iron-icon");
    let _fullScreenBT = this.shadowRoot.querySelector("#header_settings");
    let _open = parseInt(_fullScreenBT.getAttribute("open"));
    if (_open == -1) {
      _fullScreenBT.style.transform = "translate(0,0)";
      bt_hideHeader.setAttribute("icon", "icons:expand-less");
    } else {
      _fullScreenBT.style.transform = "translate(0,-43px)";
      bt_hideHeader.setAttribute("icon", "icons:expand-more");
    }
    _fullScreenBT.setAttribute("open", -1 * _open);
  }

  openFullScreen() {
    let _fullScreenBT = this.shadowRoot.querySelector("#bt_fullScreen");
    let _open = parseInt(_fullScreenBT.getAttribute("open"));
    if (_open == -1) {
      document.body.webkitRequestFullScreen();
      _fullScreenBT
        .querySelector("iron-icon")
        .setAttribute("icon", "icons:fullscreen-exit");
    } else {
      document.webkitExitFullscreen();
      _fullScreenBT
        .querySelector("iron-icon")
        .setAttribute("icon", "icons:fullscreen");
    }
    _fullScreenBT.setAttribute("open", -1 * _open);
  }

  openAudioPlayer() {
    this.shadowRoot.querySelector("#divAudioPlayer").classList.toggle("hidden");
  }

  openMultiTrack() {
    this.shadowRoot.querySelector("#divMultiTrack").classList.toggle("hidden");
  }

  clearPedalboard() {
    let size = this.pedals.length - 1;
    for (let i = size; i >= 0; i--) {
      if (this.pedals[i].id != "pedalIn1" && this.pedals[i].id != "pedalOut") {
        console.log(this.pedals[i].id);
        this.removePedal(this.pedals[i]);
      }
    }
  }

  setMediadevicesToSoundIn() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
      return;
    }

    // List cameras and microphones.
    navigator.mediaDevices
      .enumerateDevices()
      .then(devices => {
        let deviceInfos = "";
        let label = "";
        let select_audioinput = this.shadowRoot.querySelector(
          "#select_audioinput"
        );
        let microphone = 1;

        devices.forEach(function(device, index) {
          deviceInfos =
            device.kind + ": " + device.label + " id = " + device.deviceId;
          if (device.kind == "audioinput") {
            if (device.deviceId == "default") {
              label = "Default input";
            } else {
              label = device.label || "microphone " + microphone++;
            }
            var option = document.createElement("option");
            option.value = device.deviceId;
            option.text = label;
            select_audioinput.appendChild(option);
          }
        });
        select_audioinput.onchange = e => {
          var index = e.target.selectedIndex;
          var id = e.target[index].value;
          var label = e.target[index].text;

          console.dir("Audio input selected : " + label + " id = " + id);
          this.changeStreamAsInputInGraph(id);
        };
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      });
  }

  addPedal(p) {
    if (!p.classList.contains("pedalIn") && p.id != "pedalOut")
      p.className = "draggable";

    this.pedals.push(p);

    p.pedalboard = this;

    this.appendChild(p);
    // For the jack menu to appear

    this.sleep(300).then(() => {
      this.handleJackMenu(p);
    });
  }

  removePedal(p) {
    let jacksIn = p.inputJacks;
    let jacksOut = p.outputJacks;

    if (jacksIn.length > 0) {
      for (let i = jacksIn.length - 1; i >= 0; i--) {
        this.disconnect(
          jacksIn[i].p1,
          jacksIn[i].p2,
          jacksIn[i].pedal2inputNumber
        );
      }
    }
    if (jacksOut.length > 0) {
      for (let i = jacksOut.length - 1; i >= 0; i--) {
        console.log(jacksOut[i].p1, jacksOut[i].p2);

        this.disconnect(
          jacksOut[i].p1,
          jacksOut[i].p2,
          jacksOut[i].pedal2inputNumber
        );
      }
    }

    try {
      delete p.shadowRoot.querySelector(".laPedale").childNodes[1]._plug;
    } catch (error) {
      console.log("plugin hierarchie does not match with regular wap");
      delete p.shadowRoot.querySelector(".laPedale").childNodes[1];
    }

    var index = this.pedals.indexOf(p);
    if (index > -1) this.pedals.splice(index, 1);
    this.removeChild(p);
  }

  isConnexionPossible(_nbNodeOut, _nbNodeIn) {
    return (
      /*((typeof _nbNodeOut == "undefined" || (_nbNodeOut > 0)) &&*/ typeof _nbNodeIn ==
        "undefined" || _nbNodeIn > 0 /*)*/
    );
  }

  connect(p1, p2, inputNumber, outputNumber) {
    //TODO: faire en sorte de reconnaitre l'output sortie de la première pédale afin de selectionner le bon chemin
    // si p1_Out && p2_In existent (>1) alors la connexion est possible
    if (this.isConnexionPossible(p1.nbNodeOut, p2.nbNodeIn)) {
      let j = new Jack();
      console.log(inputNumber);
      console.log(outputNumber);
      if (inputNumber) p2.bestInputNumber = inputNumber;
      if (outputNumber) p1.bestOutputNumber = outputNumber;
      j.connexion(p1, p2, p2.bestInputNumber, p1.bestOutputNumber);
      p1.addJackAtOutput(j);
      p2.addJackAtInput(j);
      if (inputNumber) this.soundNodeConnection(p1, p2, inputNumber);
      else this.soundNodeConnection(p1, p2);

      if (outputNumber)
        this.soundNodeConnection(p1, p2, inputNumber, outputNumber);
      else this.soundNodeConnection(p1, p2);

      // add connexion for "this.pluginConnected"
      this.pluginConnected.push({
        in: { id: p2.id, inputnumber: p2.bestInputNumber },
        out: { id: p1.id, outputNumber: p1.bestOutputNumber }
      });
    }
    console.log(this.pluginConnected);
  }

  disconnect(p1, p2, inputNumber) {
    let j;
    for (j in p1.outputJacks) {
      if (p1.outputJacks[j].p2 == p2) {
        p1.removeJackAtOutput(p1.outputJacks[j]);
      }
    }
    for (j in p2.inputJacks) {
      if (p2.inputJacks[j].p1 == p1) {
        p2.removeJackAtInput(p2.inputJacks[j]);
      }
    }

    // removes all components of the SVG Jack,
    // here 3 drawings on top of each other
    for (var i = 1; i <= 4; i++) {
      var elem = document.getElementById(
        "jack_" + p1.id + "_" + p2.id + "_" + i
      );
      if (elem != null) elem.parentNode.removeChild(elem);
    }

    this.soundNodeDisconnection(p1, p2, inputNumber);

    // remove connexion from "this.pluginConnected"
    for (let i = 0; i < this.pluginConnected.length; i++) {
      if (
        this.pluginConnected[i].in.id == p2.id &&
        this.pluginConnected[i].out == p1.id
      ) {
        this.pluginConnected.splice(i, 1);
        break;
      }
    }
  }

  doZoom() {
    this.main.style.zoom = this.zoom;
    //this.resizeElements();

    this.pIn.setPosition(-20, this.h / 2 / this.zoom);
    if (this.pIn2) this.pIn2.setPosition(-20, this.h / 4 / this.zoom);
    this.pOut.setPosition(this.w / this.zoom, this.h / 2 / this.zoom);
    this.updateSVGcanvas(this.w / this.zoom, this.h / this.zoom);

    // repositionnement des jacks
    for (var i = 0; i < this.pedals.length; i++) {
      this.pedals[i].updateJackPosition();
    }
  }

  resizeElements() {
    console.log("resize");
    let dx, dy;
    this.w = this.offsetWidth;
    this.h = this.offsetHeight;
    this.pOut.setPosition(this.w, this.h / 2);

    // produit en croix
    this.pedals.forEach((p, i) => {
      if (i > 1) {
        dx = (p.offsetLeft * this.w) / this.wO;
        dy = (p.offsetTop * this.h) / this.hO;
        p.move(dx, dy);
      }
    });

    this.wO = this.w;
    this.hO = this.h;

    this.updateSVGcanvas(this.w, this.h);

    this.doZoom();
  }

  getPedalFromHtmlElem(elem) {
    for (var i = 0; i < this.pedals.length; i++) {
      var p = this.pedals[i];
      if (p === elem) return p;
    }
    return undefined;
  }

  // move(dx, dy) {
  //   if (this.zoom == 1) {
  //     this.style.transition = '';
  //     this.pedalboardOrigin.x += dx / 50;
  //     this.pedalboardOrigin.y += dy / 50;
  //     this.style.transform = "scale(2,2) translate(" + this.pedalboardOrigin.x + "px," + this.pedalboardOrigin
  //       .y +
  //       "px)";
  //   }
  // }

  mouseMove(e) {
    let rect = this.getBoundingClientRect();
    let x = e.x - rect.left;
    let y = e.y - rect.top;

    this.pedals.forEach(p => {
      //console.log("eske t allume",p.inputHighlighted);
      /*
      be careful here this is not the pedalboard,
      we're in a forEach callback, remind the trap
      I talked into the course !!!! 
      This is why we use self = this just before !
      */
      let iPos = p.getInputPos();
      let oPos = p.getOutputPos();

      for (let count = 0; count < iPos.xpos.length; count++) {
        iPos.xpos[count] = iPos.xpos[count] * this.zoom;
        iPos.ypos[count] = iPos.ypos[count] * this.zoom;
      }

      for (let count = 0; count < oPos.xpos.length; count++) {
        oPos.xpos[count] = oPos.xpos[count] * this.zoom;
        oPos.ypos[count] = oPos.ypos[count] * this.zoom;
      }

      let distInput = [];
      let distMinToInputForHighlight = 20 * this.zoom;

      for (var i = 0; i < iPos.xpos.length; i++) {
        if (this.currentState === "drawingNewJack") {
          /*
           We must highlight the pedal input taking
           into account the length of the jack ending (an image of 100px width)
           */

          distInput[i] = this.distance(
            x,
            y,
            iPos.xpos[i] - 100 * this.zoom,
            iPos.ypos[i]
          );
          distMinToInputForHighlight = 40 * this.zoom;
        } else {
          // regular case, we're just pointing the mouse around
          distInput[i] = this.distance(x, y, iPos.xpos[i], iPos.ypos[i]);
        }
      }

      var distOutput = [];
      for (var i = 0; i < oPos.xpos.length; i++) {
        distOutput[i] = this.distance(x, y, oPos.xpos[i], oPos.ypos[i]);
      }

      // It depends if we're trying to plug a jack or not
      let bestInputDistance = 100 * this.zoom;
      for (var i = 0; i < distInput.length; i++) {
        if (distInput[i] < bestInputDistance) {
          bestInputDistance = distInput[i];
          p.bestInputNumber = i;
        }
      }
      if (bestInputDistance < distMinToInputForHighlight) {
        if (!p.inputHighlighted) {
          p.highLightInput(p.bestInputNumber, true);
        }
      } else {
        if (p.inputHighlighted) p.highLightInput(p.bestInputNumber, false);
      }

      let bestOutputDistance = 100 * this.zoom;
      for (var i = 0; i < distOutput.length; i++) {
        if (distOutput[i] < bestOutputDistance) {
          bestOutputDistance = distOutput[i];
          p.bestOutputNumber = i;
        }
      }
      if (bestOutputDistance < 40 * this.zoom) {
        if (!p.outputHighlighted) p.highLightOutput(p.bestOutputNumber, true);
      } else {
        if (p.outputHighlighted) p.highLightOutput(p.bestOutputNumber, false);
      }
    });
  }

  findPedalWhoseOutputIsHighlighted() {
    for (let i = 0; i < this.pedals.length; i++) {
      let p = this.pedals[i];
      if (p.outputHighlighted) return p;
    }
  }

  findPedalWhoseInputIsHighlighted() {
    for (var i = 0; i < this.pedals.length; i++) {
      let p = this.pedals[i];
      if (p.inputHighlighted) return p;
    }
  }

  // dblclickHandler(e) {
  //   e.preventDefault();

  //   let boardWid = parseInt(window.getComputedStyle(this).width, 10);
  //   let boardHei = parseInt(window.getComputedStyle(this).height, 10);
  //   let zoomPosH = "bottom";
  //   let zoomPosW = "right";
  //   let animationName = "dezoomeffect";
  //   if (this.zoom == 0) {
  //     if (e.clientX <= (boardWid / 3)) zoomPosW = "left";
  //     else if (e.clientX > (boardWid / 3) && e.clientX < ((2 * boardWid) / 3)) zoomPosW = "center";

  //     if (e.clientY <= (boardHei / 3)) zoomPosH = "top";
  //     else if (e.clientY > (boardHei / 3) && e.clientY < ((2 * boardHei) / 3)) zoomPosH = "center";

  //     this.style.transformOrigin = zoomPosW + " " + zoomPosH;
  //     animationName = "zoomeffect";
  //     this.zoom = 1;
  //   } else {
  //     this.zoom = 0;
  //   }
  //   this.style.animation = animationName + ' 0.1s ease-out';
  //   this.style.animationFillMode = 'forwards';
  // }

  // mouseWheelHandler(e) {
  //   e.preventDefault();

  //   let board = document.querySelector('#pedalboard');
  //   let boardC = document.querySelector('#pedalboard-container');
  //   let boardWid = parseInt(window.getComputedStyle(board).width, 10);
  //   let boardHei = parseInt(window.getComputedStyle(board).height, 10);

  //   let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

  //   if (delta == 1) {
  //     this.zoom = 1;
  //     board.style.transform = 'scale(2,2)';
  //     board.style.transition = 'transform 0.5s ease-in';

  //     if (e.clientY < boardHei / 3) {
  //       if (e.clientX < boardWid / 3) {
  //         board.style.transformOrigin = 'left top';
  //       } else if (e.clientX < 2 * (boardWid / 3)) {
  //         board.style.transformOrigin = 'center top';
  //       } else {
  //         board.style.transformOrigin = 'right top';
  //       }
  //     } else if (e.clientY < 2 * (boardHei / 3)) {
  //       if (e.clientX < boardWid / 3) {
  //         board.style.transformOrigin = 'left center';
  //       } else if (e.clientX < 2 * (boardWid / 3)) {
  //         board.style.transformOrigin = 'center center';
  //       } else {
  //         board.style.transformOrigin = 'right center';
  //       }
  //     } else {
  //       if (e.clientX < boardWid / 3) {
  //         board.style.transformOrigin = 'left bottom';
  //       } else if (e.clientX < 2 * (boardWid / 3)) {
  //         board.style.transformOrigin = 'center bottom';
  //       } else {
  //         board.style.transformOrigin = 'right bottom';
  //       }
  //     }
  //   }

  //   if (delta == -1) {
  //     this.zoom = 0;
  //     board.style.transform = 'scale(1,1)';
  //     board.style.transition = 'transform 0.5s ease-in';
  //     pedalboard.pedalboardOrigin.x = 0;
  //     pedalboard.pedalboardOrigin.y = 0;
  //   }
  // }

  addInputOpenClass(p, i, input) {
    p.inputP[i].addEventListener("click", e => {
      e.preventDefault();

      input = p.inputP[i];
      this.currentPedalOppened = p;
      if (input.getAttribute("open") && input.getAttribute("open") == "true") {
        input.setAttribute("open", false);
      } else {
        input.setAttribute("open", true);
      }
      if (p.inputJacks.length > 1) {
        // createMenuItems = repositionnement des jacks
        p.inputJacks.forEach((j, numJack) =>
          j.repositionJack(input.getAttribute("open") === "true", numJack)
        );
      }
    });
  }

  handleJackMenu(p) {
    // clic on an input
    var input = "";
    try {
      for (var i = 0; i < p.inputP.length; i++) {
        this.addInputOpenClass(p, i, input);
      }
    } catch (error) {
      console.log("the plugin has no input", error);
    }
  }

  static createSVGcanvas(w, h) {
    let svg = document.getElementById("svg-canvas");
    if (null == svg) {
      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("id", "svg-canvas");
      svg.setAttribute("style", "position:absolute;top:0px;left:0px");
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      // Should use here pedalboard
      svg.setAttribute("width", w);
      svg.setAttribute("height", h);
      svg.setAttributeNS(
        "http://www.w3.org/2000/xmlns/",
        "xmlns:xlink",
        "http://www.w3.org/1999/xlink"
      );
      pedalboard.prepend(svg);
    }
    return svg;
  }

  updateSVGcanvas(w, h) {
    let svg = document.getElementById("svg-canvas");
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  }

  distance(x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);
  }

  /************* DRAGGABLE ********************/
  addDraggableListeners() {
    window.addEventListener(
      "mousedown",
      this.mouseDownDraggable.bind(this),
      false
    );
    window.addEventListener("mouseup", this.mouseUpDraggable.bind(this), false);
    // detect proximity to I/O
    this.addEventListener("mousemove", this.mouseMove.bind(this), false);
  }

  cursorPoint(evt) {
    let svg = document.querySelector("#svg-canvas");
    let pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    // pt.x = (evt.clientX);
    // pt.y = (evt.clientY);
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  removeJack(loc, sourcePedal) {
    let x1 = sourcePedal.getOutputPos().xpos[sourcePedal.bestOutputNumber];
    let y1 = sourcePedal.getOutputPos().ypos[sourcePedal.bestOutputNumber];
    let _pos = {
      x1: x1,
      y1: y1,
      x2: loc.x / this.zoom,
      y2: loc.y / this.zoom
    };

    let j = new Jack();

    // currentDraggableJack
    let cDJ = j.reviewSVGJack(_pos, "tmpJack");
    cDJ.sourcePedal = sourcePedal;
    cDJ.end.setAttribute("x", _pos.x2 - 10);
    cDJ.end.setAttribute("y", _pos.y2 - 10);
    cDJ.x1 = x1;
    cDJ.y1 = y1;

    return cDJ;
  }

  mouseDownDraggable(e) {
    // Computes the location of the mouse in the SVG canvas
    var loc = this.cursorPoint(e);
    // e.preventDefault();
    // e.stopPropagation();

    // clic : register : 1) old position of abject dragged
    // 2) clicked position
    // 3) adding mouse listener
    let p;
    window.addEventListener(
      "mousemove",
      this.mouseMoveDraggable.bind(this),
      true
    );

    if (e.target.id.startsWith("jack_")) {
      // pedale
      p = this.currentPedalOppened;
      let sourcePedal = "";
      // id du img#end jack = e.target.id
      for (var i = 0; i < p.inputJacks.length; i++) {
        if (p.inputJacks[i].end.id == e.target.id) {
          this.currentDraggableJack = p.inputJacks[i];
          sourcePedal = p.inputJacks[i].p1;
          break;
        }
      }
      this.currentState = "drawingNewJack";
      this.disconnect(sourcePedal, p);
      this.currentDraggableJack = this.removeJack(loc, sourcePedal);

      //
    } else if ((p = this.findPedalWhoseOutputIsHighlighted()) !== undefined) {
      // an output of a pedal is selected, if we drag the mouse
      // we're in the process of dragging a new cable/jack
      this.currentState = "drawingNewJack";
      this.currentDraggableJack = this.removeJack(loc, p);
    } else if ((p = this.findPedalWhoseInputIsHighlighted()) !== undefined) {
      //pedalMenu = p;
      if (p.inputJacks.length >= 1) {
        let sourcePedal = p.inputJacks[0].p1;
        // first we disconnect the jack before immediatly creating
        // a new one to drag
        this.currentState = "drawingNewJack";
        this.disconnect(sourcePedal, p, p.inputJacks[0].pedal2inputNumber);
        this.currentDraggableJack = this.removeJack(loc, sourcePedal);
      }
    } else if (this.clickInPedal(e)) {
      // dragging a pedal
      this.currentState = "draggingPedal";

      let draggableElementClicked = e.target;
      this.currentDraggablePedal = this.getPedalFromHtmlElem(
        draggableElementClicked
      );
      let p = this.currentDraggablePedal;

      if (p === undefined) return;

      p.beforeDragPosX = draggableElementClicked.offsetLeft;
      p.beforeDragPosY = draggableElementClicked.offsetTop;
    } else if (
      loc.x < parseInt(window.getComputedStyle(this).width, 10) &&
      loc.y < parseInt(window.getComputedStyle(this).height, 10)
    ) {
      // dragging the pedalboard
      this.currentState = "draggingPedalboard";
    }

    // Keep track of mouse clicked pos (source position)
    this.oldMousePosX = loc.x;
    this.oldMousePosY = loc.y;
  }

  clickInPedal(e) {
    let loc = this.cursorPoint(e);
    let result = false;
    let pedal;

    this.pedals.forEach(pedal => {
      //pedal = _p.getPedalFromHtmlElem(d);
      // if (loc.x > pedal.x && loc.x < pedal.x + pedal.w * 1.25 && loc.y > pedal.y && loc.y < pedal.y +
      //   pedal.h * 1.25) {
      result = true;
      // }
    });
    return result;
  }

  mouseUpDraggable() {
    // removing of mouse listener
    window.removeEventListener(
      "mousemove",
      this.mouseMoveDraggable.bind(this),
      true
    );
    let p;
    switch (this.currentState) {
      // after mooving a jack
      case "drawingNewJack":
        {
          // Remove current tmp jack
          //for (var i = 1; i <= 4; i++)
          for (var i = 1; i <= 2; i++) {
            var elem = document.querySelector("#tmpJack_" + i);
            elem.parentNode.removeChild(elem);
          }

          if ((p = this.findPedalWhoseInputIsHighlighted()) !== undefined) {
            // we are dragging a new Jack and we have the mouse pointer
            // close to a pedal input: let's connect the Jack !
            let already = false;
            for (var i = 0; i < p.inputJacks.length; i++) {
              // checks if the jack is already plugged in by checking if the source
              // pepdal already is in the inputJack list of the destination pedal
              if (p.inputJacks[i].p1 == this.currentDraggableJack.sourcePedal) {
                already = true;
              }
            }
            if (!already)
              this.connect(this.currentDraggableJack.sourcePedal, p);
          }
          delete this.currentDraggableJack;
        }
        break;
      // after moving a pedal
      case "draggingPedal":
        break;
      case "draggingPedalboard":
        break;
    }
    // set back pedalboard state to "none", we finished a drag
    this.currentState = "none";
  }

  mouseMoveDraggable(e) {
    // Computes the location of the mouse in the SVG canvas
    var loc = this.cursorPoint(e);
    // incremental mouse movement
    let dx = e.clientX - this.oldMousePosX;
    let dy = e.clientY - this.oldMousePosY;
    switch (this.currentState) {
      case "drawingNewJack":
        {
          //console.log("yes");
          let jackWeAreDragging = this.currentDraggableJack;
          let _pos = {
            x1: jackWeAreDragging.x1,
            y1: jackWeAreDragging.y1,
            x2: loc.x / this.zoom,
            y2: loc.y / this.zoom
          };
          //console.log(_pos.x2, _pos.y2);
          jackWeAreDragging.reviewSVGJack(_pos);
        }
        break;
      case "draggingPedal":
        {
          // Test if you're clicking on a pedal or on it's component
          // --> have to check for sliders
          if (
            this.currentDraggablePedal !== undefined &&
            this.currentDraggablePedal.classList.contains("draggable")
          ) {
            let p = this.currentDraggablePedal;
            p.move(p.beforeDragPosX + dx, p.beforeDragPosY + dy);
          }
        }
        break;
      case "draggingPedalboard":
        {
          //this.move(dx, dy);
        }
        break;
    }
  }

  openMediaDevices() {
    this.shadowRoot.querySelector("#divSoundIn").classList.toggle("hidden");
  }

  eventFire(el, etype) {
    if (el.fireEvent) {
      el.fireEvent("on" + etype);
    } else {
      var evObj = document.createEvent("Events");
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  }

  // drawloop method for clip meter canvas
  drawLoop() {
    this.canvasInputContext1.clearRect(0, 0, 100, 20);
    this.canvasInputContext2.clearRect(0, 0, 100, 20);
    this.canvasInputContext3.clearRect(0, 0, 100, 20);
    this.canvasInputContext4.clearRect(0, 0, 100, 20);

    // check if we're currently clipping
    if (this.meter1.checkClipping()) this.canvasInputContext1.fillStyle = "red";
    else this.canvasInputContext1.fillStyle = "green";

    if (this.meter2.checkClipping()) this.canvasInputContext2.fillStyle = "red";
    else this.canvasInputContext2.fillStyle = "green";

    if (this.meter3.checkClipping()) this.canvasInputContext3.fillStyle = "red";
    else this.canvasInputContext3.fillStyle = "green";

    if (this.meter4.checkClipping()) this.canvasInputContext4.fillStyle = "red";
    else this.canvasInputContext4.fillStyle = "green";

    // draw a bar based on the current volume
    this.canvasInputContext1.fillRect(0, 0, this.meter1.volume * 100 * 1.4, 20);
    this.canvasInputContext2.fillRect(0, 0, this.meter2.volume * 100 * 1.4, 20);
    this.canvasInputContext3.fillRect(0, 0, this.meter3.volume * 100 * 1.4, 20);
    this.canvasInputContext4.fillRect(0, 0, this.meter4.volume * 100 * 1.4, 20);

    // set up the next visual callback
    let rafID = window.requestAnimationFrame(this.drawLoop.bind(this));
  }

  /**
   * Get with the id pedal target infos as baseUrl, Thumbnail and classname
   * @param {*} id
   */
  getTarget(id) {
    var liste;
    GlobalContext.context.resume();
    // Generate a unique id for the pedal, handle case for multiple instances of the same pedal
    var all = JSON.parse(
      this.shadowRoot
        .querySelector("wc-tabspedals")
        .getAttribute("data-pedallist")
    );
    var target = {
      baseUrl: "",
      Thumbnail: "",
      classname: ""
    };

    for (var cat in all) {
      if (all.hasOwnProperty(cat)) {
        const categories = all[cat];
        for (var content in categories.contents) {
          if (categories.contents.hasOwnProperty(content)) {
            if (id == categories.contents[content].id) {
              target.baseUrl = categories.contents[content].BaseUrl;
              target.Thumbnail = categories.contents[content].Thumbnail;
              target.classname = categories.contents[content].classname;
            }
          }
        }
      }
    }
    return target;
  }

  dragPedalHandler(e) {
    e.preventDefault();
    return false;
  }

  // from https://www.html5rocks.com/en/tutorials/webcomponents/imports/
  // Set the id, type, position, and settings (param values) of a PBPlugin
  dropPedalHandler(e) {
    let p = {
      id: `p_${Date.now()}`,
      type: e.dataTransfer.getData("pedalId"),
      position: {
        x: (e.clientX - 3) / this.zoom,
        y: (e.clientY - 10) / this.zoom
      },
      settings: {}
    };
    this.loadPlugin(p);
  }

  loadPlugin(p) {
    return new Promise((resolve, reject) => {
      // WE LOAD: type, id, positions, settings, connexions (we'll be treated this after plugins were loaded)
      // - id
      let _id = p.id;
      // - settings
      let _settings = p.settings;
      // - type
      let _tagName = p.type;
      let target = this.getTarget(_tagName);
      // - position
      let _pos = { x: p.position.x, y: p.position.y };

      let _promise = new Promise((_resolve, _reject) => {
        // script was already loaded
        if (document.querySelector(`script[src="${target.baseUrl}/main.js"]`))
          _resolve(true);
        else {
          // script was never loaded -> we create it
          var script = document.createElement("script");
          script.src = target.baseUrl + `/main.js`;
          script.async = true;
          script.onload = e => {
            // create webcomponent plugin + setSettings
            this.factory.createPedal(
              _tagName,
              target.classname,
              target.baseUrl,
              p.id
            );
            _resolve(true);
          };
          document.head.appendChild(script);
        }
      }).then(async res => {
        // add pedal
        let plug = document.createElement(_tagName);
        //plug.setAttribute('params', JSON.stringify(_settings));
        plug.id = _id;
        plug.setPosition(_pos.x, _pos.y);
        this.addPedal(plug);
        //console.log(plug);
        await this.sleep(300).then(e => {
          //console.log(e);
        });
        //console.log('finished to sleep');
        resolve(plug);
      });
    });
  }

  sleep(_mms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(_mms), _mms);
    });
  }

  /***** II> PART SOUND *****/
  addChangeAudioListeners() {
    // Listener for input gain knob
    this.shadowRoot.querySelector("#knob_In").addEventListener("input", e => {
      this.shadowRoot.querySelector("#knob_In").title = "" + e.target.value;
      this.sound.gainNodeIn.gain.value = e.target.value;
      this.sound.gainUserMedia.gain.value = e.target.value;
      this.shadowRoot
        .querySelector("#knob_In_UserMedia")
        .setValue(e.target.value);
    });

    // Listener for output gain knob
    this.shadowRoot.querySelector("#knob_Out").addEventListener("input", e => {
      this.shadowRoot.querySelector("#knob_Out").title = "" + e.target.value;
      this.sound.gainNodeOut.gain.value = e.target.value;
    });

    // Listener for usermedia gain knob
    this.shadowRoot
      .querySelector("#knob_In_UserMedia")
      .addEventListener("input", e => {
        this.shadowRoot.querySelector("#knob_In_UserMedia").title =
          "" + e.target.value;
        this.sound.gainUserMedia.gain.value = e.target.value;
        this.sound.gainNodeIn.gain.value = e.target.value;
        this.shadowRoot.querySelector("#knob_In").setValue(e.target.value);
      });
  }

  soundHandler() {
    this.gc = GlobalContext;
    this.sound.context = this.gc.context;

    // first gain of the pdb audio graph
    this.sound.gainNodeIn = this.sound.context.createGain();
    // last gain of the pdb audio graph
    this.sound.gainNodeOut = this.sound.context.createGain();
    this.sound.gainNodeOut.gain.value = 1;
    // gain for the user media (micro or external sound card)
    this.sound.gainUserMedia = this.sound.context.createGain();
    // Player mediasource
    this.sound.mediaSource = this.sound.context.createMediaElementSource(
      this.soundSample
    );
    this.sound.audioDestination = this.sound.context.destination;

    this.sound.mediaSource.connect(this.sound.gainNodeIn);
    // here we put player into usermediagain... investigation needed
    this.sound.mediaSource.connect(this.sound.gainUserMedia);
    this.sound.gainNodeOut.connect(this.sound.audioDestination);
    // The meter1 (input) display the sound amplitude of the gainNodeIn
    this.sound.gainNodeIn.connect(this.meter1);
    // The meter3 (user media on mic wc-audio) display the sound amplitude of gainUserMedia
    this.sound.gainUserMedia.connect(this.meter3);

    // Multitrack player
    // Connect PD main output to Multitrack player input
    this.sound.gainNodeOut.connect(this.multitrackPlayer.getInput());
    // connect multitrack player output to main media gain
    this.multitrackPlayer.getOutput().connect(this.sound.audioDestination);

    if (navigator.mediaDevices.getUserMedia) {
      var constraints = {
        audio: {
          echoCancellation: false,
          mozNoiseSuppression: false,
          mozAutoGainControl: false
        }
      };
      // Streal the UserMedia input
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          window.stream = stream;
          this.sound.userMediaSource = this.sound.context.createMediaStreamSource(
            stream
          );
          // split the two potential inputs of the soundcaard
          this.splitter = this.sound.context.createChannelSplitter(2);
          this.sound.userMediaSource.connect(this.splitter);
          // Merger for the 2 soundcard inputs
          this.monouserMediaSource = this.sound.context.createChannelMerger(2);
          //UserMedia connected to its gain
          this.sound.userMediaSource.connect(this.sound.gainUserMedia); // is it useful ?
          //Merge the two inputs to a stereo channel
          this.splitter.connect(this.monouserMediaSource, 0, 0);
          this.splitter.connect(this.monouserMediaSource, 0, 1);
          this.splitter.connect(this.monouserMediaSource, 1, 0);
          this.splitter.connect(this.monouserMediaSource, 1, 1);
          // Merger connect to the usermedia gain
          this.monouserMediaSource.connect(this.sound.gainUserMedia);
        })
        .catch(function(err) {
          // handle the error
          console.log(err.name + ": " + err.message);
        });
    }

    // link to clip detector
    this.drawLoop();

    // Switch sound state : 0 for the player, 1 for the usermedia
    this.shadowRoot.querySelector("#mic").addEventListener("change", e => {
      GlobalContext.context.resume();
      // State 1: usermedia
      if (e.target.value) {
        // If the mode is one stereo input
        if (this.pedals[0].outputJacks.length != 0) {
          this.pedals[0].outputJacks.forEach(j => {
            // this.sound.state goes back to 0 for the next disconnect
            this.sound.state = 0;
            this.soundNodeDisconnection(j.p1, j.p2, j.pedal2inputNumber);
            // each state change is a new connection of the graph
            this.sound.state = 1;
            this.soundNodeConnection(j.p1, j.p2, j.pedal2inputNumber);
          });
        }

        // If the mode is two mono inputs
        if (this.pIn2.outputJacks.length != 0) {
          this.pIn2.outputJacks.forEach(j => {
            // this.sound.state goes back to 0 for the next disconnect
            this.sound.state = 0;
            this.soundNodeDisconnection(j.p1, j.p2, j.pedal2inputNumber);

            this.sound.state = 1;
            this.soundNodeConnection(j.p1, j.p2, j.pedal2inputNumber);
          });
        }
        this.monouserMediaSource.connect(this.meter1);
        this.sound.state = 1;

        // State 0: player only
      } else {
        // If the mode is one stereo input
        if (this.pedals[0].outputJacks.length != 0) {
          this.pedals[0].outputJacks.forEach(j => {
            // this.sound.state goes back to 1 for the next disconnect
            this.sound.state = 1;
            this.soundNodeDisconnection(j.p1, j.p2, j.pedal2inputNumber);

            this.sound.state = 0;
            this.soundNodeConnection(j.p1, j.p2, j.pedal2inputNumber);
          });
        }
        // If the mode is two mono inputs
        if (this.pIn2.outputJacks.length != 0) {
          this.pIn2.outputJacks.forEach(j => {
            // this.sound.state goes back to 1 for the next disconnect
            this.sound.state = 1;
            this.soundNodeDisconnection(j.p1, j.p2, j.pedal2inputNumber);

            this.sound.state = 0;
            this.soundNodeConnection(j.p1, j.p2, j.pedal2inputNumber);
          });
        }
        this.sound.state = 0;
        //this.sound.monouserMediaSource.disconnect(this.meter1);
      }
    });

    var bt_learn = this.shadowRoot.querySelector("#bt_learn");
    var span_time = this.shadowRoot.querySelector("#span_time");
    let _tabVolume = [];
    let i = 4000;
    let _interval = null;
    let volumeMax = 0;
    // When you play for 4 seconds, the input gain is adjusted depending on the max measured value
    bt_learn.addEventListener("click", e => {
      this.sound.gainUserMedia.gain.value = 1;
      if (this.sound.gainUserMedia2) this.sound.gainUserMedia2.gain.value = 1;

      _tabVolume = [];
      i = 4000;
      _interval = setInterval(() => {
        _tabVolume.push(this.meter3.volume);
        i -= 100;
        if (i == 3000 || i == 2000 || i == 1000)
          span_time.textContent = i / 1000 + "s";
        if (i == 0) {
          span_time.textContent = "4s";
          volumeMax = Math.max(..._tabVolume);

          this.sound.gainUserMedia.gain.value = 1 / volumeMax / 2;
          this.sound.gainNodeIn.gain.value = this.sound.gainUserMedia.gain.value;
          this.maxInputGain = this.sound.gainUserMedia.gain.value;
          this.shadowRoot.querySelector("#knob_In_UserMedia").max =
            2 * this.maxInputGain;
          this.shadowRoot
            .querySelector("#knob_In_UserMedia")
            .setValue(this.maxInputGain, true);
          this.shadowRoot.querySelector("#knob_In").max = 2 * this.maxInputGain;
          this.shadowRoot
            .querySelector("#knob_In")
            .setValue(this.maxInputGain, true);
          window.clearInterval(_interval);
        }
      }, 100);
    });
  }

  /**
   * Allow user tu use the 2 soundcard inputs separatey
   * - Add an "pedal-in" PBPlugin to begin a new audio subgraph
   * - disconnect the merger
   * --> user has to choose the right input mode (his soundcard and not the "default" mode)
   */
  changetomono() {
    // if the current mode is one stereo input
    if (!this.querySelector("#pedalIn2")) {
      console.log("changetomono");
      this.sound.gainUserMedia2 = this.sound.context.createGain();
      this.splitter.disconnect();
      this.splitter.connect(this.sound.gainUserMedia, 0);
      this.splitter.connect(this.sound.gainUserMedia2, 1);
      this.sound.gainUserMedia2.connect(this.meter4);
      this.pIn2.classList.add("pedalIn");
      this.pIn2.setPosition(-20, this.h / 4);
      this.addPedal(this.pIn2);
    } else {
      // if the current mode is two mono inputs
      console.log("backtostereo");
      this.splitter.disconnect();
      this.splitter.connect(this.monouserMediaSource, 0, 0);
      this.splitter.connect(this.monouserMediaSource, 0, 1);
      this.splitter.connect(this.monouserMediaSource, 1, 0);
      this.splitter.connect(this.monouserMediaSource, 1, 1);
      this.removePedal(this.pIn2);
    }
  }

  changeStreamAsInputInGraph(id) {
    if (window.stream) {
      window.stream.getTracks().forEach(function(track) {
        track.stop();
      });
    }
    var constraints = {
      audio: {
        echoCancellation: false,
        mozNoiseSuppression: false,
        mozAutoGainControl: false,
        deviceId: id ? { exact: id } : undefined
      }
    };

    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      this.sound.userMediaSource = this.sound.context.createMediaStreamSource(
        stream
      );
      this.sound.userMediaSource.connect(this.splitter);
      //alert("changed input stream in graph");
      window.stream = stream;
    });
  }

  /**
   * Manage all the connection cases
   * @param {*} p1 the PBPlugin that initiate the connection
   * @param {*} p2 the PBPlugin that recieve the connection
   * @param {int} inputnumber the optionnal number of the input targeted on p2.
   */
  soundNodeConnection(p1, p2, inputnumber) {
    /**
     * there are 4 cases :
     * - direct link between a pedalboard input and THE pedalboard output
     * - Link between a pedalboard input and a PBPlugin
     * - Link between a PBPlugin and the pedalboard output
     * - Link between 2 PBPlugin
     *
     * For each of there cases, we look at the sound state (0:player, 1:usermedia)
     */

    // Case 1: direct link between a pedalboard input and THE pedalboard output
    if (p1.classList.contains("pedalIn") && p2.id == "pedalOut") {
      if (this.sound.state == 0) {
        this.sound.gainNodeIn.connect(this.sound.gainNodeOut);
        this.sound.gainNodeOut.connect(this.meter2);
      } else {
        if (p1.id == "pedalIn1") {
          this.sound.gainUserMedia.connect(this.sound.gainNodeOut);
          this.sound.gainNodeOut.connect(this.meter2); // M.BUFFA
        } else if (p1.id == "pedalIn2") {
          this.sound.gainUserMedia2.connect(this.sound.gainNodeOut);
          this.sound.gainNodeOut.connect(this.meter2); // M.BUFFA
        }
      }
    }

    //Case 2:Link between a pedalboard input and a PBPlugin
    else if (p1.classList.contains("pedalIn")) {
      if (this.sound.state == 0) {
        if (inputnumber)
          this.sound.gainNodeIn.connect(p2.nodeintab[inputnumber]);
        else this.sound.gainNodeIn.connect(p2.nodeintab[p2.bestInputNumber]);
      } else {
        // pdb input selected is pedalIn1
        if (p1.id == "pedalIn1") {
          if (inputnumber)
            this.sound.gainUserMedia.connect(p2.nodeintab[inputnumber]);
          else
            this.sound.gainUserMedia.connect(p2.nodeintab[p2.bestInputNumber]);
        }
        // pdb input selected is pedalIn2
        else if (p1.id == "pedalIn2") {
          if (inputnumber)
            this.sound.gainUserMedia2.connect(p2.nodeintab[inputnumber]);
          else
            this.sound.gainUserMedia2.connect(p2.nodeintab[p2.bestInputNumber]);
        }
      }
    }

    //Case 3:Link between a PBPlugin and the pedalboard output
    else if (p2.id == "pedalOut") {
      p1.soundNodeOut.connect(this.sound.gainNodeOut);
      this.sound.gainNodeOut.connect(this.meter2);
    }
    // Case 4: Link between 2 PBPlugin
    else {
      if (inputnumber) p1.soundNodeOut.connect(p2.nodeintab[inputnumber]);
      else p1.soundNodeOut.connect(p2.nodeintab[p2.bestInputNumber]);
    }
  }

  /**
   * Manage all the disconnection cases
   * @param {*} p1 the PBPlugin which has its output connected
   * @param {*} p2 the PBPlugin which has input(s) connected
   * @param {int} inputnumber the optionnal number of the input connected on p2.
   */
  soundNodeDisconnection(p1, p2, inputnumber) {
    /**
     * there are 4 cases :
     * - direct link between a pedalboard input and THE pedalboard output
     * - Link between a pedalboard input and a PBPlugin
     * - Link between a PBPlugin and the pedalboard output
     * - Link between 2 PBPlugin
     *
     * For each of there cases, we look at the sound state (0:player, 1:usermedia)
     */

    // Case 1: direct link between a pedalboard input and THE pedalboard output
    if (p1.classList.contains("pedalIn") && p2.id == "pedalOut") {
      if (this.sound.state == 0) {
        this.sound.gainNodeIn.disconnect(this.sound.gainNodeOut);
      } else {
        if (p1.id == "pedalIn1")
          this.sound.gainUserMedia.disconnect(this.sound.gainNodeOut);
        else if (p1.id == "pedalIn2")
          this.sound.gainUserMedia2.disconnect(this.sound.gainNodeOut);
      }
    }

    //Case 2:Link between a pedalboard input and a PBPlugin
    else if (p1.classList.contains("pedalIn")) {
      if (this.sound.state == 0) {
        if (inputnumber)
          this.sound.gainNodeIn.disconnect(p2.nodeintab[inputnumber]);
        else this.sound.gainNodeIn.disconnect(p2.soundNodeIn);
      } else {
        // pdb input selected is pedalIn1
        if (p1.id == "pedalIn1") {
          if (inputnumber)
            this.sound.gainUserMedia.disconnect(p2.nodeintab[inputnumber]);
          else this.sound.gainUserMedia.disconnect(p2.soundNodeIn);
        }
        // pdb input selected is pedalIn2 (only on 2 inputs mode)
        else if (p1.id == "pedalIn2") {
          if (inputnumber)
            this.sound.gainUserMedia2.disconnect(p2.nodeintab[inputnumber]);
          else this.sound.gainUserMedia2.disconnect(p2.soundNodeIn);
        }
      }
    }
    //Case 3:Link between a PBPlugin and the pedalboard output
    else if (p2.id == "pedalOut") {
      p1.soundNodeOut.disconnect(this.sound.gainNodeOut);
    }

    // Case 4: Link between 2 PBPlugin
    else {
      if (inputnumber) p1.soundNodeOut.disconnect(p2.nodeintab[inputnumber]);
      else p1.soundNodeOut.disconnect(p2.soundNodeIn);
    }
  }
}
customElements.define(`pedal-board`, PedalBoard);
