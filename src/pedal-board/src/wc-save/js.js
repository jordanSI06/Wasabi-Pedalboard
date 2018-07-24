( function ()
{

	/**
	 * This WC is about save/load presets
	 * the actual storage is the localstorage.
	 * the save system has a banks/presets/plugin/settings tree architecture
	 */
	const _currentDoc = document.currentScript.ownerDocument;

	customElements.define( 'wc-save', class extends HTMLElement
	{
		constructor()
		{
			super();
			this.pedalboard = document.querySelector( 'pedal-board' );
			this.params = {
				dataSave: this.getAttribute( 'dataSave' ) || null,
			}
			this.isAPresetSlected = false;
			this.bankSelected;
		}

		get is() { return this.nodeName.toLowerCase(); }

		// observedAttributes : Specify observed attributes so that attributeChangedCallback will work
		static get observedAttributes() { return ['data-save']; }

		// appelé lorsque l'un des attributs de l'élément personnalisé est ajouté, supprimé ou modifié.
		attributeChangedCallback( name, oldValue, newValue )
		{
			console.log( `Custom element ${this.is} attributes changed.` );
			try
			{
				console.log( `name: ${name}` );
				console.log( `oldValue:`, oldValue );
				console.log( `newValue:`, JSON.parse( newValue ) );
			}
			catch ( err )
			{
				console.log( err );
			}
		}

		adoptedCallback()
		{
			console.log( `Custom element ${this.is} moved to new page.` );
		}
		disconnectedCallback()
		{
			console.log( `Custom element ${this.is} removed from page.` );
		}

		// is called every time the element is inserted into the DOM. It is useful for running setup code, such as fetching resources or rendering.
		connectedCallback()
		{
			// console.log(`Custom element ${this.is} added to page.`);

			// Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
			const shadowRoot = this.attachShadow( { mode: `open` } );
			const template = _currentDoc.querySelector( `template` );
			const instance = template.content.cloneNode( true );
			shadowRoot.appendChild( instance );

			// Extract the attribute from our element.
			this.bt_loadPreset = this.shadowRoot.querySelector( '#bt_loadPreset' );
			this.div_dialog = this.shadowRoot.querySelector( '#div_dialog' );
			this.bt_saveBank = this.shadowRoot.querySelector( '#bt_saveBank' );
			this.bt_savePreset = this.shadowRoot.querySelector( '#bt_savePreset' );
			this.input_presetName = this.shadowRoot.querySelector( '#input_presetName' );
			this.nav_banks = this.shadowRoot.querySelector( '#nav_banks' );
			this.nav_presets = this.shadowRoot.querySelector( '#nav_presets' );
			this.img_screenshot = this.shadowRoot.querySelector( '#img_screenshot' );

			this.bankSelected = '';
			this.plugsConnexions = '';

			let dontWaitTheAPI = true;
			if ( localStorage.getItem( 'banks' ) )
				this.banks = JSON.parse( localStorage.getItem( 'banks' ) );
			else
			{
				if( !this.isUserConnected() )
					this.banks = [];
				else
				{
					dontWaitTheAPI = false;
					this.getBanksFromAPI().then(
						(banks) =>
						{
							this.banks = JSON.parse(banks);
							this.renderBanks();
							this.listeners();
						},
						(error) => alert(error)
					);
				}
			}

			if(dontWaitTheAPI)
			{
				this.renderBanks();
				this.listeners();
			}
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

		async getBanksFromAPI()
		{
			return new Promise( (resolve, reject) =>
			{
				let xmlhttp = new XMLHttpRequest();

				xmlhttp.onreadystatechange = () =>
				{
					if ( xmlhttp.readyState == XMLHttpRequest.DONE )
					{
						if ( xmlhttp.status == 200 ) resolve( xmlhttp.responseText )
						else reject( xmlhttp.responseText);
					}
				}

				xmlhttp.open( "GET", 'http://localhost:5001/api/bank/', true );
				xmlhttp.setRequestHeader("Authorization", `Bearer ${localStorage.getItem('token')}`);
				xmlhttp.setRequestHeader( "Content-Type", "application/json");
				xmlhttp.send();
			});
		}

		/**
		 * @description Remove fileds like '_id' and 'date' to send to the API
		 *
		 * @returns {JSON} JSON Ready for the API
		 */
		formatBanksForAPIUpdate()
		{
			let bankCopy = this.banks;

			bankCopy.forEach( bank =>
			{
				if(bank._id)
					delete bank._id;

				bank.presets.forEach( preset =>
				{
					this.formatPresetForAPIUpdate(preset);
				});
			});

			return bankCopy;
		}

		/**
		 * @description Remove fileds like '_id' and 'date' to send to the API
		 *
		 * @param {preset} preset The preset from which we want the parsing
		 * @returns {JSON} JSON Ready for the API
		 */
		formatPresetForAPIUpdate(preset)
		{
			if(preset._id)
				delete preset._id;

			return preset;
		}

		/**
		 * First step : load and render the bank stage
		 */
		renderBanks()
		{
			this.shadowRoot.querySelector('#nav_banks').innerHTML = '';

			this.banks.forEach( bank =>
			{
				if(!bank.pedalBoardID)
					bank.pedalBoardID = this.generateRandomPedalBoardID();

				this.nav_banks.insertAdjacentHTML( 'beforeEnd', this.renderLink( bank.label, ( bank.pedalBoardID ) ) );
			} );

			this.selectBanksListeners();
		}

		renderPresetsOfBank(pedalBoardID) // TODO after saving a preset it's not put in his bank directly, fix it
		{
			this.nav_presets.innerHTML = '';

			this.banks.forEach( bank =>
			{
				if( bank.pedalBoardID == pedalBoardID)
				{
					if(bank.presets != null)
					{
						bank.presets.forEach( preset =>
						{
							if ( !preset.pedalBoardID )
								preset.pedalBoardID = this.generateRandomPedalBoardID();

							this.nav_presets.insertAdjacentHTML( 'beforeEnd', this.renderLink( preset.label, preset.pedalBoardID ) );
						});
					}
				}
			});

			this.selectPresetsListeners();
		}

		deleteElement(id) //TODO
		{
			console.log('you have to delete ', id);
		}

		/**
		 * Listeners for the different elements
		 * TODO: add LOAD button
		 */
		listeners()
		{
			this.bt_loadPreset.onclick = ( ) =>
			{
				if ( this.isAPresetSlected ) this.loadPreset();
				else alert( "Select a preset first" );
			}

			this.bt_saveBank.onclick = ( ) => this.addNewBank();

			this.bt_savePreset.onclick = ( ) =>
			{
				if ( this.bankSelected )
				{
					if ( this.isAPresetSlected || this.input_presetName.value ) this.savePreset( );
					else alert( "Tape name of choose a preset to overwrite" )
				}
				else
				{
					alert('First off all you have to click a bank or create one')
				}
			}
		}

		renderLink( name, id )
		{
			//console.log('screenshot', _json.screenshot);
			// <img src="${_json.screenshot}" width=200>
			return `<a href='#' id='${id}' value='${name}'>${name}</a>`;
		}

		loadPreset()
		{
			let bankSelected = this.banks.find( item => item._id == this.bankSelected );
			this.plugs = bankSelected.presets.find( item => item._id == this.presetSelected ).plugs;
			this.plugsConnexions = bankSelected.presets.find( item => item._id == this.presetSelected ).connexions;
			//console.log('LOADING',bankSelected.presets.find(item => item._id == this.presetSelected));
			//console.log(`START: LOAD PRESET ${this.bankSelected} > ${this.presetSelected}`, this.plugs);

			this.nbPluginTraitee = 0;
			this.loadNewPlugin( this.plugs[0] );
		}

		loadNewPlugin( p )
		{
			console.log( p );
			this.pedalboard.loadPlugin( p ).then( plugin =>
			{
				console.log( '----- !!!! PLUGIN LOADED !!!!! -----', plugin );
				console.log( 'NEXT : -----{{{{ this.nbPluginTraitee----- }}}}}', this.nbPluginTraitee );
				this.nbPluginTraitee += 1;
				if ( this.nbPluginTraitee < this.plugs.length ) this.loadNewPlugin( this.plugs[this.nbPluginTraitee] );

				else { this.loadConnexions(); }
			} )
		}

		async loadConnexions()
		{
			console.log( `-------------- loadConnexions (${this.plugsConnexions.length}) --------------` );
			for ( let i = 0; i < this.plugsConnexions.length; i++ )
			{
				let tabId = []; console.log( this.plugsConnexions[i].in );
				console.log( this.pedalboard.pedals[this.pedalboard.pedals.length - 1].id );
				for ( let i = 0; i < this.pedalboard.pedals.length; i++ )
				{
					tabId.push( this.pedalboard.pedals[i].id );
				}
				if ( this.plugsConnexions[i].out == 'pedalIn2' ) this.pedalboard.changetomono();
				this.pedalboard.connect( this.pedalboard.querySelector( `#${this.plugsConnexions[i].out}` ), this.pedalboard.querySelector( `#${this.plugsConnexions[i].in.id}` ), this.plugsConnexions[i].in.inputnumber );

			}
			for ( let i = 0; i < this.plugs.length; i++ )
			{
				console.log( this.plugs[i] );
				this.pedalboard.querySelector( `#${this.plugs[i].id}` ).setAttribute( 'params', JSON.stringify( this.plugs[i].settings ) );
			}
		}

		selectBanksListeners()
		{
			this.nav_banks.querySelectorAll( 'a' ).forEach( e =>
			{
				e.onclick = ( e ) => this.selectBank( e.target.id );
			} )
		}

		selectBank( _id )
		{
			this.nav_banks.querySelectorAll( 'a' ).forEach( e =>
			{
				if ( e.id == _id )
				{
					e.classList.add( 'a_selected' );
					this.setBankSelected(e.id);
					this.renderPresetsOfBank(_id);
				}
				else
				{
					e.classList.remove( 'a_selected' );
				}
			} )
		}

		setBankSelected(id)
		{
			this.bankSelected = this.banks.find( bank => bank.pedalBoardID == id);
		}

		setPresetSelected(id)
		{
			if(this.bankSelected)
				this.presetSelected = this.bankSelected.presets.find( preset => preset.pedalBoardID == id);
			else
				console.log('No bank selected')
		}

		selectPresetsListeners()
		{
			this.nav_presets.querySelectorAll( 'a' ).forEach( e =>
			{
				e.onclick = ( e ) => this.selectPreset( e.target.id );
				e.ondblclick = ( e ) => this.loadPreset();
			} )
		}

		selectPreset( _id )
		{
			this.nav_presets.querySelectorAll( 'a' ).forEach( e =>
			{
				if ( e.id == _id )
				{
					this.isAPresetSlected = true;
					e.classList.add( 'a_selected' );
					this.setPresetSelected(e.id);
					this.input_presetName.value = e.getAttribute( 'value' );
				} else
				{
					e.classList.remove( 'a_selected' );
				}
			} )
		}

		saveBank()
		{
			localStorage.setItem( 'banks', JSON.stringify( this.banks ) );
			console.log( JSON.parse( localStorage.getItem( 'banks' ) ) );
		}

		clearBanks()
		{
			localStorage.clear();
		}

		addNewBank()
		{
			let _bankName = prompt( "Bank name", "" );
			if ( _bankName == null || _bankName == "" )
			{
				console.log( 'nothing to save!' );
			} else
			{
				_bankName = _bankName.trim();

				let _newBank = {
					"_id": `${Date.now()}`,
					"label": `${_bankName}`,
					"presets": [],
					"pedalBoardID" : this.generateRandomPedalBoardID()
				}
				this.banks.push( _newBank );
				this.saveBank();
				this.renderBanks();
			}
		}

		generateRandomPedalBoardID( length )
		{
			length = length != null ? length : 25;

			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for ( var i = 0; i < length; i++ )
					text += possible.charAt( Math.floor( Math.random() * possible.length ) );

			return text;
		}

		// create preset name
		async savePreset() //TODO règler le problem de sauvegarde de preset
		{
			//this.takeScreenshot();
			//this.takeScreenshot().then(_screenshot=>{
			//  console.log('_screenshot',_screenshot);
			let _presetName = this.input_presetName.value.trim();

			let _currentPlugs = [];
			let _currentConnexions = this.pedalboard.pluginConnected;

			let _plugin = '';
			let _plugsToSave = {};
			let _settings = [];

			let self = this;

			(async function jsonifyPlugins(self)
			{
				for ( let i = 0; i < self.pedalboard.pedals.length; i++ )
				{
					_plugin = self.pedalboard.pedals[i];
					_settings = [];
					if ( _plugin.id != "pedalIn1" && _plugin.id != "pedalIn2" && _plugin.id != "pedalOut" )
					{

						// Await from the plugin to return its state so save the preset
						await _plugin.node.getState().then( ( params ) =>
						{
							_settings = params;
						} );
						_plugsToSave = {
							id: _plugin.id,
							type: _plugin.tagName.toLowerCase(),
							position: {
								x: _plugin.x,
								y: _plugin.y
							},
							settings: _settings
						}
						_currentPlugs.push( _plugsToSave );
					}
				}
			})(self);

			if ( !this.bankSelected.presets.find( item => item.label == _presetName ) )
			{
				(function createNewPreset(self)
				{
					let _newPreset = {
						"_id": `${Date.now()}`,
						"label": `${_presetName}`,
						"date": `${new Date().toJSON().slice( 0, 10 )}`,
						"plugs": _currentPlugs,
						"connexions": _currentConnexions,
						//"screenshot":_screenshot
					}
					self.bankSelected.presets.push( _newPreset );
				})(self);
			}
			else
			{
				//console.log('preset exist', bankSelected.presets.find(item => item.label == _presetName));
				// Not every plugin have an "params" getter, you need to try catch when using it
				(function addPluginsAndConnexionToPreset(self)
				{
					self.presetSelected.plugs = _currentPlugs;
					self.presetSelected.presets = _currentConnexions;
					// bankSelected.presets.find(item => item._id == this.presetSelected).screenshot = _screenshot;
				})(self);
			}

			this.saveBank();
			this.renderPresetsOfBank();
			alert( 'Preset was successfully saved!' );
			console.log( "preset saved!!!", this.banks );
		}

		isUserConnected()
		{ return localStorage.getItem("token") != null; }

	} );
} )();