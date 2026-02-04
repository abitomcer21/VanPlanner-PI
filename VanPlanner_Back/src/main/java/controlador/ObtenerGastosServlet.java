package controlador;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import modelo.Gasto;
import modelo.dao.JdbcConnection;

/**
 * Servlet para obtener todos los gastos de un viaje específico
 */
@WebServlet("/ObtenerGastosServlet")
public class ObtenerGastosServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
        
        PrintWriter out = response.getWriter();
        
        String idViajeStr = request.getParameter("id_viaje");
        
        if (idViajeStr == null || idViajeStr.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"success\": false, \"message\": \"ID de viaje no proporcionado\"}");
            out.flush();
            return;
        }
        
        try {
            int idViaje = Integer.parseInt(idViajeStr);
            List<Gasto> gastos = obtenerGastosPorViaje(idViaje);
            
            Gson gson = new Gson();
            String jsonGastos = gson.toJson(gastos);
            
            out.print(jsonGastos);
            out.flush();
            
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"success\": false, \"message\": \"ID de viaje inválido\"}");
            out.flush();
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\": false, \"message\": \"Error al obtener gastos: " + e.getMessage() + "\"}");
            out.flush();
        }
    }
    
    private List<Gasto> obtenerGastosPorViaje(int idViaje) throws Exception {
        List<Gasto> gastos = new ArrayList<>();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = JdbcConnection.getConnection();
            
            String sql = "SELECT id_gasto, viaje_id, usuario_id, tipo, total, fecha_gasto, lugar, descripcion, estado " +
                         "FROM gastos WHERE viaje_id = ? ORDER BY fecha_gasto DESC";
            
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, idViaje);
            
            rs = stmt.executeQuery();
            
            while (rs.next()) {
                Gasto gasto = new Gasto();
                gasto.setIdGasto(rs.getInt("id_gasto"));
                gasto.setViajeId(rs.getInt("viaje_id"));
                gasto.setUsuarioId(rs.getInt("usuario_id"));
                gasto.setTipo(rs.getString("tipo"));
                gasto.setTotal(rs.getBigDecimal("total"));
                gasto.setFechaGasto(rs.getDate("fecha_gasto"));
                gasto.setLugar(rs.getString("lugar"));
                gasto.setDescripcion(rs.getString("descripcion"));
                gasto.setEstado(rs.getString("estado"));
                
                gastos.add(gasto);
            }
            
            System.out.println("Gastos obtenidos para viaje " + idViaje + ": " + gastos.size());
            
        } finally {
            if (rs != null) try { rs.close(); } catch (Exception e) { }
            if (stmt != null) try { stmt.close(); } catch (Exception e) { }
            if (conn != null) try { conn.close(); } catch (Exception e) { }
        }
        
        return gastos;
    }
    
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
