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

import modelo.Vehiculo;
import modelo.dao.Dao;

/**
 * Servlet implementation class ObtenerVehiculosServlet
 */
@WebServlet("/ObtenerVehiculosServlet")
public class ObtenerVehiculosServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ObtenerVehiculosServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		
		String usuarioIdStr = request.getParameter("usuario_id");
		
		if (usuarioIdStr == null || usuarioIdStr.isEmpty()) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("{\"error\": \"Falta el parámetro usuario_id\"}");
			return;
		}
		
		int usuarioId = Integer.parseInt(usuarioIdStr);
		Dao instanciaDao = Dao.getInstancia();
		
		ArrayList<Vehiculo> listadoVehiculos = instanciaDao.obtenerVehiculos(usuarioId);
		Gson gson = new Gson();
		
		PrintWriter pw = response.getWriter();
		String resultado = gson.toJson(listadoVehiculos);
		System.out.println(resultado);
		pw.println(resultado);
		pw.close();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
