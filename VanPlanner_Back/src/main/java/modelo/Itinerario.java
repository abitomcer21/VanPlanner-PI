package modelo;

public class Itinerario {
    private int id_itinerario;
    private int viaje_id;
    private int dia_numero;
    private String fecha;
    private String hora_inicio;
    private String hora_fin;
    private String actividad;
    private String ubicacion;
    private String notas;
    private boolean es_conduccion;
    private Integer ruta_id;
    
    // Constructor vacío
    public Itinerario() {
    }
    
    // Constructor completo
    public Itinerario(int viaje_id, int dia_numero, String fecha, String hora_inicio, 
                     String hora_fin, String actividad, String ubicacion, String notas) {
        this.viaje_id = viaje_id;
        this.dia_numero = dia_numero;
        this.fecha = fecha;
        this.hora_inicio = hora_inicio;
        this.hora_fin = hora_fin;
        this.actividad = actividad;
        this.ubicacion = ubicacion;
        this.notas = notas;
        this.es_conduccion = false;
    }

    // Getters y Setters
    public int getId_itinerario() {
        return id_itinerario;
    }

    public void setId_itinerario(int id_itinerario) {
        this.id_itinerario = id_itinerario;
    }

    public int getViaje_id() {
        return viaje_id;
    }

    public void setViaje_id(int viaje_id) {
        this.viaje_id = viaje_id;
    }

    public int getDia_numero() {
        return dia_numero;
    }

    public void setDia_numero(int dia_numero) {
        this.dia_numero = dia_numero;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getHora_inicio() {
        return hora_inicio;
    }

    public void setHora_inicio(String hora_inicio) {
        this.hora_inicio = hora_inicio;
    }

    public String getHora_fin() {
        return hora_fin;
    }

    public void setHora_fin(String hora_fin) {
        this.hora_fin = hora_fin;
    }

    public String getActividad() {
        return actividad;
    }

    public void setActividad(String actividad) {
        this.actividad = actividad;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }

    public boolean isEs_conduccion() {
        return es_conduccion;
    }

    public void setEs_conduccion(boolean es_conduccion) {
        this.es_conduccion = es_conduccion;
    }

    public Integer getRuta_id() {
        return ruta_id;
    }

    public void setRuta_id(Integer ruta_id) {
        this.ruta_id = ruta_id;
    }
}
