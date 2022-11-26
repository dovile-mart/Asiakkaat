package control;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import model.Asiakas;

import model.dao.Dao;

/**
 * Servlet implementation class Asiakkaat
 */ // asiakkaat - sillä tullaan koodissa kutsumaan tätä servlettiä
@WebServlet("/asiakkaat/*") // servletin End point, *-palvelee kaikkia kutsuja, jotka tulee asiakkaat
							// kansioon
public class Asiakkaat extends HttpServlet {
	private static final long serialVersionUID = 1L;

	// kun servletti on kutsuttu se ajaa Asiakkaat() -konstruktoria joka tulostaa
	// konsoliin Asiakkaat.Asiakkaat()
	public Asiakkaat() {
		System.out.println("Asiakkaat.Asiakkaat()");
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		System.out.println("Asiakkaat.doGet()");
		String hakusana = request.getParameter("hakusana"); // hakusanan haku main.js:sta
		System.out.println(hakusana);// hakusanan tulostus konsoliin
		Dao dao = new Dao(); // kutsutaan kaikki asiakkaat tieotkannasta
		ArrayList<Asiakas> asiakkaat = dao.getAllItems(); // dao palauttaa kaikki asiakkaat arraylistissa
		// System.out.println(asiakas);
		// String strJSON = new Gson().toJson(asiakas); //asiakkaat -arraylistin
		// muuttaaminen json-tyypiseksi/stringiksi
		// System.out.println(strJSON); //json-stringin tulostus konsolille
		// selaimeen
		String strJSON = "";
		if (hakusana != null) {// Jos kutsun mukana tuli hakusana
			if (!hakusana.equals("")) {// Jos hakusana ei ole tyhjä
				asiakkaat = dao.getAllItems(hakusana); // Haetaan kaikki hakusanan mukaiset asiakkaat. Eli kutsutaan
														// Dao.java:sta parametrillista rivit 94-104
			} else {
				asiakkaat = dao.getAllItems(); // Haetaan kaikki asiakkaat Dao.jafa:sta parametritonta, rivit 64-82
			}
			strJSON = new Gson().toJson(asiakkaat);
		}
		response.setContentType("application/json; charset=UTF-8"); // määrittely se mitä tullaan kirjoittamaan on
																	// json-tyypinen
		PrintWriter out = response.getWriter(); // tehdään PrintWriter jonka nimi on out ja käsketään kirjoittamaan
												// seuraavan rivin
		out.println(strJSON); // tulostus apin rajapintaan (selaimelle raw data-muodossa)
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		System.out.println("Asiakkaat.doPost()");

		// Luetaan JSON-tiedot POST-pyynnön bodysta ja luodaan niiden perusteella uusi
		// asiakas
		String strJSONInput = request.getReader().lines().collect(Collectors.joining());
		// System.out.println(strJSONInput);
		Asiakas asiakas = new Gson().fromJson(strJSONInput, Asiakas.class);
		// System.out.println(asiakas);
		Dao dao = new Dao();
		response.setContentType("application/json; charset=UTF-8");
		PrintWriter out = response.getWriter();
		if (dao.addItem(asiakas)) { // asiakas == true
			out.println("{\"response\":1}"); // Asiakkaan lisääminen onnistui {"response":1}
		} else { // asiakas == false
			out.println("{\"response\":0}"); // Asiakkaan lisääminen epäonnistui {"response":0}
		}
	}

	protected void doPut(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		System.out.println("Asiakkaat.doPut()");
	}

	protected void doDelete(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		System.out.println("Asiakkaat.doDelete()");
		int asiakas_id=Integer.parseInt(request.getParameter("asiakas_id"));
		//int asiakas_id=Integer.parseInt(request.getParameter("asiakas_id")); //frontista tulleen doDelete kutsun yhteydessä välitetty asiakas_id - request.getParameter("asiakas_id")
											//sen muutetaan numeraaliseksi int id:ksi, koska kaikki mikä requestin kautta tulee ovat merkkijonoja
		Dao dao = new Dao();
		response.setContentType("application/json; charset=UTF-8");
		
		PrintWriter out = response.getWriter();
		if (dao.removeItem(asiakas_id)) { // asiakas == true
			out.println("{\"response\":1}"); // Asiakkaan poistaminen onnistui {"response":1}
		} else { // asiakas == false
			out.println("{\"response\":0}"); // Asiakkaan poistaminen epäonnistui {"response":0}
		}
	}

}
