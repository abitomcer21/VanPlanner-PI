package controlador;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import modelo.Usuario;
import modelo.dao.Dao;

/**
 * Servlet implementación clase ObtenerUsuarioServlet
 */
@SuppressWarnings("serial")
@WebServlet("/ObtenerUsuarioServlet")
public class ObtenerUsuarioServlet extends HttpServlet {
    
    /**
     * Maneja las solicitudes HTTP GET para obtener un usuario específico.
     * 
     * @param request La solicitud HTTP
     * @param response La respuesta HTTP
     * @throws ServletException Si ocurre un error del servlet
     * @throws IOException Si ocurre un error de E/S
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        try {
            String idParam = request.getParameter("id");
            
            if (idParam == null || idParam.isEmpty()) {
                response.sendError(400, "El parámetro 'id' es requerido");
                return;
            }
            
            int idUsuario = Integer.parseInt(idParam);
            
            Dao dao = Dao.getInstancia();
            Usuario usuario = dao.obtenerUsuarioPorId(idUsuario);
            
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            
            if (usuario == null) {
                response.setStatus(404);
                response.getWriter().write("{\"error\": \"Usuario no encontrado\"}");
                return;
            }
            
            Gson gson = new Gson();
            String json = gson.toJson(usuario);
            
            response.getWriter().write(json);
            response.setStatus(200);
            
        } catch (NumberFormatException e) {
            response.sendError(400, "El ID debe ser un número válido");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(500, "Error al obtener el usuario");
        }
    }
}
