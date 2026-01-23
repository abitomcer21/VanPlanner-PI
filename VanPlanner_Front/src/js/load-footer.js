document.addEventListener('DOMContentLoaded', function() {
    const contenedorFooter = document.getElementById('footer-container');
    
    if (!contenedorFooter) {
        console.warn('No se encontró contenedor para footer');
        return;
    }
        const footerHTML = `
    <footer class="bg-van-primario-v2/80 backdrop-blur-sm text-van-secundario-v3 py-4 relative z-10 mt-auto">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <span class="mb-3 md:mb-0 font-medium">© 2025 VanPlanner</span>
                <div class="flex flex-wrap justify-center gap-4 md:gap-6">
                    <a href="#" class="text-van-secundario-3 hover:text-van-primario-v1 transition duration-200">Términos</a>
                    <a href="#" class="text-van-secundario-3 hover:text-van-primario-v1 transition duration-200">Privacidad</a>
                    <a href="#" class="text-van-secundario-3 hover:text-van-primario-v1 transition duration-200">Contacto</a>
                </div>
            </div>
        </div>
    </footer>
    `;
    
    contenedorFooter.innerHTML = footerHTML;
});