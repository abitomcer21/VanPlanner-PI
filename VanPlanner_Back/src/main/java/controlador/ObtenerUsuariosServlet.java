package controlador;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import modelo.Usuario;
import modelo.dao.Dao;

/**
 * Servlet implementación clase ObtenerUsuariosServlet
 */
@SuppressWarnings("serial")
@WebServlet("/ObtenerUsuariosServlet")
public class ObtenerUsuariosServlet extends HttpServlet {
    
    /**
     * Maneja las solicitudes HTTP GET para obtener todos los usuarios.
     * 
     * @param request La solicitud HTTP
     * @param response La respuesta HTTP
     * @throws ServletException Si ocurre un error del servlet
     * @throws IOException Si ocurre un error de E/S
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            
            Dao dao = Dao.getInstancia();
            List<Usuario> usuarios = dao.getUsuarios();
            
            Gson gson = new Gson();
            String json = gson.toJson(usuarios);
            
            response.getWriter().write(json);
            response.setStatus(200);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(500, "Error al obtener los usuarios");
        }
    }
}
