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

import modelo.Itinerario;
import modelo.dao.Dao;

@WebServlet("/AddItinerarioServlet")
public class AddItinerarioServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		request.setCharacterEncoding("UTF-8");
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		PrintWriter out = response.getWriter();
		Gson gson = new Gson();
		JsonObject jsonResponse = new JsonObject();

		try {
			// Leer el cuerpo de la petición
			StringBuilder sb = new StringBuilder();
			String line;
			while ((line = request.getReader().readLine()) != null) {
				sb.append(line);
			}

			// Convertir JSON a objeto Itinerario
			Itinerario itinerario = gson.fromJson(sb.toString(), Itinerario.class);

			// Guardar en base de datos
			Dao dao = Dao.getInstancia();
			boolean resultado = dao.addItinerario(itinerario);

			if (resultado) {
				jsonResponse.addProperty("success", true);
				jsonResponse.addProperty("message", "Actividad añadida correctamente");
			} else {
				jsonResponse.addProperty("success", false);
				jsonResponse.addProperty("message", "No se pudo añadir la actividad");
			}

		} catch (Exception e) {
			e.printStackTrace();
			jsonResponse.addProperty("success", false);
			jsonResponse.addProperty("message", "Error: " + e.getMessage());
		}

		out.print(gson.toJson(jsonResponse));
		out.flush();
	}
}
