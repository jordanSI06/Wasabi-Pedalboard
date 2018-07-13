( function ()
{

	// Current document needs to be defined to get DOM access to imported HTML
	const _currentDoc = document.currentScript.ownerDocument;

	// Register the x-custom element with the browser
	customElements.define( 'wc-login', class extends HTMLElement
	{

		// ----- METHODS: DEFAULT -----
		// is called when an instance of the element is created
		constructor()
		{
			// Toujours appeler "super" d'abord dans le constructeur
			super();

		}

		get is() { return this.nodeName.toLowerCase(); }

		// observedAttributes : Specify observed attributes so that attributeChangedCallback will work
		static get observedAttributes() { return ['']; }

		// appelé lorsque l'un des attributs de l'élément personnalisé est ajouté, supprimé ou modifié.
		attributeChangedCallback()
		{
			console.log( `Custom element ${this.is} attributes changed.` );
		}

		// appelé lorsque l'élément personnalisé est déplacé vers un nouveau document
		adoptedCallback()
		{
			console.log( `Custom element ${this.is} moved to new page.` );
		}

		// appelé lorsque l'élément personnalisé est déconnecté du DOM du document
		disconnectedCallback()
		{
			console.log( `Custom element ${this.is} removed from page.` );
		}

		// is called every time the element is inserted into the DOM. It is useful for running setup code, such as fetching resources or rendering.
		// appelé lorsque l'élément personnalisé est connecté pour la première fois au DOM du document
		connectedCallback()
		{
			//console.log(`Custom element ${this.is} added to page.`);

			// Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
			const shadowRoot = this.attachShadow( { mode: `open` } );
			const template = _currentDoc.querySelector( `template` );
			const instance = template.content.cloneNode( true );
			shadowRoot.appendChild( instance );

			this.listenLocalAuth();
			this.googleConnexion();
			this.githubConnexion();
		}

		listenLocalAuth()
		{
			this.shadowRoot.querySelector('#submitLogin').addEventListener( "click", () =>
			{
				let mail = this.shadowRoot.querySelector('#mail').value;
				let password = this.shadowRoot.querySelector('#password').value;

				let request = `http://localhost:5001/api/auth/local?mail=${mail}&password=${password}`;

				let xmlhttp = new XMLHttpRequest();

				xmlhttp.onreadystatechange = () =>
				{
					if(xmlhttp.readyState == XMLHttpRequest.DONE)
					{
						if(xmlhttp.status == 200)
						{
							localStorage.setItem('token', xmlhttp.responseText);
							this.shadowRoot.querySelector( '#container' ).classList.toggle( 'hidden' );
						}
						else
						{
							this.shadowRoot.querySelector('#password').style.color = 'red';
							this.shadowRoot.querySelector('#mail').style.color = 'red';
							this.shadowRoot.querySelector('#submitLogin').style.color = 'red';

							this.shadowRoot.querySelector( '#info' ).style.visibility = 'visible';
							this.shadowRoot.querySelector('#info').innerHTML = xmlhttp.responseText;
						}
					}
				}

				xmlhttp.open("GET", request, true);
				xmlhttp.send();
			});
		}

		googleConnexion()
		{

		}

		githubConnexion()
		{
			this.shadowRoot.querySelector( '#google' ).addEventListener( "click", () =>
			{

			} );
		}
	} );
} )();