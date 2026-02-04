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
 * Servlet implementación clase ActualizarRecordatorioServlet
 */
@WebServlet("/ActualizarRecordatorioServlet")
public class ActualizarRecordatorioServlet extends HttpServlet {
	
	/**
	 * Identificador único de versión para la serialización.
	 */
	private static final long serialVersionUID = 1L;
	
	/**
	 * Maneja las solicitudes HTTP POST para actualizar recordatorio.
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
			String completadoParam = request.getParameter("completado");
			
			if (idRecordatorioParam == null || completadoParam == null) {
				jsonResponse.addProperty("success", false);
				jsonResponse.addProperty("message", "Faltan parámetros obligatorios");
				out.print(gson.toJson(jsonResponse));
				return;
			}
			
			int idRecordatorio = Integer.parseInt(idRecordatorioParam);
			boolean completado = Boolean.parseBoolean(completadoParam);
			
			Dao instanciaDao = Dao.getInstancia();
			boolean actualizado = instanciaDao.actualizarRecordatorio(idRecordatorio, completado);
			
			if (actualizado) {
				jsonResponse.addProperty("success", true);
				jsonResponse.addProperty("message", "Recordatorio actualizado correctamente");
			} else {
				jsonResponse.addProperty("success", false);
				jsonResponse.addProperty("message", "No se encontró el recordatorio o no se pudo actualizar");
			}
			
		} catch (NumberFormatException e) {
			jsonResponse.addProperty("success", false);
			jsonResponse.addProperty("message", "Los parámetros deben tener formato válido");
		} catch (Exception e) {
			e.printStackTrace();
			jsonResponse.addProperty("success", false);
			jsonResponse.addProperty("message", "Error en el servidor: " + e.getMessage());
		}
		
		out.print(gson.toJson(jsonResponse));
		out.flush();
	}
}
