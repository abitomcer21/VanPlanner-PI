package controlador;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import modelo.dao.JdbcConnection;

/**
 * Servlet para eliminar viajes
 */
@WebServlet("/EliminarViajeServlet")
public class EliminarViajeServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		
		PrintWriter out = response.getWriter();
		Gson gson = new Gson();
		JsonObject jsonResponse = new JsonObject();
		
		try {
			String idViajeStr = request.getParameter("id_viaje");
			
			if (idViajeStr == null || idViajeStr.isEmpty()) {
				jsonResponse.addProperty("success", false);
				jsonResponse.addProperty("message", "Falta el parámetro id_viaje");
				out.print(gson.toJson(jsonResponse));
				out.flush();
				return;
			}
			
			int idViaje = Integer.parseInt(idViajeStr);
			
			Connection connection = JdbcConnection.getConnection();
			String sql = "DELETE FROM viajes WHERE id_viaje = ?";
			
			PreparedStatement preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setInt(1, idViaje);
			
			int rowsAffected = preparedStatement.executeUpdate();
			preparedStatement.close();
			
			if (rowsAffected > 0) {
				jsonResponse.addProperty("success", true);
				jsonResponse.addProperty("message", "Viaje eliminado correctamente");
			} else {
				jsonResponse.addProperty("success", false);
				jsonResponse.addProperty("message", "No se pudo eliminar el viaje");
			}
			
		} catch (NumberFormatException e) {
			e.printStackTrace();
			jsonResponse.addProperty("success", false);
			jsonResponse.addProperty("message", "ID de viaje inválido");
		} catch (SQLException e) {
			e.printStackTrace();
			jsonResponse.addProperty("success", false);
			jsonResponse.addProperty("message", "Error de base de datos: " + e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			jsonResponse.addProperty("success", false);
			jsonResponse.addProperty("message", "Error: " + e.getMessage());
		}
		
		out.print(gson.toJson(jsonResponse));
		out.flush();
	}
}
