package modelo;

import java.sql.Timestamp;

public class Recordatorio {
    private int idRecordatorio;
    private int usuarioId;
    private String texto;
    private boolean completado;
    private Timestamp fechaCreacion;
    private Timestamp fechaActualizacion;

    // Constructor vacío
    public Recordatorio() {
    }

    // Constructor con parámetros principales
    public Recordatorio(int usuarioId, String texto, boolean completado) {
        this.usuarioId = usuarioId;
        this.texto = texto;
        this.completado = completado;
    }

    // Constructor completo
    public Recordatorio(int idRecordatorio, int usuarioId, String texto, boolean completado, 
                       Timestamp fechaCreacion, Timestamp fechaActualizacion) {
        this.idRecordatorio = idRecordatorio;
        this.usuarioId = usuarioId;
        this.texto = texto;
        this.completado = completado;
        this.fechaCreacion = fechaCreacion;
        this.fechaActualizacion = fechaActualizacion;
    }

    // Getters y Setters
    public int getIdRecordatorio() {
        return idRecordatorio;
    }

    public void setIdRecordatorio(int idRecordatorio) {
        this.idRecordatorio = idRecordatorio;
    }

    public int getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(int usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public boolean isCompletado() {
        return completado;
    }

    public void setCompletado(boolean completado) {
        this.completado = completado;
    }

    public Timestamp getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Timestamp fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Timestamp getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(Timestamp fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

    @Override
    public String toString() {
        return "Recordatorio{" +
                "idRecordatorio=" + idRecordatorio +
                ", usuarioId=" + usuarioId +
                ", texto='" + texto + '\'' +
                ", completado=" + completado +
                ", fechaCreacion=" + fechaCreacion +
                ", fechaActualizacion=" + fechaActualizacion +
                '}';
    }
}
