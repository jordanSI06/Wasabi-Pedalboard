window.onload=()=>{
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
			window.location.replace( 'http://127.0.0.1:8886/'); // Refresh to a clean url without the token in
		}
	})()
}