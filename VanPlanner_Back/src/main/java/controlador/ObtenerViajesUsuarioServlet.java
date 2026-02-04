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

import modelo.Viaje;
import modelo.dao.Dao;

/**
 * Servlet implementation class ObtenerViajesUsuarioServlet
 */
@WebServlet("/ObtenerViajesUsuarioServlet")
public class ObtenerViajesUsuarioServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ObtenerViajesUsuarioServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("application/json; charset=UTF-8");
		response.setCharacterEncoding("UTF-8");
		
        String usuario = request.getParameter("usuario");
        
        Dao instanciaDao = Dao.getInstancia();
        
        ArrayList<Viaje> listadoViajesEncontrado = instanciaDao.obtenerViajesUsuario(Integer.parseInt(usuario));
        Gson gson = new Gson();
        
    	PrintWriter pw = response.getWriter();
    	String resultado = gson.toJson(listadoViajesEncontrado);
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
