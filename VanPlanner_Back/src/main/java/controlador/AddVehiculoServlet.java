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

@WebServlet("/AddVehiculoServlet")
public class AddVehiculoServlet extends HttpServlet {
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
            
            int usuarioId = jsonObject.get("usuario_id").getAsInt();
            String nombreVehiculo = jsonObject.get("nombre_vehiculo").getAsString();
            String marcaModelo = jsonObject.get("marca_modelo").getAsString();
            double consumo = jsonObject.get("consumo").getAsDouble();
            String tipoCombustible = jsonObject.get("tipo_combustible").getAsString();
            int capacidadTanque = jsonObject.get("capacidad_tanque").getAsInt();
            
            // Insertar en la base de datos
            String sql = "INSERT INTO vehiculos (usuario_id, nombre_vehiculo, marca_modelo, consumo, tipo_combustible, capacidad_tanque) VALUES (?, ?, ?, ?, ?, ?)";
            
            Connection connection = JdbcConnection.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            
            preparedStatement.setInt(1, usuarioId);
            preparedStatement.setString(2, nombreVehiculo);
            preparedStatement.setString(3, marcaModelo);
            preparedStatement.setDouble(4, consumo);
            preparedStatement.setString(5, tipoCombustible);
            preparedStatement.setInt(6, capacidadTanque);
            
            int resultado = preparedStatement.executeUpdate();
            preparedStatement.close();
            
            if (resultado > 0) {
                JsonObject respuesta = new JsonObject();
                respuesta.addProperty("success", true);
                respuesta.addProperty("message", "Vehículo añadido correctamente");
                out.print(gson.toJson(respuesta));
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                JsonObject respuesta = new JsonObject();
                respuesta.addProperty("success", false);
                respuesta.addProperty("message", "Error al añadir el vehículo");
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
