(function() {
  // Current document needs to be defined to get DOM access to imported HTML
  const _currentDoc = document.currentScript.ownerDocument;

  // Register the x-custom element with the browser
  customElements.define(
    "wc-multitrack",
    class extends HTMLElement {
      // ----- METHODS: DEFAULT -----
      // is called when an instance of the element is created
      constructor() {
        super();

        // Global Context of Pedalboard
        this.ac = GlobalContext.context;

        // Graph node creation
        this.input = this.ac.createGain();
        this.input.gain.value = 1;
        this.output = this.ac.createGain();

        // Graphic Element
        this.playButton;
        this.stopButton;
        this.loopButton;
        this.dlButton;
        this.titleTrack;
        this.volumeRange;
        this.canvas;
        this.addButton;
        this.deleteButton;

        // Icon buttons element
        this.buttonPlayImg;
        this.buttonStopImg;
        this.buttonLoopImg;
        this.buttonMuteImg;
        this.buttonDlImg;

        // Element state
        this.statePlay = false;
        this.statePause = false;
        this.stateMute = false;
        this.stateLoop = false;
        this.stateNewBar = true;
        this.stateTimeSelector = false;
        this.countStateRecord = false;
        this.statePlayOnRec = false;

        // Element value
        this.volume = 0.5;
        this.trackId = 0;
        this.trackHTML;
        this.trackEntity = [];
        this.maxNumberOfTrack = 6;

        // Start/Pause manager time
        this.startedAt;
        this.pausedAt;
        this.timeEllapsed;
        this.endSelector;
        this.startSelector;

        // File element
        this.blob;
        this.sample;
        this.recordedBlobs = [];
        this.fileReader;
        this.arrayBuffer;
        this.bufferSourceNode;
        this.data;
        this.channelData;
        this.url;
        this.link;
        this.fileName = "Untitled track";
        this.main;

        // Mouse coordination
        this.xcor;
      }

      getInput() {
        return this.input;
      }

      getOutput() {
        return this.output;
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
        //console.log(`Custom element ${this.is} added to page.`);

        // Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
        const shadowRoot = this.attachShadow({ mode: `open` });
        const template = _currentDoc.querySelector(`#templlateMultitrack`);
        const instance = template.content.cloneNode(true);
        shadowRoot.appendChild(instance);

        //Extract attribute from parents
        let parent = this;

        // Buttons assigned with query selector
        this.titleTrack = this.shadowRoot.querySelector("#title");
        this.stopButton = this.shadowRoot.querySelector("#stop");
        this.playButton = this.shadowRoot.querySelector("#play");
        this.muteButton = this.shadowRoot.querySelector("#mute");
        this.loopButton = this.shadowRoot.querySelector("#loop");
        this.dlButton = this.shadowRoot.querySelector("#download");
        this.addButton = this.shadowRoot.querySelector("#addTrack");
        this.deleteButton = this.shadowRoot.querySelector("#delete");
        this.playOnRecButton = this.shadowRoot.querySelector("#playOnRec");

        // Buttons icons assigned with query selector
        this.buttonStopImg = this.shadowRoot.querySelector("#btn_stop_img");
        this.buttonPlayImg = this.shadowRoot.querySelector("#btn_play_img");
        this.buttonLoopImg = this.shadowRoot.querySelector("#btn_loop_img");
        this.buttonMuteImg = this.shadowRoot.querySelector("#btn_mute_img");
        this.buttonDlImg = this.shadowRoot.querySelector("#btn_dl_img");
        this.playOnRecImg = this.shadowRoot.querySelector("#btn_playOnRec_img");

        // Volume range slider assigned with query selector
        this.volumeRange = this.shadowRoot.querySelector("#volume");

        // Canvas assigned with query selector
        this.canvas = this.shadowRoot.querySelector("canvas");
        navigator.mediaDevices
          .getUserMedia({
            audio: true
          })
          .then(function(stream) {
            parent.shadowRoot.onload = parent.stockTrack();
            parent.stopButton.addEventListener(
              "click",
              parent.setStopTrack.bind(parent)
            );
            parent.volumeRange.addEventListener(
              "input",
              parent.changeVolume.bind(parent)
            );
            parent.playButton.addEventListener(
              "click",
              parent.setPlayTrack.bind(parent)
            );
            parent.loopButton.addEventListener(
              "click",
              parent.setLoopTrack.bind(parent)
            );
            parent.addButton.addEventListener(
              "click",
              parent.addTrack.bind(parent)
            );
            parent.addButton.addEventListener(
              "mouseover",
              parent.addTrackButtonOver.bind(parent)
            );
            parent.addButton.addEventListener(
              "mouseout",
              parent.addTrackButtonOut.bind(parent)
            );
            parent.deleteButton.addEventListener(
              "click",
              parent.deleteTrackFromArray.bind(parent)
            );
            parent.playOnRecButton.addEventListener(
              "click",
              parent.togglePlayOnRec.bind(parent)
            );
          });
      }

      // ************ CUSTOM METHOD ***************

      getMouseX(e) {
        this.xcor = e.clientX;
      }

      //TODO: put addtrack method on css
      addTrackButtonOver() {
        this.addButton.setAttribute("style", "background-color: #888");
      }

      //TODO: put addtrack method on css
      addTrackButtonOut() {
        this.addButton.setAttribute("style", "background-color: #333");
      }

      // ----- Method of the menu -----
      stockTrack() {
        this.trackHTML = this.shadowRoot.querySelector("#onetrack0");
        this.shadowRoot.querySelector("#onetrack0").remove();
      }

      togglePlayOnRec() {
        if (!this.statePlayOnRec) {
          this.playOnRecImg.setAttribute("icon", "icons:radio-button-checked");
          this.playOnRecImg.setAttribute("style", "fill:red");
        } else {
          this.playOnRecImg.setAttribute(
            "icon",
            "icons:radio-button-unchecked"
          );
          this.playOnRecImg.setAttribute("style", "fill:white");
        }
        this.statePlayOnRec = !this.statePlayOnRec;
      }

      setPlayTrack() {
        // graphical updates. Call playingTrack from track.js
        if (this.buttonPlayImg.icon == "av:play-circle-filled")
          this.statePlay = false; //what?????
        for (let i = 0; i < this.trackEntity.length; i++) {
          this.trackEntity[i].playingTrack();
        }
        if (this.statePlay == false) {
          this.buttonPlayImg.setAttribute("icon", "av:pause");
          let time = Date.now();
          for (let i = 0; i < this.trackEntity.length; i++) {
            this.trackEntity[i].stockCurrentTime = time;
            this.trackEntity[i].raf = window.requestAnimationFrame(() =>
              this.trackEntity[i].draw(
                this.trackEntity[i].canvasBar.getContext("2d")
              )
            );
          }
        } else {
          this.buttonPlayImg.setAttribute("icon", "av:play-circle-filled");
          for (let i = 0; i < this.trackEntity.length; i++) {
            window.cancelAnimationFrame(this.trackEntity[i].raf);
          }
          for (let i = 0; i < this.trackEntity.length; i++) {
            this.trackEntity[i].playBarDisplay.oldx = this.trackEntity[
              i
            ].playBarDisplay.x;
          }
        }
        this.statePlay = !this.statePlay;
      }

      setStopTrack() {
        // set stop for every existing  tracks.
        for (let i = 0; i < this.trackEntity.length; i++) {
          this.trackEntity[i].stopTrack();
        }
        // grahpical update of play button.
        this.buttonPlayImg.setAttribute("icon", "av:play-circle-filled");
        this.statePlay = false;
      }

      setLoopTrack() {
        // toggle stateLoop of every existing tracks.
        if (this.stateLoop == false) {
          for (let i = 0; i < this.trackEntity.length; i++) {
            this.trackEntity[i].loopTrack();
            this.trackEntity[i].stateLoop = true;
          }
          this.buttonLoopImg.setAttribute(
            "style",
            "fill : rgb(191, 255, 194);"
          );
        } else if (this.stateLoop == true) {
          for (let i = 0; i < this.trackEntity.length; i++) {
            this.trackEntity[i].loopTrack();
            this.trackEntity[i].stateLoop = false;
          }
          this.buttonLoopImg.setAttribute("style", "fill : white;");
        }
        this.stateLoop = !this.stateLoop;
      }

      changeVolume(e) {
        this.volume = e.target.value / 100;
        for (let i = 0; i < this.trackEntity.length; i++) {
          if (this.trackEntity[i].bufferSourceNode) {
            if (!this.trackEntity[i].stateMute) {
              this.output.gain.value = this.volume;
            }
          }
        }
      }

      // ----- Method of the creation of track -----

      createDiv() {
        this.main = this.shadowRoot.querySelector("#main");
        //The div will be created in the shadow-root
        let div = document.createElement("div");
        div.setAttribute("id", "trackN" + this.trackId);
        this.main.appendChild(div);
      }

      addTrack() {
        if (
          this.shadowRoot.querySelectorAll("[id^=trackN]").length <
          this.maxNumberOfTrack
        ) {
          //Create the div HTML element
          this.createDiv();
          //Select the div to clone the HTML content
          this.main = this.shadowRoot.querySelector("#trackN" + this.trackId);
          //Create the track object
          let track = new Track(
            this.trackId,
            this.trackHTML,
            this.stateLoop,
            1
          );
          //Push the track in array
          this.trackEntity.push(track);
          // this.checkVolumeMax();
          //console.log(this.trackEntity);
          //Clone the div template
          let track_clone = this.trackEntity[
            this.trackEntity.length - 1
          ].getTrackHTML.cloneNode(true);
          //Create the content inside the div
          this.main.appendChild(track_clone);
          //Call the listeners of the track
          track.callListeners();
          this.eventListenerUpdate("#trackN" + this.trackId);
          this.input.connect(
            this.trackEntity[this.trackEntity.length - 1].getInput()
          );
          this.trackEntity[this.trackEntity.length - 1]
            .getOutput()
            .connect(this.output);
          this.trackId++;
        } else {
          console.warn("Too much tracks buddy! You need premium.");
        }
      }

      // we're using event listener for the new DOM created. This is  the way we communicate between tracks and multitrack global functionnalities.

      eventListenerUpdate(dom) {
        let btnDelete = this.shadowRoot.querySelector(dom + " #delete");
        let btnRecord = this.shadowRoot.querySelector(dom + " #record");
        let canvas = this.shadowRoot.querySelector(dom + " #selector");
        btnDelete.addEventListener(
          "click",
          this.deleteTrackFromArray.bind(this, btnDelete)
        );
        btnRecord.addEventListener(
          "blur",
          this.regulateTime.bind(this, btnRecord)
        );
        btnRecord.addEventListener(
          "mousedown",
          this.playFromBegin.bind(this, btnRecord)
        );
        canvas.addEventListener("mousedown", this.getMouseX.bind(this));
        canvas.addEventListener(
          "mousedown",
          this.timeSelector.bind(this, canvas)
        );
        canvas.addEventListener(
          "mouseup",
          this.changeTarget.bind(this, canvas)
        );
      }

      // this method help at the end of a record to stop the sound and set up at the begining.
      playFromBegin() {
        if (this.statePlayOnRec) {
          this.togglePlayOnRec();
          this.setStopTrack();
          this.setPlayTrack();
        }
      }

      // we can get the div parent of a DOM element.
      getDivParent(dom) {
        let divSearch = dom.parentNode.id;
        dom = dom.parentNode;
        divSearch = divSearch.slice(0, 6);
        while (divSearch != "trackN") {
          divSearch = dom.parentNode.id;
          dom = dom.parentNode;
          divSearch = divSearch.slice(0, 6);
        }
        return dom;
      }

      deleteTrackFromArray(dom) {
        let element = this.getDivParent(dom);
        for (let i = 0; i < this.trackEntity.length; i++) {
          if (element == this.trackEntity[i].shadowRoot) {
            // we stop every tracks
            this.trackEntity[i].stopSample();
            this.input.disconnect(this.trackEntity[i].getInput());
            this.trackEntity[i].getOutput().disconnect(this.output);
            this.trackEntity.splice(i, 1);
          }
        }
        this.checkMaxTime();
      }

      //To regulate the length of each track depending of the track with the longest song
      regulateTime() {
        this.countStateRecord = false;
        // check max time return the greatest duration between every buffer.
        let time = this.checkMaxTime();
        //console.log(time);
        let addtime = 0;
        for (let i = 0; i < this.trackEntity.length; i++) {
          if (this.trackEntity[i].stateRecord) {
            this.countStateRecord = true;
          }
        }
        for (let i = 0; i < this.trackEntity.length; i++) {
          this.trackEntity[i].canvasBar
            .getContext("2d")
            .clearRect(0, 0, 2000, 100);
          if (this.trackEntity[i].bufferSourceNode) {
            if (this.countStateRecord == false) {
              // the new time calculated is the difference between the local variable time and the buffersourcenode duration.
              addtime =
                time - this.trackEntity[i].bufferSourceNode.buffer.duration;
              if (addtime > 0) {
                // we update addTime of every tracks. This variable will be used inside addEmptyAudio method.
                this.trackEntity[i].addTime = addtime;
                // we're calling addEmptyAudio from track.js
                this.trackEntity[i].addEmptyAudio();
              }
              this.setStopTrack();
            }
          }
        }
      }

      //Check which track has the longest song
      checkMaxTime() {
        // we setup trackDurationMax to 0.
        let trackDurationMax = 0;
        // we just check which track has the longuest duration.
        for (let i = 0; i < this.trackEntity.length; i++) {
          if (
            this.trackEntity[i].bufferSourceNode &&
            !this.trackEntity[i].stateRecord
          ) {
            trackDurationMax = Math.max(
              this.trackEntity[i].bufferSourceNode.buffer.duration,
              trackDurationMax
            );
          }
        }
        //console.log(this.terackDurationMax);
        return trackDurationMax;
      }

      timeSelector(e) {
        // e refers to mousedown here.
        for (let i = 0; i < this.trackEntity.length; i++) {
          if (this.trackEntity[i].bufferSourceNode) {
            // this xcor refer to x coordinate of mouse.
            this.trackEntity[i].renderBar(this.xcor);
          }
        }
        this.setPartitionSelector();
      }

      // TO DO
      // this feature alloow us to select an area. We can see on console relative position of the begining and ending of the area selected. Press mous and release it wherever you want.

      setPartitionSelector() {
        this.stateTimeSelector = false;
        // a localState. If it is true, it will work. We're setting up an event listener on document. So the user can select an area even if the mouse is outside of the track.
        // however, this localstate is important. It will not select an area if you had not mouseodown on the track first.
        let localstate = true;
        // event linked do document
        document.onmousemove = event => {
          if (localstate) {
            // stateTimeSelector will be used in the future to determined new features inside record, play, etc.
            this.stateTimeSelector = true;
            for (let i = 0; i < this.trackEntity.length; i++) {
              // event.clientX to update the aread
              this.trackEntity[i].partitionSelector(event.clientX);
            }
          }
        };
        document.onmouseup = event => {
          if (localstate) {
            localstate = false;
            for (let i = 0; i < this.trackEntity.length; i++) {
              if (this.trackEntity[i].bufferSourceNode) {
                // 2000 represent the width of each canvas. We divide these values by 2000 to get relative positions of elements.
                this.endSelector = this.trackEntity[i].endSelector / 2000;
                this.startSelector = this.trackEntity[i].startSelector / 2000;
                if (this.endSelector > 1) this.endSelector = 1;
                if (this.startSelector < 0) this.startSelector = 0;
                // if there is at least one bufferSourceNode, we break.
                break;
              }
            }
            // check console when you select an area. I multiply each value by 10000 and divide it by 100 to round it as XX.YY% just to make it readable.
            console.log(
              "begining at: " +
                Math.floor(this.startSelector * 10000) / 100 +
                " %"
            );
            console.log(
              "end at: " + Math.floor(this.endSelector * 10000) / 100 + " %"
            );
            for (let i = 0; i < this.trackEntity.length; i++) {
              this.trackEntity[i].stateSelector = this.stateTimeSelector;
            }
          }
        };
      }
      // change target allow us to use spacebar to play pause if we change the position of music.
      changeTarget() {
        for (let i = 0; i < this.trackEntity.length; i++) {
          if (this.trackEntity[i].keepPlaying) {
            this.setPlayTrack();
            break;
          }
        }
        this.playButton.focus();
      }
    }
  );
})();
