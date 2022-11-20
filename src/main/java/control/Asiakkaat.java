package control;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

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
 */
@WebServlet("/asiakkaat/*") //servletin End point, *-palvelee kaikkia kutsuja, jotka tulee asiakkaat kansioon
public class Asiakkaat extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public Asiakkaat() {
        System.out.println("Asiakkaat.Asiakkaat()");
    }

	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("Asiakkaat.doGet()");
		String hakusana = request.getParameter("hakusana"); //hakusanan haku
		System.out.println(hakusana);//hakusanan tulostus konsoliin
		Dao dao = new Dao();
		ArrayList<Asiakas> asiakkaat = dao.getAllItems();
		//System.out.println(asiakas);
		//String strJSON = new Gson().toJson(asiakas); //muokkaaminen json-tyypiseksi
		//System.out.println(strJSON); //json-stringin tulostus konsolille
		//selaimeen
		String strJSON="";		
		if(hakusana!=null) {//Jos kutsun mukana tuli hakusana
			if(!hakusana.equals("")) {//Jos hakusana ei ole tyhjä
				asiakkaat = dao.getAllItems(hakusana); //Haetaan kaikki hakusanan mukaiset asiakkaat							
			}else {
				asiakkaat = dao.getAllItems(); //Haetaan kaikki asiakkaat
			}
			strJSON = new Gson().toJson(asiakkaat);	
		}	
		response.setContentType("application/json; charset=UTF-8"); //määrittely
		PrintWriter out = response.getWriter();
		out.println(strJSON); //tulostus selaimelle
	}

	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("Asiakkaat.doPost()");
	}

	
	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("Asiakkaat.doPut()");
	}

	
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("Asiakkaat.doDelete()");
	}

}
