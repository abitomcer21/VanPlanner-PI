package modelo;

public class Vehiculo {
	private int id_vehiculo;
	private String matricula;
	private String marca;
	private String modelo;
	private int anyo;
	private String tipo_combustible;
	private float consumo_medio;
	private int capacidad_pasajeros;
	private int capacidad_carga;
	
	public Vehiculo() {
		super();
	}

	public Vehiculo(int id_vehiculo, String matricula, String marca, String modelo, int anyo, String tipo_combustible,
			float consumo_medio, int capacidad_pasajeros, int capacidad_carga) {
		super();
		this.id_vehiculo = id_vehiculo;
		this.matricula = matricula;
		this.marca = marca;
		this.modelo = modelo;
		this.anyo = anyo;
		this.tipo_combustible = tipo_combustible;
		this.consumo_medio = consumo_medio;
		this.capacidad_pasajeros = capacidad_pasajeros;
		this.capacidad_carga = capacidad_carga;
	}

	// Getters y setters
	public int getId_vehiculo() {
		return id_vehiculo;
	}

	public void setId_vehiculo(int id_vehiculo) {
		this.id_vehiculo = id_vehiculo;
	}

	public String getMatricula() {
		return matricula;
	}

	public void setMatricula(String matricula) {
		this.matricula = matricula;
	}

	public String getMarca() {
		return marca;
	}

	public void setMarca(String marca) {
		this.marca = marca;
	}

	public String getModelo() {
		return modelo;
	}

	public void setModelo(String modelo) {
		this.modelo = modelo;
	}

	public int getAnyo() {
		return anyo;
	}

	public void setAnyo(int anyo) {
		this.anyo = anyo;
	}

	public String getTipo_combustible() {
		return tipo_combustible;
	}

	public void setTipo_combustible(String tipo_combustible) {
		this.tipo_combustible = tipo_combustible;
	}

	public float getConsumo_medio() {
		return consumo_medio;
	}

	public void setConsumo_medio(float consumo_medio) {
		this.consumo_medio = consumo_medio;
	}

	public int getCapacidad_pasajeros() {
		return capacidad_pasajeros;
	}

	public void setCapacidad_pasajeros(int capacidad_pasajeros) {
		this.capacidad_pasajeros = capacidad_pasajeros;
	}

	public int getCapacidad_carga() {
		return capacidad_carga;
	}

	public void setCapacidad_carga(int capacidad_carga) {
		this.capacidad_carga = capacidad_carga;
	}
}
