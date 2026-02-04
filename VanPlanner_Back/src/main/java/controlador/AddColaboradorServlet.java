package controlador;

import java.io.BufferedReader;
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

/**
 * Servlet implementación clase AddColaboradorServlet
 */
@WebServlet("/AddColaboradorServlet")
public class AddColaboradorServlet extends HttpServlet {
    
    /**
     * Identificador único de versión para la serialización.
     */
    private static final long serialVersionUID = 1L;
    
    /**
     * Maneja las solicitudes HTTP POST para añadir colaborador.
     * 
     * @param request La solicitud HTTP
     * @param response La respuesta HTTP
     * @throws ServletException Si ocurre un error del servlet
     * @throws IOException Si ocurre un error de E/S
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        PrintWriter out = response.getWriter();
        Gson gson = new Gson();
        JsonObject jsonResponse = new JsonObject();
        
        try {
            // Leer el JSON del cuerpo de la petición
            BufferedReader reader = request.getReader();
            JsonObject jsonRequest = gson.fromJson(reader, JsonObject.class);
            
            int idViaje = jsonRequest.get("id_viaje").getAsInt();
            String emailColaborador = jsonRequest.get("email_colaborador").getAsString();
            
            Dao instanciaDao = Dao.getInstancia();
            
            String resultado = instanciaDao.addColaboradorViaje(idViaje, emailColaborador);
            
            if (resultado.equals("OK")) {
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "Colaborador añadido correctamente");
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", resultado);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error en el servidor: " + e.getMessage());
        }
        
        out.print(gson.toJson(jsonResponse));
        out.flush();
    }
}
