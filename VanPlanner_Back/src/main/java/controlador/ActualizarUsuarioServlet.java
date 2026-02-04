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
import utils.ControllerUtils;

/**
 * Servlet implementación clase ActualizarUsuarioServlet
 */
@SuppressWarnings("serial")
@WebServlet("/ActualizarUsuarioServlet")
public class ActualizarUsuarioServlet extends HttpServlet {
    
    /**
     * Maneja las solicitudes HTTP PUT para actualizar un usuario.
     * 
     * @param request La solicitud HTTP
     * @param response La respuesta HTTP
     * @throws ServletException Si ocurre un error del servlet
     * @throws IOException Si ocurre un error de E/S
     */
    protected void doPut(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        try {
            Gson gson = new Gson();
            String json = ControllerUtils.getBody(request);
            System.out.println("[ActualizarUsuarioServlet] JSON recibido: " + json);
            Usuario usuario = gson.fromJson(json, Usuario.class);
            // Log de los campos principales
            System.out.println("[ActualizarUsuarioServlet] idUsuario: " + usuario.getIdUsuario());
            System.out.println("[ActualizarUsuarioServlet] nombreUsuario: " + usuario.getNombreUsuario());
            System.out.println("[ActualizarUsuarioServlet] nombre: " + usuario.getNombre());
            System.out.println("[ActualizarUsuarioServlet] apellidos: " + usuario.getApellidos());
            System.out.println("[ActualizarUsuarioServlet] email: " + usuario.getEmail());
            System.out.println("[ActualizarUsuarioServlet] tipoUsuario: " + usuario.getTipoUsuario());
            System.out.println("[ActualizarUsuarioServlet] activo: " + usuario.isActivo());
            System.out.println("[ActualizarUsuarioServlet] ciudad: " + usuario.getCiudad());
            System.out.println("[ActualizarUsuarioServlet] fechaNacimiento: " + usuario.getFechaNacimiento());
            System.out.println("[ActualizarUsuarioServlet] sexo: " + usuario.getSexo());
            
            if (usuario.getIdUsuario() <= 0) {
                response.sendError(400, "El ID del usuario es requerido y debe ser v\u00e1lido");
                return;
            }
            
            Dao dao = Dao.getInstancia();
            int resultado = dao.actualizarUsuario(usuario);
            
            if (resultado != 0) {
                response.sendError(500, "Error al actualizar el usuario");
                return;
            }
            
            response.setStatus(200);
            response.getWriter().write("{\"mensaje\": \"Usuario actualizado correctamente\"}");
            
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(500, "Error al actualizar el usuario");
        }
    }
    
    /**
     * Maneja las solicitudes HTTP POST para actualizar un usuario.
     * 
     * @param request La solicitud HTTP
     * @param response La respuesta HTTP
     * @throws ServletException Si ocurre un error del servlet
     * @throws IOException Si ocurre un error de E/S
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        doPut(request, response);
    }
}
