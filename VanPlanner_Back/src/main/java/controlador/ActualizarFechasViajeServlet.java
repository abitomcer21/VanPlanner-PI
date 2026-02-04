package controlador;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import modelo.dao.JdbcConnection;

@WebServlet("/ActualizarFechasViajeServlet")
public class ActualizarFechasViajeServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        PrintWriter out = response.getWriter();
        Gson gson = new Gson();
        
        try {
            // Leer el cuerpo de la petición JSON
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            
            // Parsear el JSON
            JsonObject jsonObject = gson.fromJson(sb.toString(), JsonObject.class);
            
            int idViaje = jsonObject.get("id_viaje").getAsInt();
            
            // Verificar si se están actualizando fechas o distancia
            boolean actualizarFechas = jsonObject.has("fecha_inicio") && jsonObject.has("fecha_fin");
            boolean actualizarDistancia = jsonObject.has("distancia_total");
            
            String sql;
            PreparedStatement preparedStatement;
            Connection connection = JdbcConnection.getConnection();
            
            if (actualizarFechas && actualizarDistancia) {
                // Actualizar fechas y distancia
                String fechaInicio = jsonObject.get("fecha_inicio").getAsString();
                String fechaFin = jsonObject.get("fecha_fin").getAsString();
                double distanciaTotal = jsonObject.get("distancia_total").getAsDouble();
                
                sql = "UPDATE viajes SET fecha_inicio = ?, fecha_fin = ?, distancia_total = ? WHERE id_viaje = ?";
                preparedStatement = connection.prepareStatement(sql);
                preparedStatement.setString(1, fechaInicio);
                preparedStatement.setString(2, fechaFin);
                preparedStatement.setDouble(3, distanciaTotal);
                preparedStatement.setInt(4, idViaje);
            } else if (actualizarFechas) {
                // Solo actualizar fechas
                String fechaInicio = jsonObject.get("fecha_inicio").getAsString();
                String fechaFin = jsonObject.get("fecha_fin").getAsString();
                
                sql = "UPDATE viajes SET fecha_inicio = ?, fecha_fin = ? WHERE id_viaje = ?";
                preparedStatement = connection.prepareStatement(sql);
                preparedStatement.setString(1, fechaInicio);
                preparedStatement.setString(2, fechaFin);
                preparedStatement.setInt(3, idViaje);
            } else if (actualizarDistancia) {
                // Solo actualizar distancia
                double distanciaTotal = jsonObject.get("distancia_total").getAsDouble();
                
                sql = "UPDATE viajes SET distancia_total = ? WHERE id_viaje = ?";
                preparedStatement = connection.prepareStatement(sql);
                preparedStatement.setDouble(1, distanciaTotal);
                preparedStatement.setInt(2, idViaje);
            } else {
                JsonObject respuesta = new JsonObject();
                respuesta.addProperty("success", false);
                respuesta.addProperty("message", "No se especificaron campos para actualizar");
                out.print(gson.toJson(respuesta));
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }
            
            int resultado = preparedStatement.executeUpdate();
            preparedStatement.close();
            
            if (resultado > 0) {
                JsonObject respuesta = new JsonObject();
                respuesta.addProperty("success", true);
                respuesta.addProperty("message", "Datos actualizados correctamente");
                out.print(gson.toJson(respuesta));
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                JsonObject respuesta = new JsonObject();
                respuesta.addProperty("success", false);
                respuesta.addProperty("message", "Error al actualizar los datos");
                out.print(gson.toJson(respuesta));
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
            JsonObject respuesta = new JsonObject();
            respuesta.addProperty("success", false);
            respuesta.addProperty("message", "Error de base de datos: " + e.getMessage());
            out.print(gson.toJson(respuesta));
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            e.printStackTrace();
            JsonObject respuesta = new JsonObject();
            respuesta.addProperty("success", false);
            respuesta.addProperty("message", "Error: " + e.getMessage());
            out.print(gson.toJson(respuesta));
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}
