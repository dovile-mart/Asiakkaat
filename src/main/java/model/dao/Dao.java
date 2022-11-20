package model.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import model.Asiakas;

public class Dao {
	private Connection con = null; // yhteysobjekti
	private ResultSet rs = null; // result set
	private PreparedStatement stmtPrep = null;
	private String sql;
	private String db = "Myynti.sqlite"; // kertoo minkänimistä tietokantaa käytetään

	private Connection yhdista() { // tämä metodi liittää piuhan
		Connection con = null;
		String path = System.getProperty("catalina.base");
		path = path.substring(0, path.indexOf(".metadata")).replace("\\", "/"); // Eclipsessa
		// System.out.println(path); //Tästä näet mihin kansioon laitat
		// tietokanta-tiedostosi, eli se tulee samaan paikkaan missä näkyy
		// SERVERS-kansio
		// path += "/webapps/"; //Tuotannossa. Laita tietokanta webapps-kansioon
		String url = "jdbc:sqlite:" + path + db;
		try {
			Class.forName("org.sqlite.JDBC");
			con = DriverManager.getConnection(url);
			System.out.println("Yhteys avattu.");
		} catch (Exception e) {
			System.out.println("Yhteyden avaus epäonnistui.");
			e.printStackTrace();
		}
		return con;
	}
	
	private void sulje() { // ja tämä vetää piuhan irti, eli sulkee yhteyden
		if (stmtPrep != null) {
			try {
				stmtPrep.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		if (rs != null) {
			try {
				rs.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		if (con != null) {
			try {
				con.close();
				System.out.println("Yhteys suljettu.");
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
	
	public ArrayList<Asiakas>getAllItems() { // metodi joka hakee kaikki tiedot
		ArrayList<Asiakas> asiakkaat = new ArrayList<Asiakas>(); //luo uuden arraylistin, ja jos arvoja ei ole, se palautaa tyhjän arraylistin
		sql = "SELECT * FROM asiakkaat ORDER BY asiakas_id DESC"; // Suurin id tulee ensimmäisenä
		try {
			con = yhdista();
			if (con != null) { // jos yhteys onnistui
				stmtPrep = con.prepareStatement(sql);
				rs = stmtPrep.executeQuery(); // tässä rs saa sen mitä sql-lause tuoti tietokannasta
				if (rs != null) { // jos kysely onnistui
					while (rs.next()) { // tällä rakenteella käydään rs sisällön läpi, rs on taulu täynnä dataa, ja sen
										// käymiseen läpi on pointeri, rs.next(), joka on ennen ensimmäistä taulun data-riviä
										//ja se siirtyy datariville ja lukee sen. 
						Asiakas asiakas = new Asiakas(); // luo uuden asiakas-objektin
						asiakas.setAsiakas_id(rs.getInt(1)); //setterillä aseta arvot sille ja rs.getInt-lukee dataa resultsetistä, ja 1,2,3,4,5-ovat sarakenumeroita
						asiakas.setEtunimi(rs.getString(2)); //numeroiden sijaan voisi lukea suluissa myös sarakenimi lainausmerkkeissä
						asiakas.setSukunimi(rs.getString(3));
						asiakas.setPuhelin(rs.getString(4));
						asiakas.setSposti(rs.getString(5));
						asiakkaat.add(asiakas);		//kun kaikki sarakkeet ovat käyty läpi asiakkaat-arraylistiin lisätään asiakas
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace(); //jos tulee ongelmia, niin tämä kerto mikä se on
		} finally {
			sulje(); //katkaistaan yhteys
		}
		return asiakkaat;
	}
	
	public ArrayList<Asiakas>getAllItems(String searchStr) { // metodi joka hakee kaikki tiedot
		ArrayList<Asiakas> asiakkaat = new ArrayList<Asiakas>(); //luo uuden arraylistin, ja jos arvoja ei ole, se palautaa tyhjän arraylistin
		sql = "SELECT * FROM asiakkaat WHERE etunimi LIKE ? OR sukunimi LIKE ? OR puhelin LIKE ? OR sposti LIKE ? ORDER BY asiakas_id DESC"; // Suurin id tulee ensimmäisenä
		try {
			con = yhdista();
			if (con != null) { // jos yhteys onnistui
				stmtPrep = con.prepareStatement(sql);
				stmtPrep.setString(1, "%" + searchStr + "%");
				stmtPrep.setString(2, "%" + searchStr + "%");
				stmtPrep.setString(3, "%" + searchStr + "%");
				stmtPrep.setString(4, "%" + searchStr + "%");
				rs = stmtPrep.executeQuery(); // tässä rs saa sen mitä sql-lause tuoti tietokannasta
				if (rs != null) { // jos kysely onnistui
					while (rs.next()) { // tällä rakenteella käydään rs sisällön läpi, rs on taulu täynnä dataa, ja sen
										// käymiseen läpi on pointeri, rs.next(), joka on ennen ensimmäistä taulun data-riviä
										//ja se siirtyy datariville ja lukee sen. 
						Asiakas asiakas = new Asiakas(); // luo uuden asiakas-objektin
						asiakas.setAsiakas_id(rs.getInt(1)); //setterillä aseta arvot sille ja rs.getInt-lukee dataa resultsetistä, ja 1,2,3,4,5-ovat sarakenumeroita
						asiakas.setEtunimi(rs.getString(2)); //numeroiden sijaan voisi lukea suluissa myös sarakenimi lainausmerkkeissä
						asiakas.setSukunimi(rs.getString(3));
						asiakas.setPuhelin(rs.getString(4));
						asiakas.setSposti(rs.getString(5));
						asiakkaat.add(asiakas);		//kun kaikki sarakkeet ovat käyty läpi asiakkaat-arraylistiin lisätään asiakas
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace(); //jos tulee ongelmia, niin tämä kerto mikä se on
		} finally {
			sulje(); //katkaistaan yhteys
		}
		return asiakkaat;
	}
}
