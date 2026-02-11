// Carga el headerLoggeado.html en el elemento con id 'headerLoggeado-container' si existe
export function loadHeaderLoggeado() {
  const headerContainer = document.getElementById('headerLoggeado-container');
  if (headerContainer) {
    // Path relativo desde verTodos.html
    fetch('./components/headerLoggeado.html')
      .then(res => res.text())
      .then(html => {
        headerContainer.innerHTML = html;
        // Actualiza el nombre del usuario si existe en localStorage
        let usuarioJson = localStorage.getItem('usuario');
        if (usuarioJson) {
          let usuario = JSON.parse(usuarioJson);
          const nombreSpan = headerContainer.querySelector('#nombreUsuario');
          if (nombreSpan) {
            nombreSpan.innerText = nombreSpan.innerText.replace('{nombre}', usuario.nombre);
          }
        }
      });
  }
}

// Si se importa como módulo global, ejecuta automáticamente
document.addEventListener('DOMContentLoaded', () => {
  loadHeaderLoggeado();
});
