class ComponentLoader {
    constructor() {
        this.components = {};
    }

    async loadComponent(componentName, containerId) {
        try {
            const response = await fetch(`components/${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Componente ${componentName} no encontrado`);
            }

            const html = await response.text();
            const container = document.getElementById(containerId);

            if (container) {
                container.innerHTML = html;
                this.components[componentName] = html;
                this.initializeComponent(componentName);
            }
        } catch (error) {
            console.error(`Error cargando componente ${componentName}:`, error);
        }
    }

    initializeComponent(componentName) {
        switch (componentName) {
            case 'header':
                this.setupHeaderNavigation();
                break;
            case 'headerLoogeado':
                this.setupHeaderNavigation();
                break;
            case 'footer':
                this.setupFooterLinks();
                break;
        }
    }

    setupHeaderNavigation() {
        const menuToggle = document.querySelector('[data-menu-toggle]');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                
            });
        }
    }

    setupFooterLinks() {
    }

    async loadAllComponents() {
        const components = [
            { name: 'header', container: 'header-container' },
            { name: 'footer', container: 'footer-container' }
        ];

        const promises = components.map(comp =>
            this.loadComponent(comp.name, comp.container)
        );

        await Promise.all(promises);
    }
}

window.componentLoader = new ComponentLoader();

document.addEventListener('DOMContentLoaded', () => {
    window.componentLoader.loadAllComponents();
});