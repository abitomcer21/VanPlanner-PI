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
 * Servlet para obtener los colaboradores de un viaje
 */
@WebServlet("/ObtenerColaboradoresServlet")
public class ObtenerColaboradoresServlet extends HttpServlet {
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
			String sql = "SELECT c.id_colaborador, c.usuario_id, c.rol, c.estado, " +
			             "u.nombre, u.email " +
			             "FROM colaboradores c " +
			             "INNER JOIN usuarios u ON c.usuario_id = u.id_usuario " +
			             "WHERE c.viaje_id = ?";
			
			PreparedStatement preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setInt(1, idViaje);
			
			ResultSet rs = preparedStatement.executeQuery();
			
			List<JsonObject> colaboradores = new ArrayList<>();
			
			while (rs.next()) {
				JsonObject colaborador = new JsonObject();
				colaborador.addProperty("id_colaborador", rs.getInt("id_colaborador"));
				colaborador.addProperty("usuario_id", rs.getInt("usuario_id"));
				colaborador.addProperty("rol", rs.getString("rol"));
				colaborador.addProperty("estado", rs.getString("estado"));
				colaborador.addProperty("nombre", rs.getString("nombre"));
				colaborador.addProperty("email", rs.getString("email"));
				colaboradores.add(colaborador);
			}
			
			rs.close();
			preparedStatement.close();
			
			out.print(gson.toJson(colaboradores));
			
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
