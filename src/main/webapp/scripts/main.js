//funktio lomaketietojen muuttamiseksi JSON-stringiksi
function serialize_form(form){
	return JSON.stringify(
	    Array.from(new FormData(form).entries())
	        .reduce((m, [ key, value ]) => Object.assign(m, { [key]: value }), {})
	        );	
} 

function haeAsiakkaat() {
	let url = "asiakkaat?hakusana=" + document.getElementById("hakusana").value; //kutsutaan END POINTia Asiakkaat.java rivi 21
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
	console.log(respObjList);
	let htmlStr="";
	for(let item of respObjList) { //yksi kokoelmaloopeista. item saa arvoksi sen mitä response Object List tuottaa
		htmlStr+="<tr id='rivi_"+item.asiakas_id+"'>"; //ensimmäinen rivi saa id:en, jonka arvo on item.asiakas_id
		htmlStr+="<td>"+item.etunimi+"</td>"; //sen jälkeen siellä on sarakkeet rekno, merkki, malli, vuosi
		htmlStr+="<td>"+item.sukunimi+"</td>";
		htmlStr+="<td>"+item.puhelin+"</td>";
		htmlStr+="<td>"+item.sposti+"</td>";
		htmlStr+="<td><span class='poista' onclick=varmistaPoisto("+item.asiakas_id+",'"+encodeURI(item.etunimi)+"')>Poista</span></td>"; //encodeURI() muutetaan erikoismerkit, välilyönnit jne. UTF-8 merkeiksi.
		//htmlStr+="<td>&nbsp;</td>";//tyhjä sarake
		htmlStr+="</tr>";
	}
	document.getElementById("tbody").innerHTML = htmlStr; //sen jälkeen, kun loopissa on käyty läpi koko htmlStr-stringi, kirjoitetaan se tbodyyn
}
//Tutkitaan lisättävät tiedot ennen niiden lähettämistä backendiin
function tutkiJaLisaa(){
	if(tutkiTiedot()){//käynnistetään tutkiTiedot() . sama kuin tutkiTiedot()==true
		lisaaTiedot(); //ja jos tiedot ovat kelvolliisia ne lähetetään
	}
}

//funktio syöttötietojen tarkistamista varten (yksinkertainen)
function tutkiTiedot(){
	let ilmo="";	

	if(document.getElementById("etunimi").value.length<1){ //jos etunimi arvo on lyhyempi kuin 3
		ilmo="Etunimi ei kelpaa!";	
		document.getElementById("etunimi").focus();	
	}else if(document.getElementById("sukunimi").value.length<1){
		ilmo="Sukunimi ei kelpaa!";
		document.getElementById("sukunimi").focus();			
	}else if(document.getElementById("puhelin").value.length<3){
		ilmo="Puhelin ei kelpaa!";	
		document.getElementById("puhelin").focus();	
	}else if(document.getElementById("sposti").value.length<3){
		ilmo="Sposti ei kelpaa!";	
		document.getElementById("sposti").focus();	
	}
	if(ilmo!=""){
		document.getElementById("ilmo").innerHTML=ilmo;
		setTimeout(function(){ document.getElementById("ilmo").innerHTML=""; }, 3000);
		return false;
	}else{
		document.getElementById("etunimi").value=siivoa(document.getElementById("etunimi").value);
		document.getElementById("sukunimi").value=siivoa(document.getElementById("sukunimi").value);
		document.getElementById("puhelin").value=siivoa(document.getElementById("puhelin").value);
		document.getElementById("sposti").value=siivoa(document.getElementById("sposti").value);	
		return true;
	}
}

//Funktio XSS-hyökkäysten estämiseksi (Cross-site scripting)
function siivoa(teksti){
	teksti=teksti.replace(/</g, "");//&lt;
	teksti=teksti.replace(/>/g, "");//&gt;	
	teksti=teksti.replace(/'/g, "''");//&apos;	
	return teksti;
}

//funktio tietojen lisäämistä varten. Kutsutaan backin POST-metodia ja välitetään kutsun mukana auton tiedot json-stringinä.
function lisaaTiedot(){
	let formData = serialize_form(document.lomake); //Haetaan tiedot lomakkeelta ja muutetaan JSON-stringiksi
	//console.log(formData);
	let url = "asiakkaat";    
    let requestOptions = {
        method: "POST", //Lisätään asiakas
        headers: { "Content-Type": "application/json" },  
    	body: formData
    };    
    fetch(url, requestOptions)
    .then(response => response.json())//Muutetaan vastausteksti JSON-objektiksi
   	.then(responseObj => {	
   		//console.log(responseObj);
   		if(responseObj.response==0){
   			document.getElementById("ilmo").innerHTML = "Asiakkaan lisäys epäonnistui.";	
        }else if(responseObj.response==1){ 
        	document.getElementById("ilmo").innerHTML = "Asiakkaan lisäys onnistui.";
			document.lomake.reset(); //Tyhjennetään asiakkaan lisäämisen lomake		        	
		}
		setTimeout(function(){ document.getElementById("ilmo").innerHTML=""; }, 3000);
   	})
   	.catch(errorText => console.error("Fetch failed: " + errorText));
}


function varmistaPoisto(asiakas_id, etunimi){
	if(confirm("Poista asiakas " + decodeURI(etunimi) +"?")){ //decodeURI() muutetaan enkoodatut merkit takaisin normaaliksi kirjoitukseksi
		poistaAsiakas(asiakas_id, encodeURI(etunimi));
	}
}


//Poistetaan asiakas kutsumalla backin DELETE-metodia ja välittämällä sille poistettavan asiakkaan asiakas_id
function poistaAsiakas(asiakas_id, etunimi){
		let url = "asiakkaat?asiakas_id=" + asiakas_id;    
    let requestOptions = {
        method: "DELETE"
       
        };    
    fetch(url, requestOptions) 
    .then(response => response.json())//Muutetaan vastausteksti JSON-objektiksi
   	.then(responseObj => {	
   		//console.log(responseObj);
   		if(responseObj.response==0){
			alert("Asiakkaan poisto epäonnistui.");	        	
        }else if(responseObj.response==1){ 
			document.getElementById("rivi_"+asiakas_id).style.backgroundColor="red";
			alert("Asiakkaan " + decodeURI(etunimi) +" poisto onnistui."); // muutetaan enkoodatut merkit takaisin normaaliksi kirjoitukseksi, tuplanimen tulostus oli: Asiakkaan Anna%20Liisa poisto onnistui.
			haeAsiakkaat();        	
		}
   	})
   	.catch(errorText => console.error("Fetch failed: " + errorText));
}	