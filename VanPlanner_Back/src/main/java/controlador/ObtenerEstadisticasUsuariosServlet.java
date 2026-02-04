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

@WebServlet("/ObtenerEstadisticasUsuariosServlet")
public class ObtenerEstadisticasUsuariosServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public ObtenerEstadisticasUsuariosServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("application/json; charset=UTF-8");
		response.setCharacterEncoding("UTF-8");
		
        Dao instanciaDao = Dao.getInstancia();
        
        // Obtener estadísticas
        int totalUsuarios = instanciaDao.contarTotalUsuarios();
        int usuariosActivos = instanciaDao.contarUsuariosActivos();
        int nuevosHoy = instanciaDao.contarUsuariosNuevosHoy();
        
        // Crear objeto JSON con las estadísticas
        JsonObject estadisticas = new JsonObject();
        estadisticas.addProperty("totalUsuarios", totalUsuarios);
        estadisticas.addProperty("usuariosActivos", usuariosActivos);
        estadisticas.addProperty("nuevosHoy", nuevosHoy);
        
        Gson gson = new Gson();
    	PrintWriter pw = response.getWriter();
    	String resultado = gson.toJson(estadisticas);
        pw.println(resultado);
        pw.close();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
}
