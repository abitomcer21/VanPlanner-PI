package modelo;

import java.util.Date;

public class Viaje {
	private int id_viaje;
	private int usuario_id;
	private int vehiculo_id;
	private String nombre_viaje;
	private String descripcion;
	private String origen;
	private String destino;
	private Date fecha_inicio;
	private Date fecha_fin;
	private float distancia_total;
	private float presupuesto_estimado;
	private float presupuesto_real;
	private String estado;
	
	
	
	public Viaje() {
		super();
	}

	public Viaje(int id_viaje, int usuario_id, int vehiculo_id, String nombre_viaje, String descripcion, String origen,
			String destino, Date fecha_inicio, Date fecha_fin, float distancia_total, float presupuesto_estimado,
			float presupuesto_real, String estado) {
		super();
		this.id_viaje = id_viaje;
		this.usuario_id = usuario_id;
		this.vehiculo_id = vehiculo_id;
		this.nombre_viaje = nombre_viaje;
		this.descripcion = descripcion;
		this.origen = origen;
		this.destino = destino;
		this.fecha_inicio = fecha_inicio;
		this.fecha_fin = fecha_fin;
		this.distancia_total = distancia_total;
		this.presupuesto_estimado = presupuesto_estimado;
		this.presupuesto_real = presupuesto_real;
		this.estado= estado;
	}
	
	public int getId_viaje() {
		return id_viaje;
	}
	public void setId_viaje(int id_viaje) {
		this.id_viaje = id_viaje;
	}
	public int getUsuario_id() {
		return usuario_id;
	}
	public void setUsuario_id(int usuario_id) {
		this.usuario_id = usuario_id;
	}
	public int getVehiculo_id() {
		return vehiculo_id;
	}
	public void setVehiculo_id(int vehiculo_id) {
		this.vehiculo_id = vehiculo_id;
	}
	public String getNombre_viaje() {
		return nombre_viaje;
	}
	public void setNombre_viaje(String nombre_viaje) {
		this.nombre_viaje = nombre_viaje;
	}
	public String getDescripcion() {
		return descripcion;
	}
	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}
	public String getOrigen() {
		return origen;
	}
	public void setOrigen(String origen) {
		this.origen = origen;
	}
	public String getDestino() {
		return destino;
	}
	public void setDestino(String destino) {
		this.destino = destino;
	}
	public Date getFecha_inicio() {
		return fecha_inicio;
	}
	public void setFecha_inicio(Date fecha_inicio) {
		this.fecha_inicio = fecha_inicio;
	}
	public Date getFecha_fin() {
		return fecha_fin;
	}
	public void setFecha_fin(Date fecha_fin) {
		this.fecha_fin = fecha_fin;
	}
	public float getDistancia_total() {
		return distancia_total;
	}
	public void setDistancia_total(float distancia_total) {
		this.distancia_total = distancia_total;
	}
	public float getPresupuesto_estimado() {
		return presupuesto_estimado;
	}
	public void setPresupuesto_estimado(float presupuesto_estimado) {
		this.presupuesto_estimado = presupuesto_estimado;
	}
	public float getPresupuesto_real() {
		return presupuesto_real;
	}
	public void setPresupuesto_real(float presupuesto_real) {
		this.presupuesto_real = presupuesto_real;
	}
	
	public String getEstado() {
		return estado;
	}
	
	public void setEstado (String estado) {
		this.estado = estado;
	}
	
	

}
