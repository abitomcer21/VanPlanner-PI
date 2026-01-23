package controlador;

import java.io.IOException;

import java.text.SimpleDateFormat;
import java.util.Date;
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
 * Servlet que maneja el registro de nuevos usuarios en el sistema.
 * Procesa tanto la visualización del formulario de registro (GET)
 * como el envío de datos para crear un nuevo usuario (POST).
 */

@SuppressWarnings("serial")
@WebServlet("/RegistroServlet")



public class RegistroServlet extends HttpServlet {
	
	/**
     * Maneja las solicitudes HTTP GET para mostrar el formulario de registro.
     * Redirige a la página JSP que contiene el formulario para crear un usuario.
     * 
     * @param request La solicitud HTTP del cliente
     * @param response La respuesta HTTP al cliente
     * @throws ServletException Si ocurre un error en el servlet
     * @throws IOException Si ocurre un error de entrada/salida
     */
    
    // GET: Muestra el formulario vacío para crear usuario
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Redirige al formulario JSP
        request.getRequestDispatcher("/crearUsuario.jsp").forward(request, response);
    }
    
    /**
     * Maneja las solicitudes HTTP POST para registrar un nuevo usuario.
     * 
     * <p>Proceso del método:</p>
     * <ol>
     *   <li>Obtiene el cuerpo de la solicitud en formato JSON</li>
     *   <li>Deserializa el JSON a un objeto Usuario</li>
     *   <li>Obtiene una instancia del DAO</li>
     *   <li>Inserta el usuario en la base de datos</li>
     *   <li>Retorna error 500 si ocurre algún problema</li>
     * </ol>
     * 
     * @param request La solicitud HTTP del cliente
     * @param response La respuesta HTTP al cliente
     * @throws ServletException Si ocurre un error en el servlet
     * @throws IOException Si ocurre un error de entrada/salida
     */
    
    // POST: Recibe los datos del formulario y hace INSERT en BD
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        try {
        	Gson gson = new Gson();
        	String json = ControllerUtils.getBody(request);
        	Usuario usuario = gson.fromJson(json, modelo.Usuario.class);
                        
            // 4. Obtener el Dao y llamar al método INSERT
            Dao dao = Dao.getInstancia();
            int resultado = dao.anyadirUsuario(usuario);
            
            // 5. Verificar resultado 
            if (resultado != 0) {
                response.sendError(500);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            // Error inesperado
            response.sendError(500);
        }
    }
}