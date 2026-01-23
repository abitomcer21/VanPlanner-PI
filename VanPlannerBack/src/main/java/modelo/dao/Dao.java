package modelo.dao;

import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import modelo.Usuario;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * <p>Clase Singleton Dao. Implementa el acceso a la base de datos para ejecutar
 * las operaciones de inserción, modificación y borrado de registros.</p>
 * <a href="#">Visita mi web para más información</a>
 * @version 1.0
 * @author Yo mismo
 */
public class Dao {
	// Instancia única de la clase Dao para poder aplicar el patrón Singleton.
	private static Dao instance;
	
	// La conexión para la base de datos.
	private static Connection connection = null;
	
	// El statement.
	private static Statement statement;
	
	// El prepared statement.
	private static PreparedStatement preparedStatement;
	
	/*
	 * Método constructor privado.
	 * Permite implementar el patrón Singleton.
	 */
	private Dao() {
		super();
	}
	
	/**
	 * Método sincronizado privado.
	 * Permite implementar el patrón Singleton.
	 * Ver métodos synchronized {@link docs.oracle.com/javase/tutorial/essential/concurrency/syncmeth.html}
	 * @since 1.0
	 */
    private synchronized static void crearInstancia() {
        if (instance == null) { 
        	instance = new Dao();
        }
    }
 
	/**
	 * Obtener la instancia de la clase Dao.
	 * @return instance La instancia única del objeto de la clase Dao.
	 * @since 1.0
	 */
    public static Dao getInstancia() {
        crearInstancia();

        return instance;
    } 

	/**
	 * Obtener el número de registros almacenados en la tabla de usuarios.
	 * @return n El número de registros almacenados en la tabla de usuarios.
	 * @since 1.0
	 * @throws java.sql.SQLException Si hay algún error al recuperar el número de usuarios de la tabla de usuarios.
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
	 * Buscar un usuario por el identificador y la contraseña.
	 * @param email El identificador del usuario.
	 * @param password La contraseña del usuario.
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
	 * @param usuario El usuario a añadir en la tabla de usuarios.			        
	 * @return 1 Si la actualización se ha realizado correctamente, 0 si no hay actualizaciones pendientes de realizar.
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
}
