package controlador;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import modelo.Recordatorio;
import modelo.dao.Dao;

/**
 * Servlet implementación clase ObtenerRecordatoriosServlet
 */
@WebServlet("/ObtenerRecordatoriosServlet")
public class ObtenerRecordatoriosServlet extends HttpServlet {
	
	/**
	 * Identificador único de versión para la serialización.
	 */
	private static final long serialVersionUID = 1L;
	
	/**
	 * Maneja las solicitudes HTTP GET para obtener recordatorios.
	 * 
	 * @param request La solicitud HTTP
	 * @param response La respuesta HTTP
	 * @throws ServletException Si ocurre un error del servlet
	 * @throws IOException Si ocurre un error de E/S
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		
		String usuarioIdParam = request.getParameter("usuario_id");
		
		if (usuarioIdParam == null || usuarioIdParam.trim().isEmpty()) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Falta el parámetro usuario_id");
			return;
		}
		
		try {
			int usuarioId = Integer.parseInt(usuarioIdParam);
			
			Dao instanciaDao = Dao.getInstancia();
			ArrayList<Recordatorio> recordatorios = instanciaDao.obtenerRecordatoriosUsuario(usuarioId);
			
			Gson gson = new Gson();
			PrintWriter pw = response.getWriter();
			String resultado = gson.toJson(recordatorios);
			pw.println(resultado);
			pw.close();
			
		} catch (NumberFormatException e) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "El usuario_id debe ser un número válido");
		}
	}
	
	/**
	 * Maneja las solicitudes HTTP POST redirigiendo a doGet.
	 * 
	 * @param request La solicitud HTTP
	 * @param response La respuesta HTTP
	 * @throws ServletException Si ocurre un error del servlet
	 * @throws IOException Si ocurre un error de E/S
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {
		doGet(request, response);
	}
}
