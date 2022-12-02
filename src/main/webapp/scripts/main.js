//apufunktiot
//funktio lomaketietojen muuttamiseksi JSON-stringiksi
function serialize_form(form){
	return JSON.stringify(
	    Array.from(new FormData(form).entries())
	        .reduce((m, [ key, value ]) => Object.assign(m, { [key]: value }), {})
	        );	
} 

//funktio arvon lukemiseen urlista avaimen perusteella
function requestURLParam(sParam){
    let sPageURL = window.location.search.substring(1);
    let sURLVariables = sPageURL.split("&");
    for (let i = 0; i < sURLVariables.length; i++){
        let sParameterName = sURLVariables[i].split("=");
        if(sParameterName[0] == sParam){
            return sParameterName[1];
        }
    }
}


//Tutkitaan lisättävät tiedot ennen niiden lähettämistä backendiin
function tutkiJaLisaa(){
	if(tutkiTiedot()){//käynnistetään tutkiTiedot() . sama kuin tutkiTiedot()==true
		lisaaTiedot(); //ja jos tiedot ovat kelvolliisia ne lähetetään
	}
}

//Tutkitaan päivitettävät tiedot ennen niiden lähettämistä backendiin
function tutkiJaPaivita(){
	if(tutkiTiedot()){//käynnistetään tutkiTiedot() . sama kuin tutkiTiedot()==true
		paivitaTiedot(); //ja jos tiedot ovat kelvolliisia ne lähetetään paivitaTiedot()-funktioon paivitettavaksi
	}
}


//funktio syöttötietojen tarkistamista varten (yksinkertainen)
function tutkiTiedot(){
	let ilmo="";	

	if(document.getElementById("etunimi").value.length<1){ //jos etunimi arvo on lyhyempi kuin 1
		ilmo="Etunimi ei kelpaa!";	
		document.getElementById("etunimi").focus();	
	}else if(document.getElementById("sukunimi").value.length<1){
		ilmo="Sukunimi ei kelpaa!";
		document.getElementById("sukunimi").focus();			
	}else if(document.getElementById("puhelin").value.length<3){
		ilmo="Puhelin ei kelpaa!";	
		document.getElementById("puhelin").focus();	
	}else if(document.getElementById("sposti").value.length<8||document.getElementById("sposti").value.indexOf(".")==-1||document.getElementById("sposti").value.indexOf("@")==-1){ //sposti pitää olla vähintään 8-merkkinen, sisältää pisteen ja @. Jos ei löydy . tai @ - se palauttaa -1
	//}else if(document.getElementById("sposti").value.length<3){
		ilmo="Sposti ei kelpaa!";	
		document.getElementById("sposti").focus();	
	}
	if(ilmo!=""){ //jos ilmo ei ole tyhjä annetaan virheilmoitus
		document.getElementById("ilmo").innerHTML=ilmo;
		setTimeout(function(){ document.getElementById("ilmo").innerHTML=""; }, 3000);
		return false;
	}else{	//jos virheilmoituksia ei ole siivotaan
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
	teksti=teksti.replace(/;/g, "''");//&#59; puolipisteen esto, sql lausetta ei voi katketa		
	teksti=teksti.replace(/'/g, "''");//&apos;	
	return teksti;
}



/*function varmistaPoisto(asiakas_id, etunimi){
	if(confirm("Poista asiakas " + decodeURI(etunimi) +"?")){ //decodeURI() muutetaan enkoodatut merkit takaisin normaaliksi kirjoitukseksi
		poistaAsiakas(asiakas_id, etunimi);//encodeURI(etunimi));
	}
}
*/
function varmistaPoisto(asiakas_id, nimi){ //nimi on etu- ja sukunimi, jotka olivat enkoodatu function printItems(respObjList)-rivillä32
	if(confirm("Poista asiakas " + decodeURI(nimi) +"?")){ //decodeURI() muutetaan enkoodatut merkit takaisin normaaliksi kirjoitukseksi
		poistaAsiakas(asiakas_id, nimi);//encodeURI(nimi)); //ei tarvitse enkoodata nimeä, koska se on tehty jo rivi32, kun yhdistetään etu- ja sukunimet nimeksi
	}
}

function asetaFocus(target){
	document.getElementById(target).focus();	
}


//Funktio Enter-nappiin. Kutsu bodyn onkeydown()-metodista.
function tutkiKey(event, target){	
	console.log(event.keyCode);
	if(event.keyCode==13){//13=Enter
		if(target=="listaa"){
			haeAsiakkaat();
		}else if(target=="lisaa"){
			tutkiJaLisaa();
		}else if(target=="paivita"){
			tutkiJaPaivita();
		}
	}else if(event.keyCode==113){//F2
		document.location="listaaasiakkaat.jsp";
	}		
}	