package controlador;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import modelo.dao.Dao;

/**
 * Servlet implementación clase EliminarRecordatorioServlet
 */
@WebServlet("/EliminarRecordatorioServlet")
public class EliminarRecordatorioServlet extends HttpServlet {
	
	/**
	 * Identificador único de versión para la serialización.
	 */
	private static final long serialVersionUID = 1L;
	
	/**
	 * Maneja las solicitudes HTTP POST para eliminar recordatorio.
	 * 
	 * @param request La solicitud HTTP
	 * @param response La respuesta HTTP
	 * @throws ServletException Si ocurre un error del servlet
	 * @throws IOException Si ocurre un error de E/S
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		request.setCharacterEncoding("UTF-8");
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		
		PrintWriter out = response.getWriter();
		Gson gson = new Gson();
		JsonObject jsonResponse = new JsonObject();
		
		try {
			String idRecordatorioParam = request.getParameter("id_recordatorio");
			
			if (idRecordatorioParam == null || idRecordatorioParam.trim().isEmpty()) {
				jsonResponse.addProperty("success", false);
				jsonResponse.addProperty("message", "Falta el parámetro id_recordatorio");
				out.print(gson.toJson(jsonResponse));
				return;
			}
			
			int idRecordatorio = Integer.parseInt(idRecordatorioParam);
			
			Dao instanciaDao = Dao.getInstancia();
			boolean eliminado = instanciaDao.eliminarRecordatorio(idRecordatorio);
			
			if (eliminado) {
				jsonResponse.addProperty("success", true);
				jsonResponse.addProperty("message", "Recordatorio eliminado correctamente");
			} else {
				jsonResponse.addProperty("success", false);
				jsonResponse.addProperty("message", "No se encontró el recordatorio o no se pudo eliminar");
			}
			
		} catch (NumberFormatException e) {
			jsonResponse.addProperty("success", false);
			jsonResponse.addProperty("message", "El id_recordatorio debe ser un número válido");
		} catch (Exception e) {
			e.printStackTrace();
			jsonResponse.addProperty("success", false);
			jsonResponse.addProperty("message", "Error en el servidor: " + e.getMessage());
		}
		
		out.print(gson.toJson(jsonResponse));
		out.flush();
	}
}
