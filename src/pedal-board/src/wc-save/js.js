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
			this.bt_saveLoad = this.shadowRoot.querySelector( '#bt_saveLoad' );
			this.bt_saveBank = this.shadowRoot.querySelector( '#bt_saveBank' );
			this.bt_savePreset = this.shadowRoot.querySelector( '#bt_savePreset' );
			this.input_presetName = this.shadowRoot.querySelector( '#input_presetName' );
			this.nav_banks = this.shadowRoot.querySelector( '#nav_banks' );
			this.nav_presets = this.shadowRoot.querySelector( '#nav_presets' );
			this.img_screenshot = this.shadowRoot.querySelector( '#img_screenshot' );

			this.bankSelected = '';
			this.plugsConnexions = '';

			if ( localStorage.getItem( 'banks' ) )
				this.banks = JSON.parse( localStorage.getItem( 'banks' ) );
			else
			{
				if( localStorage.getItem('token') == null )
				{
					this.banks = [];
					this.renderBanks();
					this.listeners();
				}
				else
				{
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
		}

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
				xmlhttp.send();
			});
		}

		/**
		 * First step : load and render the bank stage
		 */
		renderBanks()
		{
			this.banks.forEach( bank =>
			{
				this.nav_banks.insertAdjacentHTML( 'beforeEnd', this.renderLink( bank.label, ( bank._id ) ) );
			} );

			this.selectBanksListeners();
		}

		renderPresetsOfBank(bankID)
		{
			this.nav_presets.innerHTML = '';

			this.banks.forEach( bank =>
			{
				if( bank._id == bankID)
				{
					if(bank.presets != null)
					{
						bank.presets.forEach( preset =>
						{
							this.nav_presets.insertAdjacentHTML( 'beforeEnd', this.renderLink( preset.label, preset._id ) );
						});
					}
				}
			});

			this.selectPresetsListeners();
		}

		/**
		 * Listeners for the different elements
		 * TODO: add LOAD button
		 */
		listeners()
		{
			// Load presets only if a preset is selected
			this.bt_loadPreset.onclick = ( e ) =>
			{
				if ( this.isAPresetSlected ) this.loadPreset();
				else alert( "Select a preset first" );
			}

			this.bt_saveLoad.onclick = ( e ) =>
			{
				if ( !this.pedalboard.shadowRoot.querySelector( "#divAudioPlayer" ).classList.contains( "hidden" ) ) this.pedalboard.shadowRoot.querySelector( '#divAudioPlayer' ).classList.toggle( 'hidden' );
				if ( !this.pedalboard.shadowRoot.querySelector( "#divSoundIn" ).classList.contains( "hidden" ) ) this.pedalboard.shadowRoot.querySelector( '#divSoundIn' ).classList.toggle( 'hidden' );
				this.openDialog();
			};
			this.bt_saveBank.onclick = ( e ) => this.addNewBank();

			// save presets only if a bank is selected and (a name written or a preset selected)
			this.bt_savePreset.onclick = ( e ) =>
			{
				if ( this.bankSelected )
				{
					if ( this.isAPresetSlected || this.input_presetName.value ) this.savePreset();
					else alert( "Tape name or choose a preset to overwrite" )
				}
				else
				{
					alert("First you need to select a bank");
				}
			}
		}

		openDialog()
		{
			this.div_dialog.classList.toggle( 'hidden' );
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
			console.log( "plugconnexions", this.plugsConnexions );

			this.nbPluginTraitee = 0;

			console.log( this.plugs )
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
					this.bankSelected = e.id;
					this.renderPresetsOfBank(_id);
				}
				else
				{
					e.classList.remove( 'a_selected' );
				}
			} )
		}

		selectPresetsListeners()
		{
			this.nav_presets.querySelectorAll( 'a' ).forEach( e =>
			{
				//console.log('a', e);
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
					this.presetSelected = e.id;
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
					"_id": `${Date.now()}_bank`,
					"label": `${_bankName}`,
					"date": `${new Date().toJSON().slice( 0, 10 )}`,
					"presets": []
				}
				this.banks.push( _newBank );
				this.saveBank();
				this.renderBanks();
			}
		}

		// create preset name
		async savePreset()
		{
			//this.takeScreenshot();
			//this.takeScreenshot().then(_screenshot=>{
			//  console.log('_screenshot',_screenshot);

			let _presetName = this.input_presetName.value.trim();
			let bankSelected = this.banks.find( item => item._id == this.bankSelected );

			let _currentPlugs = [];
			let _currentConnexions = this.pedalboard.pluginConnected;
			console.log( 'currentConnexions', _currentConnexions ); // OK pour le gainnode

			let _plugin = '';
			let _plugsToSave = {};
			let _settings = [];

			await retrievePlugins();

			if ( !doesThePresetAlreadyExists() )
				addNewPreset();
			else
			{
				bankSelected.presets.find( item => item._id == this.presetSelected ).plugs = _currentPlugs;
				bankSelected.presets.find( item => item._id == this.presetSelected ).connexions = _currentConnexions;
				// bankSelected.presets.find(item => item._id == this.presetSelected).screenshot = _screenshot;
			}

			this.saveBank();
			this.renderPresetsOfBank();
			alert( 'Preset was successfully saved!' );
			console.log( "preset saved!!!", this.banks );

			//})

			///////////////////////////////////////////////////////////////////////////

			async function retrievePlugins()
			{
				for ( let i = 0; i < this.pedalboard.pedals.length; i++ )
				{
					_plugin = this.pedalboard.pedals[i];
					_settings = [];

					if ( _plugin.id != "pedalIn1" && _plugin.id != "pedalIn2" && _plugin.id != "pedalOut" )
					{

						// Await from the plugin to return its state so save the preset
						await _plugin.node.getState().then( ( params ) =>
						{
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
							_currentPlugs.push( _plugsToSave );
						} );
					}
				}
			}

			function doesThePresetAlreadyExists()
			{ return Boolean( bankSelected.presets.find( item => item.label == _presetName)) }

			function addNewPreset()
			{
				let _newPreset =
				{
					"label": `${_presetName}`,
					"date": `${new Date().toJSON().slice( 0, 10 )}`,
					"plugs": _currentPlugs,
					"connexions": _currentConnexions,
					//"screenshot":_screenshot
				}
				bankSelected.presets.push( _newPreset );
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

	} );
} )();