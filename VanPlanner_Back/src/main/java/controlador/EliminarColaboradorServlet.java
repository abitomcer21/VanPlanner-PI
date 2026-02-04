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
 * Servlet para eliminar colaboradores de un viaje
 */
@WebServlet("/EliminarColaboradorServlet")
public class EliminarColaboradorServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		
		PrintWriter out = response.getWriter();
		Gson gson = new Gson();
		JsonObject jsonResponse = new JsonObject();
		
		try {
			int idColaborador = Integer.parseInt(request.getParameter("id_colaborador"));
			
			Connection connection = JdbcConnection.getConnection();
			String sql = "DELETE FROM colaboradores WHERE id_colaborador = ?";
			
			PreparedStatement preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setInt(1, idColaborador);
			
			int rowsAffected = preparedStatement.executeUpdate();
			preparedStatement.close();
			
			if (rowsAffected > 0) {
				jsonResponse.addProperty("success", true);
				jsonResponse.addProperty("message", "Colaborador eliminado correctamente");
			} else {
				jsonResponse.addProperty("success", false);
				jsonResponse.addProperty("message", "No se pudo eliminar el colaborador");
			}
			
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
