package modelo;

public class Parada {
	private int id_parada;
	private int viaje_id;
	private int orden_secuencia;
	private String nombre_lugar;
	private String direccion;
	private float latitud;
	private float longitud;
	private String tipo;
	private String hora_estimada_llegada;
	private String hora_estimada_salida;
	private String notas;
	
	public Parada() {
		super();
	}
	
	public Parada(int viaje_id, String nombre_lugar, String direccion, float latitud, float longitud, String tipo) {
		super();
		this.viaje_id = viaje_id;
		this.nombre_lugar = nombre_lugar;
		this.direccion = direccion;
		this.latitud = latitud;
		this.longitud = longitud;
		this.tipo = tipo;
	} 
	
	public int getId_parada() {
		return id_parada;
	}
	
	public void setId_parada(int id_parada) {
		this.id_parada = id_parada;
	}
	
	public int getViaje_id() {
		return viaje_id;
	}
	
	public void setViaje_id(int viaje_id) {
		this.viaje_id = viaje_id;
	}
	
	public int getOrden_secuencia() {
		return orden_secuencia;
	}
	
	public void setOrden_secuencia(int orden_secuencia) {
		this.orden_secuencia = orden_secuencia;
	}
	
	public String getNombre_lugar() {
		return nombre_lugar;
	}
	
	public void setNombre_lugar(String nombre_lugar) {
		this.nombre_lugar = nombre_lugar;
	}
	
	public String getDireccion() {
		return direccion;
	}
	
	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}
	
	public float getLatitud() {
		return latitud;
	}
	
	public void setLatitud(float latitud) {
		this.latitud = latitud;
	}
	
	public float getLongitud() {
		return longitud;
	}
	
	public void setLongitud(float longitud) {
		this.longitud = longitud;
	}
	
	public String getTipo() {
		return tipo;
	}
	
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	
	public String getHora_estimada_llegada() {
		return hora_estimada_llegada;
	}
	
	public void setHora_estimada_llegada(String hora_estimada_llegada) {
		this.hora_estimada_llegada = hora_estimada_llegada;
	}
	
	public String getHora_estimada_salida() {
		return hora_estimada_salida;
	}
	
	public void setHora_estimada_salida(String hora_estimada_salida) {
		this.hora_estimada_salida = hora_estimada_salida;
	}
	
	public String getNotas() {
		return notas;
	}
	
	public void setNotas(String notas) {
		this.notas = notas;
	}
}
