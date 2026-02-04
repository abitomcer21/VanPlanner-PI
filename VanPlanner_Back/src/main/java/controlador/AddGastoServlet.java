package controlador;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import modelo.Gasto;
import modelo.dao.JdbcConnection;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@WebServlet("/AddGastoServlet")
public class AddGastoServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        Gson gson = new Gson();
        JsonObject jsonResponse = new JsonObject();

        System.out.println("=== DEBUG AddGastoServlet ===");

        try {
            // Leer datos JSON del request
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            
            System.out.println("JSON recibido: " + sb.toString());

            JsonObject jsonRequest = gson.fromJson(sb.toString(), JsonObject.class);

            // Extraer datos
            int viajeId = jsonRequest.get("viaje_id").getAsInt();
            int usuarioId = jsonRequest.get("usuario_id").getAsInt();
            String tipo = jsonRequest.get("tipo").getAsString();
            BigDecimal total = new BigDecimal(jsonRequest.get("total").getAsString());
            String descripcion = jsonRequest.get("descripcion").getAsString();
            
            System.out.println("Datos extraídos - Viaje ID: " + viajeId + ", Usuario ID: " + usuarioId + ", Tipo: " + tipo + ", Total: " + total);
            
            // Fecha actual por defecto
            Date fechaGasto = new Date(System.currentTimeMillis());
            if (jsonRequest.has("fecha_gasto") && !jsonRequest.get("fecha_gasto").isJsonNull()) {
                fechaGasto = Date.valueOf(jsonRequest.get("fecha_gasto").getAsString());
            }

            String lugar = null;
            if (jsonRequest.has("lugar") && !jsonRequest.get("lugar").isJsonNull()) {
                lugar = jsonRequest.get("lugar").getAsString();
            }

            // Mapear el tipo recibido del frontend al tipo de la BD
            String tipoBD = mapearTipoGasto(tipo);

            // Crear objeto Gasto
            Gasto gasto = new Gasto(viajeId, usuarioId, tipoBD, total, fechaGasto, descripcion);
            gasto.setLugar(lugar);

            // Insertar en BD
            Connection conn = null;
            PreparedStatement stmt = null;

            try {
                conn = JdbcConnection.getConnection();
                String sql = "INSERT INTO gastos (viaje_id, usuario_id, tipo, total, fecha_gasto, lugar, descripcion, estado) " +
                            "VALUES (?, ?, ?, ?, ?, ?, ?, 'realizado')";
                
                stmt = conn.prepareStatement(sql);
                stmt.setInt(1, gasto.getViajeId());
                stmt.setInt(2, gasto.getUsuarioId());
                stmt.setString(3, gasto.getTipo());
                stmt.setBigDecimal(4, gasto.getTotal());
                stmt.setDate(5, gasto.getFechaGasto());
                stmt.setString(6, gasto.getLugar());
                stmt.setString(7, gasto.getDescripcion());

                int rowsAffected = stmt.executeUpdate();
                
                System.out.println("Filas afectadas: " + rowsAffected);

                if (rowsAffected > 0) {
                    System.out.println("✓ Gasto insertado correctamente en BD");
                    jsonResponse.addProperty("success", true);
                    jsonResponse.addProperty("message", "Gasto añadido correctamente");
                    response.setStatus(HttpServletResponse.SC_OK);
                } else {
                    System.out.println("✗ No se insertó el gasto");
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "No se pudo añadir el gasto");
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                }

            } catch (SQLException e) {
                System.out.println("✗ Error SQL: " + e.getMessage());
                e.printStackTrace();
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Error al insertar en base de datos: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            } finally {
                try {
                    if (stmt != null) stmt.close();
                    if (conn != null) conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error al procesar la solicitud: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        }

        out.print(gson.toJson(jsonResponse));
        out.flush();
    }

    /**
     * Mapea los tipos de gasto del frontend a los valores ENUM de la base de datos
     */
    private String mapearTipoGasto(String tipoFrontend) {
        switch (tipoFrontend.toLowerCase()) {
            case "gasolina":
                return "combustible";
            case "hoteles":
                return "alojamiento";
            case "restaurantes":
                return "comida";
            default:
                return "otros";
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        JsonObject jsonResponse = new JsonObject();
        jsonResponse.addProperty("success", false);
        jsonResponse.addProperty("message", "Este endpoint solo acepta método POST. Envía los datos del gasto mediante POST.");
        jsonResponse.addProperty("endpoint", "/AddGastoServlet");
        jsonResponse.addProperty("method", "POST");
        
        response.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
        out.print(new Gson().toJson(jsonResponse));
        out.flush();
    }
}
