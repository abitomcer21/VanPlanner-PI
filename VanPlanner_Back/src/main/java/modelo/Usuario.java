package modelo;

import java.util.Date;

/**
 * Clase que representa a un usuario del sistema.
 * Contiene todos los atributos necesarios para la gestión de usuarios,
 * incluyendo información personal y datos de cuenta.
 */
public class Usuario {
    private int idUsuario;
    private String nombreUsuario;
    private String nombre;
    private String apellidos;
    private String username;
    private String email;
    private String contrasenya;
    private String ciudad;
    private Date fechaNacimiento;
    private String sexo;
    private String tipoUsuario;
    private boolean activo;
    private boolean aceptaTerminos;
    
    /**
     * Constructor por defecto de Usuario.
     * Inicializa el tipo de usuario como "user" por defecto.
     */
    public Usuario() {
        this.tipoUsuario = "user"; 
    }
    
    /**
     * Constructor completo con todos los parámetros.
     * 
     * @param idUsuario Identificador único del usuario
     * @param nombreUsuario Nombre de usuario (nickname)
     * @param nombre Nombre real del usuario
     * @param apellidos Apellidos del usuario
     * @param username Nombre de usuario para login
     * @param email Correo electrónico del usuario
     * @param contrasenya Contraseña del usuario
     * @param ciudad Ciudad de residencia del usuario
     * @param fechaNacimiento Fecha de nacimiento del usuario
     * @param sexo Sexo del usuario
     * @param tipoUsuario Tipo de usuario (user/admin)
     * @param activo Indica si la cuenta está activa
     * @param aceptaTerminos Indica si aceptó los términos y condiciones
     */
    public Usuario(int idUsuario, String nombreUsuario, String nombre, String apellidos, String username, 
                   String email, String contrasenya, String ciudad, Date fechaNacimiento, 
                    String sexo, String tipoUsuario, 
                   boolean activo, boolean aceptaTerminos) {
        this.idUsuario = idUsuario;
        this.nombreUsuario = nombreUsuario;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.username = username;
        this.email = email;
        this.contrasenya = contrasenya;
        this.ciudad = ciudad;
        this.fechaNacimiento = fechaNacimiento;
        this.sexo = sexo;
        this.tipoUsuario = (tipoUsuario != null) ? tipoUsuario : "user";
        this.activo = activo;
        this.aceptaTerminos = aceptaTerminos;
    }
    
    // Getters y Setters
    
    /**
     * Obtiene el ID del usuario.
     * 
     * @return El identificador único del usuario
     */
    public int getIdUsuario() {
        return idUsuario;
    }
    
    /**
     * Establece el ID del usuario.
     * 
     * @param idUsuario El identificador único del usuario
     */
    public void setIdUsuario(int idUsuario) {
        this.idUsuario = idUsuario;
    }
    
    /**
     * Obtiene el nombre de usuario (nickname).
     * 
     * @return El nombre de usuario
     */
    public String getNombreUsuario() {
        return nombreUsuario;
    }
    
    /**
     * Establece el nombre de usuario (nickname).
     * 
     * @param nombreUsuario El nombre de usuario
     */
    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }
    
    /**
     * Obtiene el nombre real del usuario.
     * 
     * @return El nombre del usuario
     */
    public String getNombre() {
        return nombre;
    }
    
    /**
     * Establece el nombre real del usuario.
     * 
     * @param nombre El nombre del usuario
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    /**
     * Obtiene los apellidos del usuario.
     * 
     * @return Los apellidos del usuario
     */
    public String getApellidos() {
        return apellidos;
    }
    
    /**
     * Establece los apellidos del usuario.
     * 
     * @param apellidos Los apellidos del usuario
     */
    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }
    
    /**
     * Obtiene el username para login.
     * 
     * @return El username del usuario
     */
    public String getUsername() {
        return username;
    }
    
    /**
     * Establece el username para login.
     * 
     * @param username El username del usuario
     */
    public void setUsername(String username) {
        this.username = username;
    }
    
    /**
     * Obtiene el email del usuario.
     * 
     * @return El email del usuario
     */
    public String getEmail() {
        return email;
    }
    
    /**
     * Establece el email del usuario.
     * 
     * @param email El email del usuario
     */
    public void setEmail(String email) {
        this.email = email;
    }
    
    /**
     * Obtiene la contraseña del usuario.
     * 
     * @return La contraseña del usuario
     */
    public String getContrasenya() {
        return contrasenya;
    }
    
    /**
     * Establece la contraseña del usuario.
     * 
     * @param contrasenya La contraseña del usuario
     */
    public void setContrasenya(String contrasenya) {
        this.contrasenya = contrasenya;
    }
    
    /**
     * Obtiene la ciudad del usuario.
     * 
     * @return La ciudad del usuario
     */
    public String getCiudad() {
        return ciudad;
    }
    
    /**
     * Establece la ciudad del usuario.
     * 
     * @param ciudad La ciudad del usuario
     */
    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }
    
    /**
     * Obtiene la fecha de nacimiento del usuario.
     * 
     * @return La fecha de nacimiento del usuario
     */
    public Date getFechaNacimiento() {
        return fechaNacimiento;
    }
    
    /**
     * Establece la fecha de nacimiento del usuario.
     * 
     * @param fechaNacimiento La fecha de nacimiento del usuario
     */
    public void setFechaNacimiento(Date fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }
        
    /**
     * Obtiene el sexo del usuario.
     * 
     * @return El sexo del usuario
     */
    public String getSexo() {
        return sexo;
    }
    
    /**
     * Establece el sexo del usuario.
     * 
     * @param sexo El sexo del usuario
     */
    public void setSexo(String sexo) {
        this.sexo = sexo;
    }
    
    /**
     * Obtiene el tipo de usuario.
     * 
     * @return El tipo de usuario (user/admin)
     */
    public String getTipoUsuario() {
        return tipoUsuario;
    }
    
    /**
     * Establece el tipo de usuario.
     * Si se proporciona null, se establece como "user" por defecto.
     * 
     * @param tipoUsuario El tipo de usuario (user/admin)
     */
    public void setTipoUsuario(String tipoUsuario) {
        this.tipoUsuario = (tipoUsuario != null) ? tipoUsuario : "user";
    }
    
    /**
     * Verifica si el usuario está activo.
     * 
     * @return true si el usuario está activo, false en caso contrario
     */
    public boolean isActivo() {
        return activo;
    }
    
    /**
     * Establece el estado activo del usuario.
     * 
     * @param activo true para activar la cuenta, false para desactivarla
     */
    public void setActivo(boolean activo) {
        this.activo = activo;
    }
    
    /**
     * Verifica si el usuario aceptó los términos y condiciones.
     * 
     * @return true si aceptó los términos, false en caso contrario
     */
    public boolean isAceptaTerminos() {
        return aceptaTerminos;
    }
    
    /**
     * Establece la aceptación de términos y condiciones.
     * 
     * @param aceptaTerminos true si acepta los términos, false en caso contrario
     */
    public void setAceptaTerminos(boolean aceptaTerminos) {
        this.aceptaTerminos = aceptaTerminos;
    }
    
    /**
     * Devuelve una representación en cadena del objeto Usuario.
     * 
     * @return Cadena que representa al usuario con sus principales atributos
     */
    @Override
    public String toString() {
        return "Usuario{" +
                "id_usuario=" + idUsuario +
                ", nombre='" + nombre + '\'' +
                ", apellidos='" + apellidos + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", ciudad='" + ciudad + '\'' +
                ", tipo_usuario='" + tipoUsuario + '\'' +
                ", activo=" + activo +
                '}';
    }
}