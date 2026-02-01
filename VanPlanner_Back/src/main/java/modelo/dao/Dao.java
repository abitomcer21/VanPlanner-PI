package modelo.dao;

import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import modelo.Parada;
import modelo.Usuario;
import modelo.Vehiculo;
import modelo.Viaje;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * <p>Clase Singleton Dao. Implementa el acceso a la base de datos para ejecutar
 * las operaciones de inserci�n, modificaci�n y borrado de registros.</p>
 * <a href="#">Visita mi web para m�s informaci�n</a>
 * @version 1.0
 * @author Yo mismo
 */
public class Dao {
	// Instancia �nica de la clase Dao para poder aplicar el patr�n Singleton.
	private static Dao instance;
	
	// La conexi�n para la base de datos.
	private static Connection connection = null;
	
	// El statement.
	private static Statement statement;
	
	// El prepared statement.
	private static PreparedStatement preparedStatement;
	
	/*
	 * M�todo constructor privado.
	 * Permite implementar el patr�n Singleton.
	 */
	private Dao() {
		super();
	}
	
	/**
	 * M�todo sincronizado privado.
	 * Permite implementar el patr�n Singleton.
	 * Ver m�todos synchronized {@link docs.oracle.com/javase/tutorial/essential/concurrency/syncmeth.html}
	 * @since 1.0
	 */
    private synchronized static void crearInstancia() {
        if (instance == null) { 
        	instance = new Dao();
        }
    }
 
	/**
	 * Obtener la instancia de la clase Dao.
	 * @return instance La instancia �nica del objeto de la clase Dao.
	 * @since 1.0
	 */
    public static Dao getInstancia() {
        crearInstancia();

        return instance;
    } 

	/**
	 * Obtener el n�mero de registros almacenados en la tabla de usuarios.
	 * @return n El n�mero de registros almacenados en la tabla de usuarios.
	 * @since 1.0
	 * @throws java.sql.SQLException Si hay alg�n error al recuperar el n�mero de usuarios de la tabla de usuarios.
	 */
	public int getNumeroUsuarios() throws SQLException {
		int num = 0;

    	connection = JdbcConnection.getConnection();
        statement = connection.createStatement();
        ResultSet rs = statement.executeQuery("select count(*) as count from usuarios");
	        
        while(rs.next()) {
        	num = rs.getInt("count");
        }
	        	        
        connection.close();
        statement.close();	        
		
		return num;
	}
			
	/**
	 * Listar todos los registros de la tabla de usuarios.
	 * @return usuarios Lista de usuarios con los registros almacenados en la tabla de usuarios.
	 * @since 1.0
	 */
	public List<Usuario> getUsuarios(){
		List<Usuario> usuarios = new ArrayList<Usuario>();
        String sql = "select * from usuarios";
          
	    try {
	    	connection = JdbcConnection.getConnection();
	        statement = connection.createStatement();
	        ResultSet rs = statement.executeQuery(sql);	
	        
	        while(rs.next()){
	    		
	        }
	    } catch(Exception e){
	    	e.printStackTrace();
	    }
	    return usuarios;
	}

	/**
	 * Buscar un usuario por el identificador y la contrase�a.
	 * @param email El identificador del usuario.
	 * @param password La contrase�a del usuario.
	 * @return usuario El usuario encontrado en la base de datos, null en caso contrario.
	 * @since 1.0
	 */
	public Usuario loginUsuarioCorrecto(String email, String password){
		Usuario usuario = null;
        String sql = "select * from usuarios where email=? and contrasenya=?";
          
	    try{
    		preparedStatement = JdbcConnection.getConnection().prepareStatement(sql);
    	    preparedStatement.setString(1, email);				        	  
    	    preparedStatement.setString(2, password);    		
    		ResultSet rs = preparedStatement.executeQuery();
    		
    		 while(rs.next()) {
    			 usuario = new Usuario();
    			 usuario.setIdUsuario(rs.getInt("id_usuario"));
    			 usuario.setNombre(rs.getString("nombre"));
    			 usuario.setTipoUsuario(rs.getString("tipo_usuario"));
    			 usuario.setActivo(rs.getBoolean("activo"));
    			 usuario.setAceptaTerminos(rs.getBoolean("acepta_terminos"));
    		 }
	    }catch(SQLException e){
	    	e.printStackTrace();	    	
	    }
	    
	    return usuario;
	}
	
	/**
	 * Insertar un nuevo usuario en la base de datos
	 * @param usuario El usuario a a�adir en la tabla de usuarios.			        
	 * @return 1 Si la actualizaci�n se ha realizado correctamente, 0 si no hay actualizaciones pendientes de realizar.
	 * @see modelo.bean.Usuario
	 * @since 1.0
	 */
	public int anyadirUsuario(Usuario usuario){
 		String sql = "insert into usuarios (username, nombre, apellidos, ciudad, fecha_nacimiento, sexo, email, contrasenya, tipo_usuario, acepta_terminos, activo) values (?,?,?,?,?,?,?,?,?,?,?);";
    	try {
    		preparedStatement = JdbcConnection.getConnection().prepareStatement(sql);
    		preparedStatement.setString(1, usuario.getNombreUsuario());
    	    preparedStatement.setString(2, usuario.getNombre());				        	  
    	    preparedStatement.setString(3, usuario.getApellidos());
    	    preparedStatement.setString(4, usuario.getCiudad());
    	    preparedStatement.setDate(5, new Date(usuario.getFechaNacimiento().getTime()));
    	    preparedStatement.setString(6, usuario.getSexo());
    	    preparedStatement.setString(7, usuario.getEmail());
    	    preparedStatement.setString(8, usuario.getContrasenya());
    	    preparedStatement.setString(9, "user");
    	    preparedStatement.setBoolean(10, usuario.isAceptaTerminos());
    	    preparedStatement.setBoolean(11, true);
    	    preparedStatement.executeUpdate();
    	    preparedStatement.close();
		} catch (SQLException e) {
			e.printStackTrace();
			return 1;
		}
     	return 0;	    
	}
	
	public int anyadirParada(Parada parada){
 		String sql = "insert into paradas (viaje_id, nombre_lugar, direccion, latitud, longitud, tipo) values (?,?,?,?,?,?);";
    	try {
    		preparedStatement = JdbcConnection.getConnection().prepareStatement(sql);
    		preparedStatement.setInt(1, 1);
    	    preparedStatement.setString(2, parada.getNombre());				        	  
    	    preparedStatement.setString(3, parada.getDireccion());
    	    preparedStatement.setFloat(4, parada.getLat());
    	    preparedStatement.setFloat(5, parada.getLng());
    	    preparedStatement.setString(6, parada.getTipo());
    	    preparedStatement.executeUpdate();
    	    preparedStatement.close();
		} catch (SQLException e) {
			e.printStackTrace();
			return 1;
		}
     	return 0;	    
	}
	
	public ArrayList <Viaje> obtenerViajesUsuario(int usuario){
		String sql = "v=?";
		
		ArrayList <Viaje> viajesUsuario = new ArrayList();
        
	    try{
    		preparedStatement = JdbcConnection.getConnection().prepareStatement(sql);
    	    preparedStatement.setInt(1, usuario);  
    	    
    		ResultSet rs = preparedStatement.executeQuery();
    		
    		
    		 while(rs.next()) {
    			 
    			 Viaje viaje = new Viaje();
    			 
    			 viaje.setUsuario_id(usuario);
    			 viaje.setVehiculo_id(rs.getInt("vehiculo_id"));
    			 viaje.setNombre_viaje(rs.getString("nombre_viaje"));
    			 viaje.setDescripcion(rs.getString("descripcion"));
    			 viaje.setOrigen(rs.getString("origen"));
    			 viaje.setDestino(rs.getString("destino"));
    			 viaje.setFecha_inicio(rs.getDate("fecha_inicio"));
    			 viaje.setFecha_fin(rs.getDate("fecha_fin"));
    			 viaje.setDistancia_total(rs.getFloat("distancia_total"));
    			 viaje.setPresupuesto_estimado(rs.getFloat("presupuesto_estimado"));
    			 viaje.setPresupuesto_real(rs.getFloat("presupuesto_real"));
    			 viaje.setEstado(rs.getString("estado"));
    			 
    		 }
    		 
	    }catch(SQLException e){
	    	e.printStackTrace();	    	
	    }    
	    
	    return viajesUsuario;
	}
	
	/**
	 * Obtener todos los vehículos de la base de datos.
	 * @return vehiculos Lista de vehículos con los registros almacenados en la tabla de vehiculos.
	 * @since 1.0
	 */
	public ArrayList<Vehiculo> obtenerVehiculos(){
		ArrayList<Vehiculo> vehiculos = new ArrayList();
		String sql = "select * from vehiculos";
		
		try{
			preparedStatement = JdbcConnection.getConnection().prepareStatement(sql);
			ResultSet rs = preparedStatement.executeQuery();
			
			while(rs.next()) {
				Vehiculo vehiculo = new Vehiculo();
				vehiculo.setId_vehiculo(rs.getInt("id_vehiculo"));
				vehiculo.setMatricula(rs.getString("matricula"));
				vehiculo.setMarca(rs.getString("marca"));
				vehiculo.setModelo(rs.getString("modelo"));
				vehiculo.setAnyo(rs.getInt("anyo"));
				vehiculo.setTipo_combustible(rs.getString("tipo_combustible"));
				vehiculo.setConsumo_medio(rs.getFloat("consumo_medio"));
				vehiculo.setCapacidad_pasajeros(rs.getInt("capacidad_pasajeros"));
				vehiculo.setCapacidad_carga(rs.getInt("capacidad_carga"));
				vehiculos.add(vehiculo);
			}
			preparedStatement.close();
		}catch(SQLException e){
			e.printStackTrace();
		}
		
		return vehiculos;
	}
