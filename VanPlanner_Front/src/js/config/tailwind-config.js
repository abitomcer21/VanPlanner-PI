tailwind.config = {
    theme: {
        extend: {
            colors: {
                'van': {
                    'primario-v1': '#F9BA32',
                    'primario-v2': '#426E86',
                    'secundario-v1': '#F8F1E5',
                    'secundario-v2': '#2F3131',
                    'secundario-v3': '#FFFFFF',
                    'alerta': '#DC2626',
                    'correcto': '#10B981',
                    'aviso': '#F59E0B',
                    'neutro-1': '#626D71',
                    'neutro-2': '#E5E7EB',
                }
            },
            fontFamily: {
                'titulo': ['Montserrat', 'sans-serif'],
                'texto': ['Inter', 'sans-serif'],
            },
            fontSize: {
                'base': '18px', 
            },
            spacing: {
                '4': '1.25rem', 
                '6': '1.75rem', 
            }
        }
    }
}