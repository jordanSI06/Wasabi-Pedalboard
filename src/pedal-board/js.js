// (function () {

// Current document needs to be defined to get DOM access to imported HTML
const _currentDoc = document.currentScript.ownerDocument;

// Register the x-custom element with the browser
class PedalBoard extends HTMLElement {

  // ----- METHODS: DEFAULT -----
  // is called when an instance of the element is created
  constructor() {
    // Toujours appeler "super" d'abord dans le constructeur
    super();
    window.PedalBoard = this;

    // Ecrire la fonctionnalité de l'élément ici
    this.pedals = [];


    // getAudioPlugins
    this.pluginList = [];

    this.pIn;
    this.pOut;


    // clip detector
    this.meter1;
    this.meter2;
    this.meter3;
    this.canvasInputContext1;
    this.canvasInputContext2;
    this.canvasInputContext3;

    this.currentState = "none";
    this.oldMousePosX = 0;
    this.oldMousePosY = 0;
    this.zoom = 0;
    this.menuState = 0;
    this.currentDraggablePedal = "";
    this.currentPedalOppened = "";
    this.pedalboardOrigin = [];
    this.nbPedalsAdded = 0;

    this.w = 0;
    this.h = 0;
    this.wO = 0;
    this.hO = 0;

    // factory
    this.factory = new factory();
    this.repo;

    // ===== ===== SOUND ===== ===== 
    this.sound = {
      context: null,
      audioDestination: null,
      gainNodeIn: null,
      gainNodeOut: null,
      gainNodeInMid: null,
      mediaSource: null,
      mediaSourceM: null,
      monoMediaSourceM: null,
      state: 0
    }
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

    // this.soundSample = shadowRoot.querySelector("#soundSample");
    this.soundSample = shadowRoot.querySelector('wc-audio').shadowRoot.querySelector('audio');
    console.log(" -------- this.soundSample ---", this.soundSample);

    this.w = this.offsetWidth;
    this.wO = this.w;

    // this.h = this.offsetHeight;
    this.h = this.getBoundingClientRect().height;
    console.log("-------- H --------");
    console.log("-------- H --------");
    console.log("-------- H --------");
    console.log("-------- this.h ", this.h);
    console.log("-------- H --------");
    console.log("-------- H --------");
    this.hO = this.h;

    //this.pIn = shadowRoot.querySelector("pedal-in");
    this.pIn = document.createElement('pedal-in');
    this.pIn.id = "pedalIn";

    //this.pOut = shadowRoot.querySelector("pedal-out");
    this.pOut = document.createElement('pedal-out');
    this.pOut.id = "pedalOut";

    // create SVG canvas
    PedalBoard.createSVGcanvas(this.w, this.h);

    // clip detector  
    this.meter1 = createAudioMeter(GlobalContext.context);
    this.meter2 = createAudioMeter(GlobalContext.context);
    this.meter3 = createAudioMeter(GlobalContext.context);
    this.canvasInputContext1 = shadowRoot.querySelector("#meter1").getContext("2d");
    this.canvasInputContext2 = shadowRoot.querySelector("#meter2").getContext("2d");
    this.canvasInputContext3 = shadowRoot.querySelector("#meter3").getContext("2d");

    // Handles the WebAudio graph initialization
    this.soundHandler();

    // Adding I/O src
    this.pIn.setPosition(-20, (this.h / 2));
    this.pOut.setPosition(this.w, (this.h / 2));

    this.addPedal(this.pIn);
    this.addPedal(this.pOut);


    this.setMediadevicesToSoundIn();
    this.listeners();

    // Dynamic loading PART
    this._pedalList = null;
    this.nbrcat = 0;


    // to add another repository  : Uncomment the promise.all block, set the urls and comment the "this.request" line


    Promise.all([this.request("https://webaudiomodules.org/repository.json"), this.request("https://wasabi.i3s.unice.fr/WebAudioPluginBank/repository.json")]).then(repo => {
      console.log(repo.length);
      for (var i = 0; i < repo.length; i++) {
        console.log(repo[i]);
        if (i == repo.length - 1) var lastrepo = true
        this.explorerepo(repo[i], lastrepo);
      }
    });

    //this.request('https://wasabi.i3s.unice.fr/WebAudioPluginBank/repository.json').then(repo =>this.explorerepo(repo, true))
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
        }).then(metadata => {
          let className = metadata.vendor + metadata.name;
          let tagName = `pedal-` + metadata.name
          let thumbnail = baseURL + '/' + metadata.thumbnail
          this.appendToPedalList(metadata.category, tagName, className, baseURL, thumbnail);

          // set the attribute of wc-pedals to activate the callback in case :
          // this is the last plugin to be append, this is the last repo to be fetch.
          if (count == Object.keys(repo.plugs).length - 1 && last) this.shadowRoot.querySelector('wc-tabspedals').setAttribute('data-pedallist', JSON.stringify(this._pedalList));
          count++;
        }).catch((e) => {
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
            }]
        }
      }
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
        })
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
              }]
          }
        }
        // merge the json objects
        this._pedalList = Object.assign(tempMeta, this._pedalList);
        this.nbrcat++
      }
    }
  }


  listeners() {
    // For pedals to be draggable
    this.addDraggableListeners();

    this.resizeListener();

    this.addChangeAudioListeners();

    this.shadowRoot.querySelector('#slot').ondragover = (e) => {
      this.dragPedalHandler(e);
    }
    this.shadowRoot.querySelector('#slot').ondrop = (e) => {
      this.dropPedalHandler(e);
    }

    this.shadowRoot.querySelector('#microDevices').onclick = (e) => {
      this.openMediaDevices();
    }
  }

  setMediadevicesToSoundIn() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
      return;
    }

    // List cameras and microphones.
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      let deviceInfos = "";
      let label = "";
      let select_audioinput = this.shadowRoot.querySelector("#select_audioinput");
      let microphone = 1;

      devices.forEach(function (device, index) {
        deviceInfos = device.kind + ": " + device.label + " id = " + device.deviceId;
        if (device.kind == "audioinput") {
          if (device.deviceId == "default") {
            label = "Default input";
          } else {
            label = device.label ||
              "microphone " + (microphone++);
          }
          var option = document.createElement('option');
          option.value = device.deviceId;
          option.text = label;
          select_audioinput.appendChild(option);
        }

      });
      select_audioinput.onchange = (e) => {
        var index = e.target.selectedIndex;
        var id = e.target[index].value;
        var label = e.target[index].text;

        console.dir("Audio input selected : " + label + " id = " + id);
        this.changeStreamAsInputInGraph(id);
      }
    }).catch(function (err) {
      console.log(err.name + ": " + err.message);
    });
  }

  addPedal(p) {
    console.log("addPedal", p)
    this.pedals.push(p);
    if (p.id != "pedalIn" && p.id != "pedalOut") {
      p.className = "draggable";
      p.id = "p" + this.nbPedalsAdded;
      this.nbPedalsAdded++;
    }
    p.pedalboard = this;

    //console.log("this", this.shadowRoot.querySelector("#slot"));
    this.appendChild(p);

    // For the jack menu to appear
    this.handleJackMenu(p);
  }

  removePedal(p) {
    if (confirm("Are you sure you want to remove this pedal ?")) {
      let jacksIn = p.inputJacks;
      let jacksOut = p.outputJacks;

      if (jacksIn.length > 0) {
        for (let i = jacksIn.length - 1; i >= 0; i--) {
          // console.log("jacksIn[i].p1", jacksIn[i].p1);
          // console.log("jacksIn[i].p2", jacksIn[i].p2);
          this.disconnect(jacksIn[i].p1, jacksIn[i].p2);
        }
      }
      if (jacksOut.length > 0) {
        for (let i = jacksOut.length - 1; i >= 0; i--) {
          this.disconnect(jacksOut[i].p1, jacksOut[i].p2);
        }
      }

      var index = this.pedals.indexOf(p);
      if (index > -1) this.pedals.splice(index, 1);
      this.removeChild(p);
    }
  }


  isConnexionPossible(_nbNodeOut, _nbNodeIn) {
    return ((typeof _nbNodeOut == "undefined" || (_nbNodeOut > 0)) && (typeof _nbNodeIn == "undefined" || (_nbNodeIn > 0)));
  }

  connect(p1, p2) {
    // si p1_Out && p2_In existent (>1) alors la connexion est possible
    if (this.isConnexionPossible(p1.nbNodeOut, p2.nbNodeIn)) {
      let j = new Jack();
      j.connexion(p1, p2);
      p1.addJackAtOutput(j);
      p2.addJackAtInput(j);
      this.soundNodeConnection(p1, p2);
    }
  }

  disconnect(p1, p2) {
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
      var elem = document.getElementById("jack_" + p1.id + "_" + p2.id + "_" + i);
      if (elem != null) elem.parentNode.removeChild(elem);
    }

    this.soundNodeDisconnection(p1, p2);
  }

  getPedalFromHtmlElem(elem) {
    for (var i = 0; i < this.pedals.length; i++) {
      var p = this.pedals[i];
      if (p === elem) return p;
    }
    return undefined;
  }

  move(dx, dy) {
    if (this.zoom == 1) {
      this.style.transition = '';
      this.pedalboardOrigin.x += dx / 50;
      this.pedalboardOrigin.y += dy / 50;
      this.style.transform = "scale(2,2) translate(" + this.pedalboardOrigin.x + "px," + this.pedalboardOrigin
        .y +
        "px)";
    }

  }

  findClosestIO(x, y) {
    this.pedals.forEach((p) => {
      /*
      be careful here this is not the pedalboard,
      we're in a forEach callback, remind the trap
      I talked into the course !!!! 
      This is why we use self = this just before !
      */
      let iPos = p.getInputPos();
      let oPos = p.getOutputPos();

      let distInput;
      let distMinToInputForHighlight = 20;


      if (this.currentState === "drawingNewJack") {
        /*
        We must highlight the pedal input taking
        into account the length of the jack ending (an image of 100px width)
        */
        distInput = this.distance(x, y, iPos.x - 100, iPos.y);
        distMinToInputForHighlight = 100;
      } else {
        // regular case, we're just pointing the mouse around
        distInput = this.distance(x, y, iPos.x, iPos.y);
      }

      let distOutput = this.distance(x, y, oPos.x, oPos.y);
      // It depends if we're trying to plug a jack or not
      if (distInput < distMinToInputForHighlight) {
        if (!p.inputHighlighted) p.highLightInput(true);
      } else {
        if (p.inputHighlighted) p.highLightInput(false);
      }

      if (distOutput < 40) {
        if (!p.outputHighlighted) p.highLightOutput(true);
      } else {
        if (p.outputHighlighted) p.highLightOutput(false);
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

  rescale(s) {
    this.style = 'transform(' + s + ',' + s + ')';
  }

  dblclickHandler(e) {
    e.preventDefault();
    let boardWid = parseInt(window.getComputedStyle(this).width, 10);
    let boardHei = parseInt(window.getComputedStyle(this).height, 10);
    let zoomPosH = "bottom";
    let zoomPosW = "right";
    let animationName = "dezoomeffect";
    if (this.zoom == 0) {
      if (e.clientX <= (boardWid / 3)) zoomPosW = "left";
      else if (e.clientX > (boardWid / 3) && e.clientX < ((2 * boardWid) / 3)) zoomPosW = "center";

      if (e.clientY <= (boardHei / 3)) zoomPosH = "top";
      else if (e.clientY > (boardHei / 3) && e.clientY < ((2 * boardHei) / 3)) zoomPosH = "center";

      this.style.transformOrigin = zoomPosW + " " + zoomPosH;
      animationName = "zoomeffect";
      this.zoom = 1;
    } else {
      this.zoom = 0;
    }
    this.style.animation = animationName + ' 0.1s ease-out';
    this.style.animationFillMode = 'forwards';
  }


  mouseWheelHandler(e) {
    e.preventDefault();

    let board = document.querySelector('#pedalboard');
    let boardC = document.querySelector('#pedalboard-container');
    let boardWid = parseInt(window.getComputedStyle(board).width, 10);
    let boardHei = parseInt(window.getComputedStyle(board).height, 10);

    let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

    if (delta == 1) {
      this.zoom = 1;
      board.style.transform = 'scale(2,2)';
      board.style.transition = 'transform 0.5s ease-in';

      if (e.clientY < boardHei / 3) {
        if (e.clientX < boardWid / 3) {
          board.style.transformOrigin = 'left top';
        } else if (e.clientX < 2 * (boardWid / 3)) {
          board.style.transformOrigin = 'center top';
        } else {
          board.style.transformOrigin = 'right top';
        }
      } else if (e.clientY < 2 * (boardHei / 3)) {
        if (e.clientX < boardWid / 3) {
          board.style.transformOrigin = 'left center';
        } else if (e.clientX < 2 * (boardWid / 3)) {
          board.style.transformOrigin = 'center center';
        } else {
          board.style.transformOrigin = 'right center';
        }
      } else {
        if (e.clientX < boardWid / 3) {
          board.style.transformOrigin = 'left bottom';
        } else if (e.clientX < 2 * (boardWid / 3)) {
          board.style.transformOrigin = 'center bottom';
        } else {
          board.style.transformOrigin = 'right bottom';
        }
      }
    }

    if (delta == -1) {
      this.zoom = 0;
      board.style.transform = 'scale(1,1)';
      board.style.transition = 'transform 0.5s ease-in';
      pedalboard.pedalboardOrigin.x = 0;
      pedalboard.pedalboardOrigin.y = 0;
    }
  }

  highlightInputsOutputs(e) {
    let rect = this.getBoundingClientRect();
    let mouseX = e.x - rect.left;
    let mouseY = e.y - rect.top;
    let closest = this.findClosestIO(mouseX, mouseY);
  }

  handleJackMenu(p) {
    // clic on an input
    let input = "";
    try {
      p.inputP.addEventListener("click", (e) => {
        e.preventDefault();

        input = p.inputP;
        this.currentPedalOppened = p;
        if (input.getAttribute("open") && (input.getAttribute("open") == 'true')) {
          input.setAttribute("open", false);
        } else {
          input.setAttribute("open", true);
        }
        if (p.inputJacks.length > 1) {
          this.createMenuItems(p.inputJacks, input.getAttribute("open") === 'true');
        }
      });

    } catch (error) {
      console.log("the plugin has no input", error)

    }

  }
  createMenuItems(jacks, open) {
    let len = jacks.length;
    let offsetY = 0;
    
    jacks.forEach((j) => {
      j.repositionJack(offsetY, open);
      if (open) offsetY += 20;
      else offsetY -= 0;
    })

  }


  static createSVGcanvas(w, h) {
    let svg = document.getElementById("svg-canvas");
    if (null == svg) {
      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("id", "svg-canvas");
      svg.setAttribute('style', 'position:absolute;top:0px;left:0px');
      // Should use here pedalboard
      svg.setAttribute('width', w);
      svg.setAttribute('height', h);
      svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

      pedalboard.prepend(svg);
    }
    return svg;
  }

  updateSVGcanvas(w, h) {
    let svg = document.getElementById("svg-canvas");
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
  }

  distance(x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);
  }

  /************* DRAGGABLE ********************/
  addDraggableListeners() {
    window.addEventListener('mousedown', this.mouseDownDraggable.bind(this), false);
    window.addEventListener('mouseup', this.mouseUpDraggable.bind(this), false);
    // detect proximity to I/O
    this.addEventListener('mousemove', this.highlightInputsOutputs.bind(this), false);
  }

  cursorPoint(evt) {
    let svg = document.querySelector('#svg-canvas');
    let pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  removeJack(loc, sourcePedal) {
    let x1 = sourcePedal.getOutputPos().x;
    let y1 = sourcePedal.getOutputPos().y;
    let _pos = {
      x1: x1,
      y1: y1,
      x2: loc.x,
      y2: loc.y
    }

    let j = new Jack();

    // currentDraggableJack
    let cDJ = j.reviewSVGJack(_pos, "tmpJack");
    cDJ.sourcePedal = sourcePedal;
    cDJ.end.setAttribute("x", loc.x - 7);
    cDJ.end.setAttribute("y", loc.y - 10);
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
    window.addEventListener('mousemove', this.mouseMoveDraggable.bind(this), true);

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
      if (p.inputJacks.length == 1) {
        let sourcePedal = p.inputJacks[0].p1;
        // first we disconnect the jack before immediatly creating
        // a new one to drag
        this.currentState = "drawingNewJack";
        this.disconnect(sourcePedal, p);
        this.currentDraggableJack = this.removeJack(loc, sourcePedal);
      }
    } else if (this.clickInPedal(e)) {
      // dragging a pedal
      this.currentState = "draggingPedal";

      let draggableElementClicked = e.target;
      this.currentDraggablePedal = this.getPedalFromHtmlElem(draggableElementClicked);
      let p = this.currentDraggablePedal;

      if (p === undefined) return;

      p.beforeDragPosX = draggableElementClicked.offsetLeft;
      p.beforeDragPosY = draggableElementClicked.offsetTop;

    } else if (loc.x < parseInt(window.getComputedStyle(this).width, 10) &&
      loc.y < parseInt(window.getComputedStyle(this).height, 10)) {
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

    this.pedals.forEach((pedal) => {
      //pedal = _p.getPedalFromHtmlElem(d);
      if (loc.x > pedal.x && loc.x < pedal.x + pedal.w * 1.25 && loc.y > pedal.y && loc.y < pedal.y +
        pedal.h * 1.25) {
        result = true;
      }
    });
    return result;
  }

  mouseUpDraggable() {
    // removing of mouse listener
    window.removeEventListener('mousemove', this.mouseMoveDraggable.bind(this), true);
    let p;
    switch (this.currentState) {
      // after mooving a jack
      case "drawingNewJack":
        {
          // Remove current tmp jack
          for (var i = 1; i <= 4; i++) {
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
            if (!already) this.connect(this.currentDraggableJack.sourcePedal, p);
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

  openMediaDevices() {
    this.shadowRoot.querySelector("#divSoundIn").classList.toggle("hidden")
    if (this.shadowRoot.querySelector("#divSoundIn").classList.contains("hidden")) {
      this.shadowRoot.querySelector("#microDevices").classList.add("mic_open");
    } else {
      this.shadowRoot.querySelector("#microDevices").classList.remove("mic_open");
    }
  }

  mouseMoveDraggable(e) {
    // Computes the location of the mouse in the SVG canvas
    var loc = this.cursorPoint(e);
    // incremental mouse movement
    let dx = (e.clientX - this.oldMousePosX);
    let dy = (e.clientY - this.oldMousePosY);
    switch (this.currentState) {
      case "drawingNewJack":
        {
          let jackWeAreDragging = this.currentDraggableJack;
          let _pos = {
            x1: jackWeAreDragging.x1,
            y1: jackWeAreDragging.y1,
            x2: loc.x,
            y2: loc.y
          };
          jackWeAreDragging.reviewSVGJack(_pos);
        }
        break;
      case "draggingPedal":
        {
          // Test if you're clicking on a pedal or on it's component
          // --> have to check for sliders
          if (this.currentDraggablePedal !== undefined && this.currentDraggablePedal.classList.contains(
            'draggable')) {
            let p = this.currentDraggablePedal;
            p.move(p.beforeDragPosX + dx, p.beforeDragPosY + dy);
          }
        }
        break;
      case "draggingPedalboard":
        {
          this.move(dx, dy);
        }
        break;
    }
  }
  resizeListener() {
    let dx, dy;
    window.onresize = (e) => {
      // Hide menu if the window is resized
      //toggleMenuOff();

      // Repositions the pedal located on the right 
      // according to the new width

      /*
      let pdbW = parseInt(window.getComputedStyle(pdb).width, 10);
      let pdbH = parseInt(window.getComputedStyle(pdb).height, 10);
      this.pedals[1].move(pdbW, -20 + (pdbH / 2));
      */
      this.w = this.offsetWidth;
      this.h = this.offsetHeight;
      this.pOut.setPosition(this.w, (this.h / 2));

      // produit en croix
      this.pedals.forEach((p, i) => {
        if (i > 1) {
          dx = ((p.offsetLeft) * (this.w)) / (this.wO);
          dy = ((p.offsetTop) * (this.h)) / (this.hO);
          p.move(dx, dy);
        }
      });

      this.wO = this.w;
      this.hO = this.h;

      this.updateSVGcanvas(this.w, this.h);
    }
  }
  eventFire(el, etype) {
    if (el.fireEvent) {
      el.fireEvent('on' + etype);
    } else {
      var evObj = document.createEvent('Events');
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  }
  // drawloop method for clip meter canvas
  drawLoop() {
    this.canvasInputContext1.clearRect(0, 0, 100, 20);
    this.canvasInputContext2.clearRect(0, 0, 100, 20);
    this.canvasInputContext3.clearRect(0, 0, 100, 20);

    // check if we're currently clipping
    if (this.meter1.checkClipping())
      this.canvasInputContext1.fillStyle = "red";
    else
      this.canvasInputContext1.fillStyle = "green";


    if (this.meter2.checkClipping())
      this.canvasInputContext2.fillStyle = "red";
    else
      this.canvasInputContext2.fillStyle = "green";

    if (this.meter3.checkClipping())
      this.canvasInputContext3.fillStyle = "red";
    else
      this.canvasInputContext3.fillStyle = "green";


    // draw a bar based on the current volume
    this.canvasInputContext1.fillRect(0, 0, this.meter1.volume * 100 * 1.4, 20);
    this.canvasInputContext2.fillRect(0, 0, this.meter2.volume * 100 * 1.4, 20);
    this.canvasInputContext3.fillRect(0, 0, this.meter3.volume * 100 * 1.4, 20);

    // set up the next visual callback
    let rafID = window.requestAnimationFrame(this.drawLoop.bind(this));
  }

  dragPedalHandler(e) {
    console.log("dragPedalHandler");
    e.preventDefault();
    return false;
  }




  dropPedalHandler(e) {
    var liste
    console.log("dropPedalHandler");
    GlobalContext.context.resume();
    // Generate a unique id for the pedal, handle case for multiple instances of the same pedal
    let id = e.dataTransfer.getData("pedalId");
    console.log(id);
    var all = JSON.parse(this.shadowRoot.querySelector('wc-tabspedals').getAttribute('data-pedallist'));
    var target = {
      baseUrl: "",
      Thumbnail: "",
      classname: ""
    };
    console.log(`id = ${id}`);


    for (var cat in all) {
      if (all.hasOwnProperty(cat)) {
        const categories = all[cat];
        for (var content in categories.contents) {
          if (categories.contents.hasOwnProperty(content)) {
            if (id == categories.contents[content].id) {
              target.baseUrl = categories.contents[content].BaseUrl;
              console.log(target.baseUrl);
              target.Thumbnail = categories.contents[content].Thumbnail;
              target.classname = categories.contents[content].classname;
            }
          }
        }
      }
    }

    // check if plugin was already imported or not
    let isImported = document.querySelector(`script[src="${target.baseUrl}/main.js"]`);
    if (isImported) {
      console.log(isImported);

      // add pedal
      let p = document.createElement(id);
      p.setPosition(e.clientX - 30, event.clientY - 10);
      this.addPedal(p);
    } else {
      console.log('not imported - we create import dynamically');

      this.addImportLink(target.baseUrl, id, this, e, event, target);
    }

  }


  // from https://www.html5rocks.com/en/tutorials/webcomponents/imports/
  // A PLACER DANS LE ADD PEDAL : addImportLink => addPedal
  addImportLink(url, id, _this, _e, _event, target) {
    var script = document.createElement('script');
    script.src = url + `/main.js`;
    script.onload = (e) => {
      console.log('target.classname',target.classname);
      this.factory.createPedal(id, target.classname, url);
      let p = document.createElement(id);
      p.setPosition(_e.clientX - 30, _event.clientY - 10);
      _this.addPedal(p);
    };
    document.head.appendChild(script);
  }



  getTarget(id) {
    var liste;
    GlobalContext.context.resume();
    // Generate a unique id for the pedal, handle case for multiple instances of the same pedal
    var all = JSON.parse(this.shadowRoot.querySelector('wc-tabspedals').getAttribute('data-pedallist'));
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

  addImportLinkNEW(id, _this, _pos) {
    return new Promise((resolve, reject) => {

      let target = this.getTarget(id);
      console.log('TARGET',target);
      let isImported = document.querySelector(`script[src="${target.baseUrl}/main.js"]`);
      if (isImported) {
        console.log('ALREADY IMPORTED');

        // add pedal
        let p = document.createElement(id);
        p.setPosition(_pos.x, _pos.y);
        this.addPedal(p);
        resolve(true);
      } else {
        console.log('NOT IMPORTED');
        var script = document.createElement('script');
        script.src = target.baseUrl + `/main.js`;
        script.onload = (e) => {
          console.log('NOW WAS IMPORTED');

          this.factory.createPedal(id, target.classname, target.baseUrl);

          let p = document.createElement(id);
          p.setPosition(_pos.x, _pos.y);
          _this.addPedal(p);
          resolve(true);
        };
        document.head.appendChild(script);
      }
    })
  }



  /***** PART SOUND *****/
  addChangeAudioListeners() {
    // régler les gains entrée et sortie
    this.shadowRoot.querySelector("#knob_In").addEventListener('change', (e) => {
      this.shadowRoot.querySelector("#knob_In").title = "" + e.target.value;
      this.sound.gainNodeIn.gain.value = e.target.value;
      this.sound.gainNodeInMid.gain.value = e.target.value;
      this.shadowRoot.querySelector("#knob_In_midi").setValue(e.target.value)
    });

    this.shadowRoot.querySelector("#knob_Out").addEventListener('change', (e) => {
      this.shadowRoot.querySelector("#knob_Out").title = "" + e.target.value;
      this.sound.gainNodeOut.gain.value = e.target.value;
    });

    this.shadowRoot.querySelector("#knob_In_midi").addEventListener('change', (e) => {
      this.shadowRoot.querySelector("#knob_In_midi").title = "" + e.target.value;
      this.sound.gainNodeInMid.gain.value = e.target.value;
      this.sound.gainNodeIn.gain.value = e.target.value;
      this.shadowRoot.querySelector("#knob_In").setValue(e.target.value);
    });
  }

  soundHandler() {
    this.gc = GlobalContext;
    this.sound.context = this.gc.context;

    this.sound.gainNodeIn = this.sound.context.createGain();
    this.sound.gainNodeOut = this.sound.context.createGain();
    this.sound.gainNodeOut.gain.value = 0.25;
    this.sound.gainNodeInMid = this.sound.context.createGain();

    this.sound.mediaSource = this.sound.context.createMediaElementSource(this.soundSample);
    this.sound.audioDestination = this.sound.context.destination;

    //connexion (reste le midi à faire !)
    this.sound.mediaSource.connect(this.sound.gainNodeIn);
    this.sound.mediaSource.connect(this.sound.gainNodeInMid);

    //this.monoMediaSourceM.connect(this.sound.gainNodeIn);
    this.sound.gainNodeOut.connect(this.sound.audioDestination);
    //
    this.sound.gainNodeIn.connect(this.meter1);
    this.sound.gainNodeInMid.connect(this.meter3);
    // this.sound.mediaSource.connect(this.meter1);
    // this.sound.mediaSource.connect(this.meter3);

    //console.log(this.nbPedalsAdded);

    if (navigator.mediaDevices.getUserMedia) {
      var constraints = {
        audio: {
          echoCancellation: false,
          mozNoiseSuppression: false,
          mozAutoGainControl: false
        }
      };
      console.log("1 : navigator.mediaDevices", navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        window.stream = stream;
        this.sound.mediaSourceM = this.sound.context.createMediaStreamSource(stream);

        this.splitter = this.sound.context.createChannelSplitter(2);
        this.sound.mediaSourceM.connect(this.splitter);

        this.monoMediaSourceM = this.sound.context.createChannelMerger(2);

        //connexion monoMediaSourceM Midi
        this.sound.mediaSourceM.connect(this.sound.gainNodeInMid);
        //this.sound.gainNodeInMid.connect(this.splitter);
        this.splitter.connect(this.monoMediaSourceM, 0, 0);
        this.splitter.connect(this.monoMediaSourceM, 0, 1);
        //this.monoMediaSourceM.connect(GlobalContext.context.destination)
        this.splitter.connect(this.monoMediaSourceM, 1, 0);
        this.splitter.connect(this.monoMediaSourceM, 1, 1);
        this.monoMediaSourceM.connect(this.sound.gainNodeInMid);
      }).catch(function (err) {
        // handle the error
        console.log(err.name + ": " + err.message);
      });
    }


    // link to clip detector
    this.drawLoop();

    // CHANGE STATE MIC(1) -> DEMO SOUND (0)
    this.shadowRoot.querySelector("#mic").addEventListener("change", (e) => {
      GlobalContext.context.resume();
      // 1 : connected
      if (e.target.value) {
        console.log('audio input enabled');

        if (this.pedals[0].outputJacks.length != 0) {
          this.pedals[0].outputJacks.forEach((j) => {
            // this.sound.state goes back to 0 for the next disconnect
            this.sound.state = 0;
            this.soundNodeDisconnection(j.p1, j.p2);

            this.sound.state = 1;
            this.soundNodeConnection(j.p1, j.p2);
          })
        }
        this.monoMediaSourceM.connect(this.meter1);
        this.sound.state = 1;

        // 0 : disconnected
      } else {
        console.log('mic disabled');

        if (this.pedals[0].outputJacks.length != 0) {
          this.pedals[0].outputJacks.forEach((j) => {
            // this.sound.state goes back to 1 for the next disconnect
            this.sound.state = 1;
            this.soundNodeDisconnection(j.p1, j.p2);

            this.sound.state = 0;
            this.soundNodeConnection(j.p1, j.p2);
          })
        }
        this.sound.state = 0;
        this.sound.monoMediaSourceM.disconnect(this.meter1);
      }
    })

    var bt_learn = this.shadowRoot.querySelector("#bt_learn");
    var span_time = this.shadowRoot.querySelector("#span_time");
    let _tabVolume = [];
    let i = 4000;
    let _interval = null;
    let volumeMax = 0;
    // When you play for 4 seconds, the input gain is adjusted depending on the max measured value 
    bt_learn.addEventListener("click", (e) => {
      this.sound.gainNodeInMid.gain.value = 1;

      _tabVolume = [];
      i = 4000;
      _interval = setInterval(() => {
        _tabVolume.push(this.meter3.volume);
        i -= 100;
        if (i == 3000 || i == 2000 || i == 1000) span_time.textContent = (i / 1000) + "s";
        if (i == 0) {
          span_time.textContent = "4s";
          volumeMax = Math.max(..._tabVolume);

          this.sound.gainNodeInMid.gain.value = (1 / volumeMax) / 2.;
          this.sound.gainNodeIn.gain.value = this.sound.gainNodeInMid.gain.value;
          this.maxInputGain = this.sound.gainNodeInMid.gain.value;
          console.log("this.maxInputGain = " + this.maxInputGain);
          this.shadowRoot.querySelector("#knob_In_midi").max = 2 * this.maxInputGain;
          this.shadowRoot.querySelector("#knob_In_midi").setValue(this.maxInputGain, true);
          this.shadowRoot.querySelector("#knob_In").max = 2 * this.maxInputGain;
          this.shadowRoot.querySelector("#knob_In").setValue(this.maxInputGain, true);
          //console.log("changed max and value of this.shadowRoot.querySelector("#knob_In_midi to " + this.shadowRoot.querySelector("#knob_In_midi.max + " and " + this.shadowRoot.querySelector("#knob_In_midi.value);

          window.clearInterval(_interval);
        }
      }, 100);
    });
  }

  changeStreamAsInputInGraph(id) {
    if (window.stream) {
      window.stream.getTracks().forEach(function (track) {
        track.stop();
        console.log("changeStreamAsInputInGraph : stopped track");
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

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      this.sound.mediaSourceM = this.sound.context.createMediaStreamSource(stream);
      this.sound.mediaSourceM.connect(this.splitter);
      //alert("changed input stream in graph");
      window.stream = stream;
    });
  }
  // Michel BUFFA : somme comments would be welcomed here!
  soundNodeConnection(p1, p2) {
    if (p1.id == "pedalIn" && p2.id == "pedalOut") {
      if (this.sound.state == 0) {
        //this.sound.mediaSource.connect(this.sound.gainNodeIn);
        this.sound.gainNodeIn.connect(this.sound.gainNodeOut);
        this.sound.gainNodeOut.connect(this.meter2); // M.BUFFA

        //this.sound.gainNodeOut.connect(this.sound.audioDestination);
      } else {
        //this.monoMediaSourceM.connect(this.sound.gainNodeIn);
        this.sound.gainNodeInMid.connect(this.sound.gainNodeOut);
        this.sound.gainNodeOut.connect(this.meter2); // M.BUFFA

        //this.sound.gainNodeOut.connect(this.sound.audioDestination);
      }
    } else if (p1.id == "pedalIn") {
      if (this.sound.state == 0) {
        //this.sound.mediaSource.connect(this.sound.gainNodeIn);
        this.sound.gainNodeIn.connect(p2.soundNodeIn);
        // console.log(p2.elem.soundNodeIn);
        // console.log(p2.soundNodeIn);
      } else {
        //his.monoMediaSourceM.connect(this.sound.gainNodeIn);
        this.sound.gainNodeInMid.connect(p2.soundNodeIn);
      }
    } else if (p2.id == "pedalOut") {
      //console.log("p1.elem.soundNodeOut : ", p1.elem.soundNodeOut);
      //p1.soundNodeOut.connect(this.meter2);
      p1.soundNodeOut.connect(this.sound.gainNodeOut);
      this.sound.gainNodeOut.connect(this.meter2); // M.BUFFA
      //this.sound.gainNodeOut.connect(this.sound.audioDestination);
    } else {
      p1.soundNodeOut.connect(p2.soundNodeIn);
    }
  }

  soundNodeDisconnection(p1, p2) {
    if (p1.id == "pedalIn" && p2.id == "pedalOut") {
      if (this.sound.state == 0) {
        //this.sound.mediaSource.disconnect(this.sound.gainNodeIn);
        this.sound.gainNodeIn.disconnect(this.sound.gainNodeOut);
        //this.sound.gainNodeOut.disconnect(this.sound.audioDestination);
      } else {
        //this.sound.mediaSourceM.disconnect(this.sound.audioDestination);

        this.sound.gainNodeInMid.disconnect(this.sound.gainNodeOut);
        // this.monoMediaSourceM.disconnect(this.sound.gainNodeIn);
        // this.sound.gainNodeIn.disconnect(this.sound.gainNodeOut);
        // this.sound.gainNodeOut.disconnect(this.sound.audioDestination);
      }
    } else if (p1.id == "pedalIn") {
      if (this.sound.state == 0) {
        //this.sound.mediaSource.disconnect(this.sound.gainNodeIn);
        this.sound.gainNodeIn.disconnect(p2.soundNodeIn);
      } else {
        //this.sound.mediaSourceM.disconnect(p2.elem.soundNodeIn);
        //this.monoMediaSourceM.disconnect(this.sound.gainNodeIn);
        this.sound.gainNodeInMid.disconnect(p2.soundNodeIn);
      }
    } else if (p2.id == "pedalOut") {
      p1.soundNodeOut.disconnect(this.sound.gainNodeOut);
      //this.sound.gainNodeOut.disconnect(this.sound.audioDestination);
    } else {
      p1.soundNodeOut.disconnect(p2.soundNodeIn);
    }
  }
}
customElements.define(`pedal-board`, PedalBoard);



// })();