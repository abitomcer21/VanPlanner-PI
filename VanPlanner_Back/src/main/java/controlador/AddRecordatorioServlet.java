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
 * Servlet implementación clase AddRecordatorioServlet
 */
@WebServlet("/AddRecordatorioServlet")
public class AddRecordatorioServlet extends HttpServlet {
	
	/**
	 * Identificador único de versión para la serialización.
	 */
	private static final long serialVersionUID = 1L;
	
	/**
	 * Maneja las solicitudes HTTP POST para añadir recordatorio.
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
		
		System.out.println("=== AddRecordatorioServlet ===");
		System.out.println("Content-Type: " + request.getContentType());
		
		try {
			String usuarioIdParam = request.getParameter("usuario_id");
			String texto = request.getParameter("texto");
			
			System.out.println("usuario_id recibido: " + usuarioIdParam);
			System.out.println("texto recibido: " + texto);
			
			if (usuarioIdParam == null || texto == null || texto.trim().isEmpty()) {
				jsonResponse.addProperty("success", false);
				jsonResponse.addProperty("message", "Faltan parámetros obligatorios");
				out.print(gson.toJson(jsonResponse));
				return;
			}
			
			int usuarioId = Integer.parseInt(usuarioIdParam);
			
			Dao instanciaDao = Dao.getInstancia();
			int idRecordatorio = instanciaDao.addRecordatorio(usuarioId, texto);
			
			if (idRecordatorio > 0) {
				jsonResponse.addProperty("success", true);
				jsonResponse.addProperty("message", "Recordatorio añadido correctamente");
				jsonResponse.addProperty("id_recordatorio", idRecordatorio);
			} else {
				jsonResponse.addProperty("success", false);
				jsonResponse.addProperty("message", "No se pudo añadir el recordatorio");
			}
			
		} catch (NumberFormatException e) {
			jsonResponse.addProperty("success", false);
			jsonResponse.addProperty("message", "El usuario_id debe ser un número válido");
		} catch (Exception e) {
			e.printStackTrace();
			jsonResponse.addProperty("success", false);
			jsonResponse.addProperty("message", "Error en el servidor: " + e.getMessage());
		}
		
		out.print(gson.toJson(jsonResponse));
		out.flush();
	}
	
	/**
	 * Maneja las solicitudes HTTP GET (para testing).
	 * 
	 * @param request La solicitud HTTP
	 * @param response La respuesta HTTP
	 * @throws ServletException Si ocurre un error del servlet
	 * @throws IOException Si ocurre un error de E/S
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}
}
