package controlador;
 
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import modelo.Usuario;
import modelo.dao.Dao;

/**
 * Servlet implementación clase LoginServlet
 */
@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
    
    /**
     * Identificador único de versión para la serialización.
     */
    private static final long serialVersionUID = 1L;
    
    /**
     * ID de usuario predefinido.
     */
    private final String userID = "abigail.tomcer@gmail.com";
    
    /**
     * Contraseña predefinida.
     */
    private final String pwd = "abi123";
 
    /**
     * Maneja las solicitudes HTTP GET para autenticación.
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

        //Obtener los parámetros de la petición del cliente para el usuario y la contraseña
        String usuario = request.getParameter("usuario");
        String password = request.getParameter("password");
        
        Dao instanciaDao = Dao.getInstancia();
        
        Usuario usuarioEncontrado = instanciaDao.loginUsuarioCorrecto(usuario, password);
        Gson gson = new Gson();
        
        if (usuarioEncontrado != null) {
        	PrintWriter pw = response.getWriter();
            pw.println(gson.toJson(usuarioEncontrado));
            pw.close();
        } else {
        	response.sendError(403);
        } 
    }
    
    /**
     * Maneja las solicitudes HTTP POST para autenticación.
     * 
     * @param request La solicitud HTTP
     * @param response La respuesta HTTP
     * @throws ServletException Si ocurre un error del servlet
     * @throws IOException Si ocurre un error de E/S
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        //Obtener los parámetros de la petición del cliente para el usuario y la contraseña
        String usuario = request.getParameter("usuario");
        String password = request.getParameter("password");
        Dao instanciaDao = Dao.getInstancia();
        
        Usuario usuarioEncontrado = instanciaDao.loginUsuarioCorrecto(usuario, password);
        Gson gson = new Gson();
        
        if (usuarioEncontrado != null) {
        	PrintWriter pw = response.getWriter();
            pw.println(gson.toJson(usuarioEncontrado));
            pw.close();
        } else {
        	response.sendError(403);
        } 
    }
}