function haeAsiakkaat() {
	let url = "asiakkaat?hakusana=" + document.getElementById("hakusana").value; //end pointi jonka kutsutaan
	let requestOptions = {
			method: "GET", //get-metodin kutsu
			headers: { "Content_Type": "application/x-www-form-urlencoded" }
	};
	fetch(url, requestOptions) //then-tarkoittaa että odotetaan niin kauan kunnes saadaan vastaus
	.then(response => response.json()) //saatu JSON-stringi muutetaan vastausteksi JSON-objektiksi, =>-tämä on nuolinotaatio
	//.then(response => document.getElementById("ilmo").innerHTML=response)
	.then(response => printItems(response)) //kutsuu printItems-funktiota ja välitää response-tulokset
	.then(response => console.log(response)) //JSON-objekti ajetaan konsolilla
	.catch(errorText => console.error("Fetch failed: " + errorText)); //jos tulee jotain vikaa, niin virhetulostus
}
//Kirjoitetaan tiedot taulukkoon JSON-objektilistasta
function printItems(respObjList){
	//console.log(respObjList);
	let htmlStr="";
	for(let item of respObjList) { //yksi kokoelmaloopeista. item saa arvoksi sen mitä response Object List tuottaa
		htmlStr+="<tr id='rivi_"+item.asiakas_id+"'>"; //ensimmäinen rivi saa id:en, jonka arvo on item.id
		htmlStr+="<td>"+item.etunimi+"</td>"; //sen jälkeen siellä on sarakkeet rekno, merkki, malli, vuosi
		htmlStr+="<td>"+item.sukunimi+"</td>";
		htmlStr+="<td>"+item.puhelin+"</td>";
		htmlStr+="<td>"+item.sposti+"</td>";
		htmlStr+="</tr>";
	}
	document.getElementById("tbody").innerHTML = htmlStr; //sen jälkeen, kun loopissa on käyty läpi koko htmlStr-stringi, kirjoitetaan se tbodyyn
}