package modelo;

import java.util.Date;

public class Parada {
	private String nombre;
	private String direccion;
	private float lat;
	private float lng;
	private String tipo;
	
	public Parada(String nombre, String direccion, float lat, float lng, String tipo) {
		super();
		this.nombre = nombre;
		this.direccion = direccion;
		this.lat = lat;
		this.lng = lng;
		this.tipo = tipo;
	} 
	
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public String getDireccion() {
		return direccion;
	}
	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}
	public float getLat() {
		return lat;
	}
	public void setLat(float lat) {
		this.lat = lat;
	}
	public float getLng() {
		return lng;
	}
	public void setLng(float lng) {
		this.lng = lng;
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	
}
