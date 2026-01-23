package utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * Clase de utilidad con métodos auxiliares para el controlador.
 * Proporciona funcionalidades comunes para el procesamiento de solicitudes HTTP.
 */

import javax.servlet.http.HttpServletRequest;

public class ControllerUtils {
	
	/**
     * Obtiene el cuerpo de una solicitud HTTP como una cadena de texto.
     * 
     * <p>Este método lee el contenido del cuerpo de la solicitud HTTP y lo convierte
     * en una cadena de texto. Es útil para procesar solicitudes que contienen
     * datos en formato JSON, XML u otros formatos en el cuerpo.</p>
     * 
     * @param request La solicitud HTTP de la cual se extraerá el cuerpo
     * @return El contenido del cuerpo de la solicitud como cadena de texto.
     *         Retorna una cadena vacía si ocurre un error de lectura o si
     *         el cuerpo está vacío.
     */
	
	public static String getBody(HttpServletRequest request)  {

	    String body = null;
	    StringBuilder stringBuilder = new StringBuilder();
	    BufferedReader bufferedReader = null;

	    try {
	        InputStream inputStream = request.getInputStream();
	        if (inputStream != null) {
	            bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
	            char[] charBuffer = new char[128];
	            int bytesRead = -1;
	            while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
	                stringBuilder.append(charBuffer, 0, bytesRead);
	            }
	        } else {
	            stringBuilder.append("");
	        }
	    } catch (IOException ex) {
	        // throw ex;
	        return "";
	    } finally {
	        if (bufferedReader != null) {
	            try {
	                bufferedReader.close();
	            } catch (IOException ex) {

	            }
	        }
	    }

	    body = stringBuilder.toString();
	    return body;
	}
}
