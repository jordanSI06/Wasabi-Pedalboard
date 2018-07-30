window.onload=()=>
{
	/*   console.log('page loded');
	let ul_container=document.querySelector('#ul_container');
	ul_container.style.width=(document.body.getBoundingClientRect().width*2)+"px";
	console.log("width",ul_container.style.width);

	let li_1=document.querySelector('#li_1');
	let li_2=document.querySelector('#li_2');
	li_1.style.width=(document.body.getBoundingClientRect().width)+"px";
	li_2.style.width=(document.body.getBoundingClientRect().width)+"px";

	let _translate=(li_1.getBoundingClientRect().width);
	let header = li_1.querySelector("pedal-board").shadowRoot.querySelector("#div_app").querySelector("header").querySelector("#header_settings").querySelector(".div_settings");
	let bt_seq=header.querySelector('#bt_seq');
	let bt_ped=header.querySelector('#bt_ped'); */

	// bt_seq.onclick=()=>{
	//   ul_container.style.transform="translateX("+-_translate+"px)";
	// };


	// bt_ped.onclick=()=>{
	//   ul_container.style.transform="translateX("+0+"px)";
	// }


	(function storeToken()
	{
		var params = {};

		if ( location.search )
		{
			var parts = location.search.substring( 1 ).split( '&' );

			for ( var i = 0; i < parts.length; i++ )
			{
				var nv = parts[i].split( '=' );
				if ( !nv[0] ) continue;
				params[nv[0]] = nv[1] || true;
			}
		}

		if(params.token != undefined)
		{
			localStorage.setItem('token', params.token);
			hideURLParams();
		}
	})()

	function hideURLParams()
	{ history.replaceState( {}, null, window.location.pathname ) } //https://goo.gl/FKn52T
}

// Before user leaves the page
window.onunload = async () =>
{
	if( localStorage.getItem('token'))
	{
		await document.querySelector( '#pedalboard' ).shadowRoot.querySelector( '#div_app' ).querySelector( '#header_settings' ).querySelector( '.div_settings' ).querySelector( 'wc-save' ).saveBanksAndPreset().then(
			( resolve ) =>
			{
				localStorage.removeItem( 'banks' );
			},
			( reject ) =>
			{
				let banks = JSON.stringify( document.querySelector( '#pedalboard' ).shadowRoot.querySelector( '#div_app' ).querySelector( '#header_settings' ).querySelector( '.div_settings' ).querySelector( 'wc-save' ).banks );

				if ( banks ) localStorage.setItem( 'banks', banks );

				if ( reject == 'JWT' )
					confirm( `Your session has expired, you need to login again.` )
				else
					confirm( `An unexpected error occured happened while trying to save your banks : \n${reject}\n` );
			}
		);
	}
	else
	{
		let banks = JSON.stringify( document.querySelector( '#pedalboard' ).shadowRoot.querySelector( '#div_app' ).querySelector( '#header_settings' ).querySelector( '.div_settings' ).querySelector( 'wc-save' ).banks );

		if ( banks ) localStorage.setItem( 'banks', banks );
	}
}