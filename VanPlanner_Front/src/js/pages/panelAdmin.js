const btnNuevoUsuario = document.getElementById('btnNuevoUsuario');
        const btnCerrarModal = document.getElementById('btnCerrarModal');
        const btnCancelar = document.getElementById('btnCancelar');
        const modalUsuario = document.getElementById('modalUsuario');
        const modalTitulo = document.getElementById('modalTitulo');
        const formUsuario = document.getElementById('formUsuario');
        const btnEditar = document.querySelectorAll('.btn-editar');

        btnNuevoUsuario.addEventListener('click', () => {
            modalTitulo.textContent = 'Nuevo Usuario';
            formUsuario.reset();
            modalUsuario.classList.remove('hidden');
        });

        btnEditar.forEach(btn => {
            btn.addEventListener('click', () => {
                modalTitulo.textContent = 'Editar Usuario';
                modalUsuario.classList.remove('hidden');
            });
        });

        btnCerrarModal.addEventListener('click', () => {
            modalUsuario.classList.add('hidden');
        });

        btnCancelar.addEventListener('click', () => {
            modalUsuario.classList.add('hidden');
        });

        window.addEventListener('click', (e) => {
            if (e.target === modalUsuario) {
                modalUsuario.classList.add('hidden');
            }
        });

        formUsuario.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Usuario guardado correctamente');
            modalUsuario.classList.add('hidden');
        });