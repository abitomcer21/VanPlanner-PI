package controlador;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import modelo.Itinerario;
import modelo.dao.Dao;

@WebServlet("/ObtenerItinerariosServlet")
public class ObtenerItinerariosServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		PrintWriter out = response.getWriter();
		Gson gson = new Gson();

		try {
			String viajeIdStr = request.getParameter("viaje_id");
			
			if (viajeIdStr == null || viajeIdStr.isEmpty()) {
				response.sendError(400, "Falta el parámetro viaje_id");
				return;
			}

			int viajeId = Integer.parseInt(viajeIdStr);

			Dao dao = Dao.getInstancia();
			List<Itinerario> itinerarios = dao.obtenerItinerariosPorViaje(viajeId);

			out.print(gson.toJson(itinerarios));

		} catch (NumberFormatException e) {
			e.printStackTrace();
			response.sendError(400, "ID de viaje inválido");
		} catch (Exception e) {
			e.printStackTrace();
			response.sendError(500, "Error al obtener itinerarios");
		}

		out.flush();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}
}
