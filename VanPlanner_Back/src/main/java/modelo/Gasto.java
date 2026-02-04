package modelo;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;

public class Gasto {
    private int idGasto;
    private int viajeId;
    private int usuarioId;
    private String tipo; // combustible, peaje, comida, alojamiento, entrada, parking, compra, otros
    private BigDecimal cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal total;
    private Date fechaGasto;
    private String lugar;
    private String descripcion;
    private String estado; // presupuestado, realizado
    private Timestamp registradoEn;

    // Constructor vacío
    public Gasto() {
    }

    // Constructor con parámetros principales
    public Gasto(int viajeId, int usuarioId, String tipo, BigDecimal total, Date fechaGasto, String descripcion) {
        this.viajeId = viajeId;
        this.usuarioId = usuarioId;
        this.tipo = tipo;
        this.total = total;
        this.fechaGasto = fechaGasto;
        this.descripcion = descripcion;
        this.estado = "realizado";
    }

    // Getters y Setters
    public int getIdGasto() {
        return idGasto;
    }

    public void setIdGasto(int idGasto) {
        this.idGasto = idGasto;
    }

    public int getViajeId() {
        return viajeId;
    }

    public void setViajeId(int viajeId) {
        this.viajeId = viajeId;
    }

    public int getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(int usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getCantidad() {
        return cantidad;
    }

    public void setCantidad(BigDecimal cantidad) {
        this.cantidad = cantidad;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public Date getFechaGasto() {
        return fechaGasto;
    }

    public void setFechaGasto(Date fechaGasto) {
        this.fechaGasto = fechaGasto;
    }

    public String getLugar() {
        return lugar;
    }

    public void setLugar(String lugar) {
        this.lugar = lugar;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Timestamp getRegistradoEn() {
        return registradoEn;
    }

    public void setRegistradoEn(Timestamp registradoEn) {
        this.registradoEn = registradoEn;
    }

    @Override
    public String toString() {
        return "Gasto{" +
                "idGasto=" + idGasto +
                ", viajeId=" + viajeId +
                ", usuarioId=" + usuarioId +
                ", tipo='" + tipo + '\'' +
                ", total=" + total +
                ", fechaGasto=" + fechaGasto +
                ", descripcion='" + descripcion + '\'' +
                ", estado='" + estado + '\'' +
                '}';
    }
}
