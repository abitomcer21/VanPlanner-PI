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
 * @version 1.0
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
	    		Usuario usuario = new Usuario();
	    		usuario.setIdUsuario(rs.getInt("id_usuario"));
	    		usuario.setNombreUsuario(rs.getString("username"));
	    		usuario.setNombre(rs.getString("nombre"));
	    		usuario.setApellidos(rs.getString("apellidos"));
	    		usuario.setCiudad(rs.getString("ciudad"));
	    		usuario.setFechaNacimiento(rs.getDate("fecha_nacimiento"));
	    		usuario.setSexo(rs.getString("sexo"));
	    		usuario.setEmail(rs.getString("email"));
	    		usuario.setTipoUsuario(rs.getString("tipo_usuario"));
	    		usuario.setActivo(rs.getBoolean("activo"));
	    		usuario.setAceptaTerminos(rs.getBoolean("acepta_terminos"));
	    		usuarios.add(usuario);
	        }
	        rs.close();
	        statement.close();
	        connection.close();
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
		String sql = "select * from usuarios where email=? and contrasenya=? and activo=1";
          
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
	 * Obtener un usuario por su ID desde la base de datos.
	 * @param idUsuario El ID del usuario a buscar.
	 * @return usuario El usuario encontrado, null en caso contrario.
	 * @since 1.0
	 */
	public Usuario obtenerUsuarioPorId(int idUsuario) {
		Usuario usuario = null;
        String sql = "select * from usuarios where id_usuario=?";
          
	    try {
    		preparedStatement = JdbcConnection.getConnection().prepareStatement(sql);
    	    preparedStatement.setInt(1, idUsuario);
    		ResultSet rs = preparedStatement.executeQuery();
    		
    		if(rs.next()) {
   			 	usuario = new Usuario();
   			 	usuario.setIdUsuario(rs.getInt("id_usuario"));
   			 	usuario.setNombreUsuario(rs.getString("username"));
   			 	usuario.setNombre(rs.getString("nombre"));
   			 	usuario.setApellidos(rs.getString("apellidos"));
   			 	usuario.setCiudad(rs.getString("ciudad"));
   			 	usuario.setFechaNacimiento(rs.getDate("fecha_nacimiento"));
   			 	usuario.setSexo(rs.getString("sexo"));
   			 	usuario.setEmail(rs.getString("email"));
   			 	usuario.setTipoUsuario(rs.getString("tipo_usuario"));
   			 	usuario.setActivo(rs.getBoolean("activo"));
   			 	usuario.setAceptaTerminos(rs.getBoolean("acepta_terminos"));
    		}
    		rs.close();
    		preparedStatement.close();
	    } catch(SQLException e) {
	    	e.printStackTrace();	    	
	    }
	    
	    return usuario;
	}
	
	/**
	 * Actualizar un usuario existente en la base de datos.
	 * @param usuario El usuario con los datos actualizados.
	 * @return 0 Si la actualización se ha realizado correctamente, 1 en caso de error.
	 * @since 1.0
	 */
	public int actualizarUsuario(Usuario usuario) {
		String sql = "update usuarios set username=?, nombre=?, apellidos=?, ciudad=?, fecha_nacimiento=?, sexo=?, email=?, tipo_usuario=?, activo=? where id_usuario=?";
		try {
			preparedStatement = JdbcConnection.getConnection().prepareStatement(sql);
			preparedStatement.setString(1, usuario.getNombreUsuario());
			preparedStatement.setString(2, usuario.getNombre());
			preparedStatement.setString(3, usuario.getApellidos());
			// ciudad
			if (usuario.getCiudad() != null) {
				preparedStatement.setString(4, usuario.getCiudad());
			} else {
				preparedStatement.setNull(4, java.sql.Types.VARCHAR);
			}
			// fechaNacimiento (evitar NullPointerException)
			java.util.Date fechaNac = usuario.getFechaNacimiento();
			System.out.println("[Dao.actualizarUsuario] fechaNacimiento: " + fechaNac);
			if (fechaNac != null) {
				preparedStatement.setDate(5, new Date(fechaNac.getTime()));
			} else {
				preparedStatement.setNull(5, java.sql.Types.DATE);
			}
			// sexo
			if (usuario.getSexo() != null) {
				preparedStatement.setString(6, usuario.getSexo());
			} else {
				preparedStatement.setNull(6, java.sql.Types.VARCHAR);
			}
			preparedStatement.setString(7, usuario.getEmail());
			preparedStatement.setString(8, usuario.getTipoUsuario());
			preparedStatement.setBoolean(9, usuario.isActivo());
			preparedStatement.setInt(10, usuario.getIdUsuario());
			preparedStatement.executeUpdate();
			preparedStatement.close();
		} catch (SQLException e) {
			e.printStackTrace();
			return 1;
		}
		return 0;
	}
	
	/**
	 * Elimina a un usuario de la base de datos
	 * @param idUsuario El ID del usuario a desactivar.
	 * @return 0 Si la operación se ha realizado correctamente, 1 en caso de error.
	 * @since 1.0
	 */
	public int eliminarUsuario(int idUsuario) {
		String sql = "DELETE FROM usuarios WHERE id_usuario=?";
		try {
			preparedStatement = JdbcConnection.getConnection().prepareStatement(sql);
			preparedStatement.setInt(1, idUsuario);
			preparedStatement.executeUpdate();
			preparedStatement.close();
		} catch (SQLException e) {
			e.printStackTrace();
			return 1;
		}
		return 0;
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
	/**
	 * Obtener todos los vehículos de un usuario desde la base de datos
	 * @param usuarioId El ID del usuario
	 * @return Lista de vehículos del usuario
	 * @since 1.0
	 */
	public ArrayList<modelo.Vehiculo> obtenerVehiculos(int usuarioId) {
		ArrayList<modelo.Vehiculo> vehiculos = new ArrayList<>();
		String sql = "SELECT * FROM vehiculos WHERE usuario_id = ?";
		
		try {
			preparedStatement = JdbcConnection.getConnection().prepareStatement(sql);
			preparedStatement.setInt(1, usuarioId);
			ResultSet rs = preparedStatement.executeQuery();
			
			while (rs.next()) {
				modelo.Vehiculo vehiculo = new modelo.Vehiculo();
				vehiculo.setId_vehiculo(rs.getInt("id_vehiculo"));
				vehiculo.setMatricula(rs.getString("nombre_vehiculo"));
				vehiculo.setMarca(rs.getString("marca_modelo"));
				vehiculo.setTipo_combustible(rs.getString("tipo_combustible"));
				vehiculo.setConsumo_medio(rs.getFloat("consumo"));
				vehiculo.setCapacidad_carga(rs.getInt("capacidad_tanque"));
				vehiculos.add(vehiculo);
			}
			
			rs.close();
			preparedStatement.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return vehiculos;
	}
	
	/**
	 * Añadir una nueva parada a un viaje en la base de datos
	 * @param parada La parada a añadir
	 * @return 0 Si la inserción se ha realizado correctamente, 1 en caso de error.
	 * @since 1.0
	 */
	public int anyadirParada(modelo.Parada parada) {
		String sql = "INSERT INTO paradas (viaje_id, orden_secuencia, nombre_lugar, direccion, latitud, longitud, tipo, hora_estimada_llegada, hora_estimada_salida, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		
		try {
			// Obtener el siguiente orden_secuencia disponible para este viaje
			String sqlMaxOrden = "SELECT COALESCE(MAX(orden_secuencia), 0) + 1 AS siguiente_orden FROM paradas WHERE viaje_id = ?";
			PreparedStatement psMaxOrden = JdbcConnection.getConnection().prepareStatement(sqlMaxOrden);
			psMaxOrden.setInt(1, parada.getViaje_id());
			ResultSet rs = psMaxOrden.executeQuery();
			
			int siguienteOrden = 1;
			if (rs.next()) {
				siguienteOrden = rs.getInt("siguiente_orden");
			}
			rs.close();
			psMaxOrden.close();
			
			// Usar el orden calculado en lugar del que viene del frontend
			preparedStatement = JdbcConnection.getConnection().prepareStatement(sql);
			preparedStatement.setInt(1, parada.getViaje_id());
			preparedStatement.setInt(2, siguienteOrden);  // Usar el orden calculado
			preparedStatement.setString(3, parada.getNombre_lugar());
			preparedStatement.setString(4, parada.getDireccion());
			preparedStatement.setFloat(5, parada.getLatitud());
			preparedStatement.setFloat(6, parada.getLongitud());
			preparedStatement.setString(7, parada.getTipo());
			
			// Convertir String a Time para las horas
			if (parada.getHora_estimada_llegada() != null && !parada.getHora_estimada_llegada().isEmpty()) {
				preparedStatement.setTime(8, java.sql.Time.valueOf(parada.getHora_estimada_llegada()));
			} else {
				preparedStatement.setNull(8, java.sql.Types.TIME);
			}
			
			if (parada.getHora_estimada_salida() != null && !parada.getHora_estimada_salida().isEmpty()) {
				preparedStatement.setTime(9, java.sql.Time.valueOf(parada.getHora_estimada_salida()));
			} else {
				preparedStatement.setNull(9, java.sql.Types.TIME);
			}
			
			preparedStatement.setString(10, parada.getNotas());
			preparedStatement.executeUpdate();
			preparedStatement.close();
		} catch (SQLException e) {
			e.printStackTrace();
			return 1;
		}
		return 0;
	}
	
	/**
	 * Obtener todos los viajes de un usuario desde la base de datos
	 * @param usuarioId El ID del usuario
	 * @return Lista de viajes del usuario
	 * @since 1.0
	 */
	public ArrayList<modelo.Viaje> obtenerViajesUsuario(int usuarioId) {
		ArrayList<modelo.Viaje> viajes = new ArrayList<>();
		String sql = "SELECT * FROM viajes WHERE usuario_id = ?";
		
		try {
			preparedStatement = JdbcConnection.getConnection().prepareStatement(sql);
			preparedStatement.setInt(1, usuarioId);
			ResultSet rs = preparedStatement.executeQuery();
			
			while (rs.next()) {
				modelo.Viaje viaje = new modelo.Viaje();
				viaje.setId_viaje(rs.getInt("id_viaje"));
				viaje.setUsuario_id(rs.getInt("usuario_id"));
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
				viajes.add(viaje);
			}
			
			rs.close();
			preparedStatement.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return viajes;
	}
	
	/**
	 * Obtener un viaje específico por su ID desde la base de datos
	 * @param idViaje El ID del viaje
	 * @return El viaje encontrado o null si no existe
	 * @since 1.0
	 */
	public modelo.Viaje obtenerViajePorId(int idViaje) {
		modelo.Viaje viaje = null;
		String sql = "SELECT * FROM viajes WHERE id_viaje = ?";
		
		try {
			preparedStatement = JdbcConnection.getConnection().prepareStatement(sql);
			preparedStatement.setInt(1, idViaje);
			ResultSet rs = preparedStatement.executeQuery();
			
			if (rs.next()) {
				viaje = new modelo.Viaje();
				viaje.setId_viaje(rs.getInt("id_viaje"));
				viaje.setUsuario_id(rs.getInt("usuario_id"));
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
			
			rs.close();
			preparedStatement.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return viaje;
	}
	
	/**
	 * Añade un colaborador a un viaje.
	 * 
	 * @param idViaje El ID del viaje
	 * @param emailColaborador El email del colaborador a añadir
	 * @return "OK" si se añadió correctamente, mensaje de error en caso contrario
	 */
	public String addColaboradorViaje(int idViaje, String emailColaborador) {
		
		try {
			connection = JdbcConnection.getConnection();
			
			// Primero buscar el usuario por email
			String sqlBuscar = "SELECT id_usuario FROM usuarios WHERE email = ?";
			preparedStatement = connection.prepareStatement(sqlBuscar);
			preparedStatement.setString(1, emailColaborador);
			ResultSet rs = preparedStatement.executeQuery();
			
			if (rs.next()) {
				int idUsuario = rs.getInt("id_usuario");
				rs.close();
				preparedStatement.close();
				
				// Verificar si ya es colaborador
				String sqlVerificar = "SELECT COUNT(*) as total FROM colaboradores WHERE viaje_id = ? AND usuario_id = ?";
				preparedStatement = connection.prepareStatement(sqlVerificar);
				preparedStatement.setInt(1, idViaje);
				preparedStatement.setInt(2, idUsuario);
				rs = preparedStatement.executeQuery();
				
				if (rs.next() && rs.getInt("total") > 0) {
					rs.close();
					preparedStatement.close();
					return "Este usuario ya es colaborador del viaje";
				}
				
				rs.close();
				preparedStatement.close();
				
				// Insertar en la tabla colaboradores
				String sqlInsertar = "INSERT INTO colaboradores (viaje_id, usuario_id, rol, estado, invitado_en) VALUES (?, ?, 'editor', 'aceptado', NOW())";
				preparedStatement = connection.prepareStatement(sqlInsertar);
				preparedStatement.setInt(1, idViaje);
				preparedStatement.setInt(2, idUsuario);
				
				int rowsAffected = preparedStatement.executeUpdate();
				preparedStatement.close();
				
				if (rowsAffected > 0) {
					return "OK";
				} else {
					return "Error al insertar en la base de datos";
				}
				
			} else {
				rs.close();
				preparedStatement.close();
				return "No existe ningún usuario con ese email";
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
			return "Error en la base de datos: " + e.getMessage();
		}
	}
	
	/**
	 * Eliminar un viaje de la base de datos
	 * @param idViaje El ID del viaje a eliminar
	 * @return true si se eliminó correctamente, false en caso contrario
	 * @since 1.0
	 */
	public boolean eliminarViaje(int idViaje) {
		String sql = "DELETE FROM viajes WHERE id_viaje = ?";
		
		try {
			connection = JdbcConnection.getConnection();
			preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setInt(1, idViaje);
			
			int rowsAffected = preparedStatement.executeUpdate();
			preparedStatement.close();
			
			return rowsAffected > 0;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}

	/**
	 * Añade un itinerario a un viaje
	 * @param itinerario El itinerario a añadir
	 * @return true si se añadió correctamente
	 */
	public boolean addItinerario(modelo.Itinerario itinerario) {
		boolean resultado = false;
		try {
			connection = JdbcConnection.getConnection();
			String sql = "INSERT INTO itinerarios (viaje_id, dia_numero, fecha, hora_inicio, hora_fin, actividad, ubicacion, notas, es_conduccion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
			preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setInt(1, itinerario.getViaje_id());
			preparedStatement.setInt(2, itinerario.getDia_numero());
			preparedStatement.setString(3, itinerario.getFecha());
			preparedStatement.setString(4, itinerario.getHora_inicio());
			preparedStatement.setString(5, itinerario.getHora_fin());
			preparedStatement.setString(6, itinerario.getActividad());
			preparedStatement.setString(7, itinerario.getUbicacion());
			preparedStatement.setString(8, itinerario.getNotas());
			preparedStatement.setBoolean(9, itinerario.isEs_conduccion());
			int rowsAffected = preparedStatement.executeUpdate();
			resultado = rowsAffected > 0;
			preparedStatement.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return resultado;
	}

	/**
	 * Obtiene todos los itinerarios de un viaje
	 * @param viajeId El ID del viaje
	 * @return Lista de itinerarios
	 */
	public java.util.List<modelo.Itinerario> obtenerItinerariosPorViaje(int viajeId) {
		java.util.List<modelo.Itinerario> itinerarios = new java.util.ArrayList<>();
		try {
			connection = JdbcConnection.getConnection();
			String sql = "SELECT * FROM itinerarios WHERE viaje_id = ? ORDER BY fecha, hora_inicio";
			preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setInt(1, viajeId);
			ResultSet rs = preparedStatement.executeQuery();
			
			while (rs.next()) {
				modelo.Itinerario itinerario = new modelo.Itinerario();
				itinerario.setId_itinerario(rs.getInt("id_itinerario"));
				itinerario.setViaje_id(rs.getInt("viaje_id"));
				itinerario.setDia_numero(rs.getInt("dia_numero"));
				itinerario.setFecha(rs.getString("fecha"));
				itinerario.setHora_inicio(rs.getString("hora_inicio"));
				itinerario.setHora_fin(rs.getString("hora_fin"));
				itinerario.setActividad(rs.getString("actividad"));
				itinerario.setUbicacion(rs.getString("ubicacion"));
				itinerario.setNotas(rs.getString("notas"));
				itinerario.setEs_conduccion(rs.getBoolean("es_conduccion"));
				Integer rutaId = rs.getInt("ruta_id");
				if (!rs.wasNull()) {
					itinerario.setRuta_id(rutaId);
				}
				itinerarios.add(itinerario);
			}
			rs.close();
			preparedStatement.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return itinerarios;
	}
	
	
	/**
	 * Obtener todos los recordatorios de un usuario desde la base de datos
	 * @param usuarioId El ID del usuario
	 * @return ArrayList de recordatorios del usuario
	 * @since 1.0
	 */
	public ArrayList<modelo.Recordatorio> obtenerRecordatoriosUsuario(int usuarioId) {
		ArrayList<modelo.Recordatorio> recordatorios = new ArrayList<>();
		String sql = "SELECT * FROM recordatorios WHERE usuario_id = ? ORDER BY completado ASC, fecha_creacion DESC";
		
		try {
			preparedStatement = JdbcConnection.getConnection().prepareStatement(sql);
			preparedStatement.setInt(1, usuarioId);
			ResultSet rs = preparedStatement.executeQuery();
			
			while (rs.next()) {
				modelo.Recordatorio recordatorio = new modelo.Recordatorio();
				recordatorio.setIdRecordatorio(rs.getInt("id_recordatorio"));
				recordatorio.setUsuarioId(rs.getInt("usuario_id"));
				recordatorio.setTexto(rs.getString("texto"));
				recordatorio.setCompletado(rs.getBoolean("completado"));
				recordatorio.setFechaCreacion(rs.getTimestamp("fecha_creacion"));
				recordatorio.setFechaActualizacion(rs.getTimestamp("fecha_actualizacion"));
				recordatorios.add(recordatorio);
			}
			
			rs.close();
			preparedStatement.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return recordatorios;
	}
	
	/**
	 * Añadir un nuevo recordatorio a la base de datos
	 * @param usuarioId El ID del usuario
	 * @param texto El texto del recordatorio
	 * @return El ID del recordatorio creado o -1 si falla
	 * @since 1.0
	 */
	public int addRecordatorio(int usuarioId, String texto) {
		int idRecordatorio = -1;
		String sql = "INSERT INTO recordatorios (usuario_id, texto, completado) VALUES (?, ?, 0)";
		
		System.out.println("=== Dao.addRecordatorio ===");
		System.out.println("usuarioId: " + usuarioId);
		System.out.println("texto: " + texto);
		
		try {
			preparedStatement = JdbcConnection.getConnection().prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
			preparedStatement.setInt(1, usuarioId);
			preparedStatement.setString(2, texto);
			
			System.out.println("Ejecutando SQL: " + sql);
			int rowsAffected = preparedStatement.executeUpdate();
			System.out.println("Rows affected: " + rowsAffected);
			
			if (rowsAffected > 0) {
				ResultSet rs = preparedStatement.getGeneratedKeys();
				if (rs.next()) {
					idRecordatorio = rs.getInt(1);
					System.out.println("ID generado: " + idRecordatorio);
				}
				rs.close();
			}
			
			preparedStatement.close();
		} catch (SQLException e) {
			System.err.println("Error SQL en addRecordatorio:");
			e.printStackTrace();
		}
		
		System.out.println("Retornando ID: " + idRecordatorio);
		return idRecordatorio;
	}
	
	/**
	 * Actualizar el estado de completado de un recordatorio
	 * @param idRecordatorio El ID del recordatorio
	 * @param completado El nuevo estado (true = completado, false = pendiente)
	 * @return true si se actualizó correctamente, false en caso contrario
	 * @since 1.0
	 */
	public boolean actualizarRecordatorio(int idRecordatorio, boolean completado) {
		String sql = "UPDATE recordatorios SET completado = ? WHERE id_recordatorio = ?";
		
		try {
			preparedStatement = JdbcConnection.getConnection().prepareStatement(sql);
			preparedStatement.setBoolean(1, completado);
			preparedStatement.setInt(2, idRecordatorio);
			
			int rowsAffected = preparedStatement.executeUpdate();
			preparedStatement.close();
			
			return rowsAffected > 0;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * Eliminar un recordatorio de la base de datos
	 * @param idRecordatorio El ID del recordatorio a eliminar
	 * @return true si se eliminó correctamente, false en caso contrario
	 * @since 1.0
	 */
	public boolean eliminarRecordatorio(int idRecordatorio) {
		String sql = "DELETE FROM recordatorios WHERE id_recordatorio = ?";
		
		try {
			preparedStatement = JdbcConnection.getConnection().prepareStatement(sql);
			preparedStatement.setInt(1, idRecordatorio);
			
			int rowsAffected = preparedStatement.executeUpdate();
			preparedStatement.close();
			
			return rowsAffected > 0;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * Contar el total de usuarios registrados en el sistema
	 * @return El número total de usuarios
	 * @since 1.0
	 */
	public int contarTotalUsuarios() {
		String sql = "SELECT COUNT(*) as total FROM usuarios";
		int total = 0;
		
		try {
			preparedStatement = JdbcConnection.getConnection().prepareStatement(sql);
			ResultSet rs = preparedStatement.executeQuery();
			
			if (rs.next()) {
				total = rs.getInt("total");
			}
			
			rs.close();
			preparedStatement.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return total;
	}
	
	/**
	 * Contar usuarios activos en el sistema
	 * @return El número de usuarios activos (que tienen viajes)
	 * @since 1.0
	 */
	public int contarUsuariosActivos() {
		String sql = "SELECT COUNT(DISTINCT usuario_id) as total FROM viajes";
		int total = 0;
		
		try {
			preparedStatement = JdbcConnection.getConnection().prepareStatement(sql);
			ResultSet rs = preparedStatement.executeQuery();
			
			if (rs.next()) {
				total = rs.getInt("total");
			}
			
			rs.close();
			preparedStatement.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return total;
	}
	
	/**
	 * Contar usuarios nuevos registrados hoy
	 * @return El número de usuarios registrados en el día actual
	 * @since 1.0
	 */
	public int contarUsuariosNuevosHoy() {
		String sql = "SELECT COUNT(*) as total FROM usuarios WHERE DATE(fecha_registro) = CURDATE()";
		int total = 0;
		
		try {
			preparedStatement = JdbcConnection.getConnection().prepareStatement(sql);
			ResultSet rs = preparedStatement.executeQuery();
			
			if (rs.next()) {
				total = rs.getInt("total");
			}
			
			rs.close();
			preparedStatement.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return total;
	}
}