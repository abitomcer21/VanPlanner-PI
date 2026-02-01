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

import modelo.Parada;
import modelo.dao.Dao;
import utils.ControllerUtils;

@SuppressWarnings("serial")

@WebServlet("/AddParadaServlet")
public class AddParadaServlet extends HttpServlet {
	
	/**
     * @param request La solicitud HTTP del cliente
     * @param response La respuesta HTTP al cliente
     * @throws ServletException Si ocurre un error en el servlet
     * @throws IOException Si ocurre un error de entrada/salida
     */
    
    // GET: Muestra el formulario vacío para crear usuario
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
    	System.out.println("Entra");
    }
    
    /**
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
        	Parada parada = gson.fromJson(json, modelo.Parada.class);
                        
            // 4. Obtener el Dao y llamar al método INSERT
            Dao dao = Dao.getInstancia();
            int resultado = dao.anyadirParada(parada);
            
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