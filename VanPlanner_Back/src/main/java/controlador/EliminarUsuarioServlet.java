package controlador;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import modelo.dao.Dao;

/**
 * Servlet implementación clase EliminarUsuarioServlet
 */
@SuppressWarnings("serial")
@WebServlet("/EliminarUsuarioServlet")
public class EliminarUsuarioServlet extends HttpServlet {
    
    /**
     * Maneja las solicitudes HTTP DELETE para desactivar un usuario.
     * 
     * @param request La solicitud HTTP
     * @param response La respuesta HTTP
     * @throws ServletException Si ocurre un error del servlet
     * @throws IOException Si ocurre un error de E/S
     */
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        try {
            String idParam = request.getParameter("id");
            
            if (idParam == null || idParam.isEmpty()) {
                response.sendError(400, "El parámetro 'id' es requerido");
                return;
            }
            
            int idUsuario = Integer.parseInt(idParam);
            
            if (idUsuario <= 0) {
                response.sendError(400, "El ID debe ser un número válido mayor a 0");
                return;
            }
            
            Dao dao = Dao.getInstancia();
            int resultado = dao.eliminarUsuario(idUsuario);
            
            if (resultado != 0) {
                response.sendError(500, "Error al eliminar el usuario");
                return;
            }
            
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setStatus(200);
            response.getWriter().write("{\"mensaje\": \"Usuario eliminado correctamente\"}");
            
        } catch (NumberFormatException e) {
            response.sendError(400, "El ID debe ser un número válido");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(500, "Error al eliminar el usuario");
        }
    }
    
    /**
     * Maneja las solicitudes HTTP POST para eliminar un usuario.
     * Algunos clientes no soportan DELETE, así que también se puede usar POST.
     * Llama internamente al método doDelete.
     * 
     * @param request La solicitud HTTP del cliente
     * @param response La respuesta HTTP al cliente
     * @throws ServletException Si ocurre un error en el servlet
     * @throws IOException Si ocurre un error de entrada/salida
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        doDelete(request, response);
    }
}
