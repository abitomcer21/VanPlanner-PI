package modelo.dao;

import java.sql.Connection;
import java.sql.DriverManager;

/**
 * Clase JdbcConnection.
 * Obtiene la conexión física a la base de datos.
 * @author Yo mismo
 * @version 1.0
 */
public class JdbcConnection {
	//Conexión a la base de datos
	static Connection connection = null;

	/**
	 * Obtener la conexión a la base de datos.
	 * @return connection La conexión a la base de datos.
	 */
	public static Connection getConnection() {
		String db = "vanplanner_db";
		String user = "abi";
		String pass = "12345.aa";
		String url = "jdbc:mysql://localhost:3306/" + db + "?useUnicode=yes&characterEncoding=UTF-8&connectionCollation=utf8mb4_unicode_ci";
		
		try {
			// Cargar el conector de MySQL
			Class.forName("com.mysql.jdbc.Driver");
			
			// Crear conexión a la base de datos
			connection = (Connection) DriverManager.getConnection(url, user, pass);
			
		} catch (Exception e) {
			System.out.println("Error en conexión: " + e.getMessage());
			e.printStackTrace();
		}		
		return connection;  
    }
}