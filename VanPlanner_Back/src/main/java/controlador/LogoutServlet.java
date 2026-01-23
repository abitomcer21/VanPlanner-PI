package controlador;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet que maneja el proceso de cierre de sesión (logout) de los usuarios.
 * Este servlet se encarga de invalidar la sesión HTTP actual y redirigir al usuario
 * a la página principal de la aplicación.
 * 
 * <p>Accesible a través de la URL "/LogoutServlet" mediante método POST.</p>
 * 
 * @author Abigail Tomás
 * @version 1.0
 * @since 1.0
 */
@WebServlet("/LogoutServlet")
public class LogoutServlet extends HttpServlet {
    
    /**
     * Identificador único de versión para la serialización.
     * Utilizado para mantener la compatibilidad entre diferentes versiones de la clase.
     */
    private static final long serialVersionUID = 1L;
 
    /**
     * Maneja las solicitudes HTTP POST para cerrar la sesión del usuario.
     * 
     * <p>El método realiza las siguientes acciones:</p>
     * <ol>
     *   <li>Recupera la sesión HTTP actual del usuario</li>
     *   <li>Inválida la sesión si existe, eliminando todos los datos de sesión</li>
     *   <li>Redirige al usuario a la página principal (index.jsp)</li>
     * </ol>
     * 
     * @param request El objeto HttpServletRequest que contiene la solicitud del cliente
     * @param response El objeto HttpServletResponse que contiene la respuesta al cliente
     * @throws ServletException Si ocurre un error específico del servlet
     * @throws IOException Si ocurre un error de entrada/salida
     * 
     * @see HttpSession#invalidate()
     * @see HttpServletResponse#sendRedirect(String)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {       
        // Recuperar la sesión actual del usuario
        HttpSession session = request.getSession();  
        
        // Verificar si existe una sesión activa antes de intentar invalidarla
        if (session != null) {
            // Invalidar la sesión - esto elimina todos los atributos de sesión
            session.invalidate();
        }
        
        // Redireccionar a la página principal después del logout
        response.sendRedirect("index.jsp");
    }
}