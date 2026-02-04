package controlador;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import modelo.dao.JdbcConnection;

/**
 * Servlet para obtener las paradas de un viaje
 */
@WebServlet("/ObtenerParadasServlet")
public class ObtenerParadasServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		
		PrintWriter out = response.getWriter();
		Gson gson = new Gson();
		
		try {
			int idViaje = Integer.parseInt(request.getParameter("id_viaje"));
			
			Connection connection = JdbcConnection.getConnection();
			String sql = "SELECT id_parada, viaje_id, orden_secuencia, nombre_lugar, direccion, " +
			             "latitud, longitud, tipo, hora_estimada_llegada, hora_estimada_salida, notas " +
			             "FROM paradas WHERE viaje_id = ? ORDER BY orden_secuencia";
			
			PreparedStatement preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setInt(1, idViaje);
			
			ResultSet rs = preparedStatement.executeQuery();
			
			List<JsonObject> paradas = new ArrayList<>();
			
			while (rs.next()) {
				JsonObject parada = new JsonObject();
				parada.addProperty("id_parada", rs.getInt("id_parada"));
				parada.addProperty("viaje_id", rs.getInt("viaje_id"));
				parada.addProperty("orden_secuencia", rs.getInt("orden_secuencia"));
				parada.addProperty("nombre_lugar", rs.getString("nombre_lugar"));
				parada.addProperty("direccion", rs.getString("direccion"));
				
				// Manejar valores nulos para latitud y longitud
				if (rs.getObject("latitud") != null) {
					parada.addProperty("latitud", rs.getDouble("latitud"));
				}
				if (rs.getObject("longitud") != null) {
					parada.addProperty("longitud", rs.getDouble("longitud"));
				}
				
				parada.addProperty("tipo", rs.getString("tipo"));
				
				if (rs.getObject("hora_estimada_llegada") != null) {
					parada.addProperty("hora_estimada_llegada", rs.getString("hora_estimada_llegada"));
				}
				if (rs.getObject("hora_estimada_salida") != null) {
					parada.addProperty("hora_estimada_salida", rs.getString("hora_estimada_salida"));
				}
				
				parada.addProperty("notas", rs.getString("notas"));
				paradas.add(parada);
			}
			
			rs.close();
			preparedStatement.close();
			
			out.print(gson.toJson(paradas));
			
		} catch (SQLException e) {
			e.printStackTrace();
			JsonObject respuesta = new JsonObject();
			respuesta.addProperty("error", "Error de base de datos: " + e.getMessage());
			out.print(gson.toJson(respuesta));
		} catch (Exception e) {
			e.printStackTrace();
			JsonObject respuesta = new JsonObject();
			respuesta.addProperty("error", "Error: " + e.getMessage());
			out.print(gson.toJson(respuesta));
		}
	}
}
