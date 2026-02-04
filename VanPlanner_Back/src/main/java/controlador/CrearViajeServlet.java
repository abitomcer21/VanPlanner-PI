package controlador;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import modelo.dao.JdbcConnection;

@WebServlet("/CrearViajeServlet")
public class CrearViajeServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=UTF-8");
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
            Integer vehiculoId = jsonObject.has("vehiculo_id") && !jsonObject.get("vehiculo_id").isJsonNull() 
                ? jsonObject.get("vehiculo_id").getAsInt() 
                : null;
            String nombreViaje = jsonObject.get("nombre_viaje").getAsString();
            String descripcion = jsonObject.has("descripcion") ? jsonObject.get("descripcion").getAsString() : null;
            String origen = jsonObject.get("origen").getAsString();
            String destino = jsonObject.get("destino").getAsString();
            String fechaInicio = jsonObject.has("fecha_inicio") ? jsonObject.get("fecha_inicio").getAsString() : null;
            String fechaFin = jsonObject.has("fecha_fin") ? jsonObject.get("fecha_fin").getAsString() : null;
            
            // Logs para depuración
            System.out.println("Usuario ID: " + usuarioId);
            System.out.println("Vehículo ID: " + vehiculoId);
            System.out.println("Nombre viaje: " + nombreViaje);
            System.out.println("Descripción: " + descripcion);
            System.out.println("Origen: " + origen);
            System.out.println("Destino: " + destino);
            System.out.println("Fecha inicio: " + fechaInicio);
            System.out.println("Fecha fin: " + fechaFin);
            
            // Insertar en la base de datos
            String sql;
            if (fechaInicio != null && fechaFin != null) {
                sql = "INSERT INTO viajes (usuario_id, vehiculo_id, nombre_viaje, descripcion, origen, destino, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'planificando')";
            } else {
                sql = "INSERT INTO viajes (usuario_id, vehiculo_id, nombre_viaje, descripcion, origen, destino, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?, ?, CURDATE(), CURDATE(), 'planificando')";
            }
            
            Connection connection = JdbcConnection.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            
            preparedStatement.setInt(1, usuarioId);
            if (vehiculoId != null) {
                preparedStatement.setInt(2, vehiculoId);
            } else {
                preparedStatement.setNull(2, java.sql.Types.INTEGER);
            }
            preparedStatement.setString(3, nombreViaje);
            preparedStatement.setString(4, descripcion);
            preparedStatement.setString(5, origen);
            preparedStatement.setString(6, destino);
            
            if (fechaInicio != null && fechaFin != null) {
                preparedStatement.setString(7, fechaInicio);
                preparedStatement.setString(8, fechaFin);
            }
            
            int resultado = preparedStatement.executeUpdate();
            
            if (resultado > 0) {
                // Obtener el ID generado
                ResultSet rs = preparedStatement.getGeneratedKeys();
                int idViaje = 0;
                if (rs.next()) {
                    idViaje = rs.getInt(1);
                }
                rs.close();
                preparedStatement.close();
                
                // Añadir al creador como conductor principal en colaboradores
                String sqlColaborador = "INSERT INTO colaboradores (viaje_id, usuario_id, rol, estado, invitado_en) VALUES (?, ?, 'editor', 'aceptado', NOW())";
                preparedStatement = connection.prepareStatement(sqlColaborador);
                preparedStatement.setInt(1, idViaje);
                preparedStatement.setInt(2, usuarioId);
                preparedStatement.executeUpdate();
                preparedStatement.close();
                
                JsonObject respuesta = new JsonObject();
                respuesta.addProperty("success", true);
                respuesta.addProperty("message", "Viaje creado correctamente");
                respuesta.addProperty("id_viaje", idViaje);
                respuesta.addProperty("nombre_viaje", nombreViaje);
                out.print(gson.toJson(respuesta));
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                preparedStatement.close();
                JsonObject respuesta = new JsonObject();
                respuesta.addProperty("success", false);
                respuesta.addProperty("message", "Error al crear el viaje");
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
