/**INPUT OUTPUT
 * toiminnalliset funktiot
 */
 function haeAsiakkaat() {
	let url = "asiakkaat?hakusana=" + document.getElementById("hakusana").value; //kutsutaan END POINTia Asiakkaat.java rivi 21
	let requestOptions = {
			method: "GET", //get-metodin kutsu
			//headers: { "Content-Type": "application/json; charset=UTF-8" },
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
		htmlStr+="<td><a href='muutaasiakas.jsp?id="+item.asiakas_id+"'>Muuta</a>&nbsp;";
		htmlStr+="<span class='poista' onclick=varmistaPoisto("+item.asiakas_id+",'"+encodeURI(item.etunimi + " " + item.sukunimi)+"')>Poista</span></td>"; //etu- ja sukunimen enkoodaus
	//	htmlStr+="<td><span class='poista' onclick=varmistaPoisto("+item.asiakas_id+",'"+encodeURI(item.etunimi)+"')>Poista</span></td>"; //encodeURI() muutetaan erikoismerkit, välilyönnit jne. UTF-8 merkeiksi.
		//htmlStr+="<td>&nbsp;</td>";//tyhjä sarake
		htmlStr+="</tr>";
	}
	document.getElementById("tbody").innerHTML = htmlStr; //sen jälkeen, kun loopissa on käyty läpi koko htmlStr-stringi, kirjoitetaan se tbodyyn
}

//funktio tietojen lisäämistä varten. Kutsutaan backin POST-metodia ja välitetään kutsun mukana auton tiedot json-stringinä.
function lisaaTiedot(){
	let formData = serialize_form(document.lomake); //Haetaan tiedot lomakkeelta ja muutetaan JSON-stringiksi
	//formData=encodeURI(formData);
	console.log(formData);
	let url = "asiakkaat";    
    let requestOptions = {
        method: "POST", //Lisätään asiakas
        headers: { "Content-Type": "application/json; charset=UTF-8" },  //määritellään mitä lähetetään ja millä encodauksella (charset=UTF-8), jotta skandit kulkisi oikein
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


//Poistetaan asiakas kutsumalla backin DELETE-metodia ja välittämällä sille poistettavan asiakkaan asiakas_id
function poistaAsiakas(asiakas_id, nimi){//etunimi){
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
			alert("Asiakkaan " + decodeURI(nimi) +" poisto onnistui.");
			//alert("Asiakkaan " + decodeURI(etunimi) +" poisto onnistui."); // muutetaan enkoodatut merkit takaisin normaaliksi kirjoitukseksi, tuplanimen tulostus oli: Asiakkaan Anna%20Liisa poisto onnistui.
			haeAsiakkaat();        	
		}
   	})
   	.catch(errorText => console.error("Fetch failed: " + errorText));
}	


//Haetaan muutettavan asiakkaan tiedot. Kutsutaan backin GET-metodia ja välitetään kutsun mukana muutettavan tiedon id
function haeAsiakas() {		
    let url = "asiakkaat?asiakas_id=" + requestURLParam("id"); //requestURLParam() on funktio, jolla voidaan hakea urlista arvo avaimen perusteella. Löytyy main.js -tiedostosta 	
	console.log(url);
    let requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/x-www-form-urlencoded" }       
    };    
    fetch(url, requestOptions)
    .then(response => response.json())//Muutetaan vastausteksti JSON-objektiksi
   	.then(response => {
   		console.log(response);
   		document.getElementById("asiakas_id").value=response.asiakas_id;
   		document.getElementById("etunimi").value=response.etunimi;
   		document.getElementById("sukunimi").value=response.sukunimi;
   		document.getElementById("puhelin").value=response.puhelin;
   		document.getElementById("sposti").value=response.sposti;
   	}) 
   	.catch(errorText => console.error("Fetch failed: " + errorText));
}

//funktio tietojen päivittämistä varten. Kutsutaan backin POST-metodia ja välitetään kutsun mukana auton tiedot json-stringinä.
function paivitaTiedot(){
	let formData = serialize_form(document.lomake); //Haetaan tiedot lomakkeelta ja muutetaan JSON-stringiksi
	//console.log(formData);
	let url = "asiakkaat";    
    let requestOptions = {
        method: "PUT", //Muutetaan asiakas
        headers: { "Content-Type": "application/json; charset=UTF-8" },  
    	body: formData
    };    
    fetch(url, requestOptions)
    .then(response => response.json())//Muutetaan vastausteksti JSON-objektiksi
   	.then(responseObj => {	
   		//console.log(responseObj);
   		if(responseObj.response==0){
   			document.getElementById("ilmo").innerHTML = "Asiakkaan muutos epäonnistui.";	
        }else if(responseObj.response==1){ 
        	document.getElementById("ilmo").innerHTML = "Asiakkaan muutos onnistui.";
			document.lomake.reset(); //Tyhjennetään asiakkaan muutoksen lomake		        	
		}
		setTimeout(function(){ document.getElementById("ilmo").innerHTML=""; }, 3000);
   	})
   	.catch(errorText => console.error("Fetch failed: " + errorText));
}
