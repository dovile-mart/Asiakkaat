<%@include file="header.jsp" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<link rel="stylesheet" type="text/css" href="css/main.css">
<script src="scripts/main.js"></script>
<script src="scripts/io.js"></script>
<title>Asiakashaku</title>
</head>
<body onload="asetaFocus('hakusana')" onkeydown="tutkiKey(event, 'listaa')">
	<table id="listaus">
		<thead>
				<tr>
			<th><a id="linkki" href="login?logout=1">Kirjaudu ulos (<%out.print(session.getAttribute("kayttaja"));%>)</a></th>
			<th colspan="5" class="oikealle"><a id="linkki" href="lisaaasiakas.jsp">Lisää uusi asiakas</a></th>
		
			</tr>
			
			<tr>
				<th>Hakusana:</th>
				<th colspan="3"><input type="text" id="hakusana"></th>
				<th><input type="button" value="Hae" id="hakunappi"
					onclick="haeAsiakkaat()"></th>
			</tr>
			<!-- table head - jossa on yksi rivi ja viisi saraketa -->
			<tr>
				<th>Etunimi</th>
				<th>Sukunimi</th>
				<th>Puhelin</th>
				<th>Sposti</th>
				<th></th>
			</tr>
		</thead>
		<tbody id="tbody">
			<!-- table body - tulee loopi -->
		</tbody>
	</table>
	<span id="ilmo"></span>
	<script>
		haeAsiakkaat();
	</script>
</body>
</html>