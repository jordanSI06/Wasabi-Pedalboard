(function() {
  // Current document needs to be defined to get DOM access to imported HTML
  const _currentDoc = document.currentScript.ownerDocument;

  // Register the x-custom element with the browser
  customElements.define(
    "wc-audio",
    class extends HTMLElement {
      // ----- METHODS: DEFAULT -----
      // is called when an instance of the element is created
      constructor() {
        super();

        const _urlAudio = {
          cat1: {
            label: "Metal riff 1",
            path: "Guitar_DI_Track.mp3"
          },
          cat2: {
            label: "Metal riff 2",
            path: "LasseMagoDI.mp3"
          },
          cat3: {
            label: "Cool Rythm",
            path: "Di-Guitar.mp3"
          },
          cat4: {
            label: "Trash metal",
            path: "NarcosynthesisDI.mp3"
          },
          cat5: {
            label: "Black Sabbath Rythm",
            path: "BlackSabbathNIB_rythmDI.mp3"
          },
          cat6: {
            label: "Black Sabbath Solo",
            path: "BlackSabbathNIBLead_DI.mp3"
          },
          cat7: {
            label: "Basketcase Riff",
            path: "BasketCase Greenday riff DI.mp3"
          },
          cat8: {
            label: "In Bloom riff",
            path: "InBloomNirvanaRiff1DI.mp3"
          },
          cat9: {
            label: "Muse solo",
            path: "Muse1Solo.mp3"
          },
          cat10: {
            label: "Muse rythm",
            path: "Muse2Rythm.mp3"
          },
          cat11: {
            label: "----",
            path: "11"
          },
          cat12: {
            label: "Blues riff",
            path: "RawPRI.mp3"
          },
          cat13: {
            label: "Blues solo 1",
            path: "GuitarSolo1_DI.mp3"
          },
          cat14: {
            label: "Blues solo 2",
            path: "GuitarSolo2_DI.mp3"
          },
          cat15: {
            label: "Folk Acoustic 1",
            path: "FolkAcousticDI.mp3"
          },
          cat16: {
            label: "Folk Acoustic 2",
            path: "3F_DI_guitar.wav"
          },
          cat17: {
            label: "Guitar Riff 1",
            path: "DIGuitarRIFF.mp3"
          },
          cat18: {
            label: "Guitar Riff 2",
            path: "CleanGuitarRiff.mp3"
          }
        };

        this.params = {
          urlAudio: this.getAttribute("urlAudio") || _urlAudio
        };
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
        const template = _currentDoc.querySelector(`#wcaudioTemplate`);
        const instance = template.content.cloneNode(true);
        shadowRoot.appendChild(instance);

        // Extract the attribute from our element.
        const urlAudio = this.params.urlAudio;

        // Fetch the data from the API and call the render method
        Object.keys(urlAudio).map((el, index) => {
          this.render(urlAudio[el]);
        });
        this.shadowRoot
          .querySelector("#soundSample")
          .setAttribute("src", "./audio/BasketCase Greenday riff DI.mp3");

        // customListeners
        this.listeners();
      }

      // ----- METHODS: CUSTOM -----
      render(_data) {
        this.shadowRoot
          .querySelector("#select_audio")
          .insertAdjacentHTML(
            "beforeEnd",
            `<option value='./audio/${_data.path}'>${_data.label}</option>`
          );
      }

      listeners() {
        const soundSample = this.shadowRoot.querySelector("#soundSample");
        this.shadowRoot.querySelector("#select_audio").onchange = e => {
          if (e.target.value === "---------------") {
          } else if (e.target.value === "UPLOAD") {
            this.shadowRoot.querySelector("#input-file").fireEvent("onchange");
          } else {
            soundSample.crossOrigin = "anonymous";
            soundSample.src = e.target.value;
            soundSample.load();
            soundSample.play();
            soundSample.onplay = function(e) {
              GlobalContext.context.resume();
            };
          }
        };

        let filename = "",
          extension = "";
        this.shadowRoot.querySelector("#input-file").onchange = e => {
          filename = e.currentTarget.files[0].name;
          extension = filename.split(".").pop();

          if (extension === "mid") {
            // var reader = new FileReader();
            // reader.onload = (e) => {
            //   soundSample.src =(reader.result);
            // }
            // reader.readAsArrayBuffer(e.currentTarget.files[0]);
          } else {
            // no midi file
            soundSample.src = URL.createObjectURL(e.currentTarget.files[0]);
            soundSample.load();
            soundSample.play();
            soundSample.onplay = function(e) {
              GlobalContext.context.resume();
            };
          }
        };
      }
    }
  );
})();
