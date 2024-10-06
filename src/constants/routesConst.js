export const menuRoutes = [
    {
        label: "Recepción",
        icon: "mdi mdi-ballot-outline",
        link: '/reception'
    },
    {
        label: "Clientes",
        icon: "mdi mdi-account-group-outline",
        link: '/customers'
    },
    {
        label: "Proveedores",
        icon: "mdi mdi-truck-outline",
        link: '/suppliers'
    },
    {
        label: "Activos",
        icon: "mdi mdi-hammer-screwdriver",
        link: '/assets'
    },
    {
        label: "Restaurante",
        icon: "mdi mdi-silverware-fork-knife",
        link: '/restaurant'
    },
    {
        label: "Órdenes de compra",
        icon: "mdi mdi-text-box-multiple-outline",
        link: "/purchaseorders"
    },
    {
        icon: "mdi mdi-text-box-check-outline",
        label: "Recepción de pedidos",
        link: "/productsreception"
    },
    {
        label: "Contabilidad",
        icon: "mdi mdi-cash-multiple",
        link: '/accountingcontrol'
    },
    /*{
        label: "Facturación",
        icon: "mdi mdi-cash-register",
        link: '/billing'
    },*/ //TODO: Implementar facturación
    {
        label: "Inventario de hotel",
        icon: "mdi mdi-bed",
        link: '/stock/Hotel'
    },
    {
        label: "Inventario de restaurante",
        icon: "mdi mdi-food",
        link: '/stock/Restaurante'
    },
    {
        label: "Inventario de tienda",
        icon: "mdi mdi-storefront",
        link: '/stock/Tienda'
    },
    {
        label: "Almacenes",
        icon: "mdi mdi-warehouse",
        link: '/warehouses'
    },
    {
        label: "Puestos de limpieza",
        icon: "fas fa-soap",
        link: '/cleaningjobs'
    },
    {
        label: "Ajustes generales",
        icon: "mdi mdi-cog-outline",
        link: '/generalsettings'
    },
]

export const restaurantRoutes = [
    // { 
    //     label: "POS Restaurante", 
    //     icon: 'mdi mdi-cash-register',
    //     link: "/restaurant/pos" 
    // },
    // { 
    //     label: "Pedidos", 
    //     icon: 'mdi mdi-text-box-multiple-outline',
    //     link: "/restaurant/orders" 
    // },
    // { 
    //     label: "Sesiones", 
    //     icon: 'mdi mdi-network-pos',
    //     link: "/restaurant/sessions" 
    // },
    {
        label: "Gestión de menú",
        icon: 'mdi mdi-food',
        link: "/restaurant/menu"
    },
    // { 
    //     label: "Gestión de mesas", 
    //     icon: 'mdi mdi-table-chair',
    //     link: "/restaurant/tables" 
    // },
    {
        label: "Inventario",
        icon: 'mdi mdi-clipboard-list-outline',
        link: "/stock/Restaurante"
    },
    // { 
    //     label: "Configuración", 
    //     icon: 'mdi mdi-cog-outline',
    //     link: "/restaurant/settings" 
    // },
]

export const receptionRoutes = [
    {
        label: "Disponibilidad y Nueva reserva",
        icon: 'mdi mdi-calendar-plus',
        link: "/reception/availability"
    },
    {
        label: "Check In",
        icon: 'mdi mdi-briefcase-download',
        link: "/reception/checkin"
    },
    {
        label: "Check Out",
        icon: 'mdi mdi-briefcase-upload',
        link: "/reception/checkout"
    },
    {
        label: "In House",
        icon: 'mdi mdi-home-outline',
        link: "/reception/inhouse"
    },
    {
        label: "Reserva de Servicios Externos",
        icon: 'mdi mdi-clipboard-plus-outline',
        link: "/reception/externalservice"
    },
    {
        label: "Reportes",
        icon: 'mdi mdi-file-chart',
        link: "/reception/reports"
    },
    {
        label: "Listado de Reservas",
        icon: 'mdi mdi-format-list-bulleted',
        link: "/reception/listreservatios"
    },
]

export const hotelsettings = [

    {
        label: "Habitaciones",
        icon: 'mdi mdi-bed-outline',
        link: "/hotelsettings/rooms"
    },
    {
        label: "Tipo Habitación",
        icon: 'mdi mdi-bed-king-outline',
        link: "/hotelsettings/typeroom"
    },
    {
        label: "Comodidades",
        icon: 'mdi mdi-television',
        link: "/hotelsettings/amenities"
    },
    {
        label: "Servicios extra",
        icon: 'mdi mdi-account-star-outline',
        link: "/hotelsettings/extraservices"
    },
    {
        label: "Temporada",
        icon: 'mdi mdi-home-outline',
        link: "/hotelsettings/season"
    },
    {
        label: "Tipos de servicios",
        icon: 'mdi mdi-bell-plus',
        link: "/hotelsettings/typeservice"
    },
    {
        label: "Tours",
        icon: 'mdi mdi-compass-outline',
        link: "/hotelsettings/tours"
    },
    {
        label: "Administrar Paquetes",
        icon: 'mdi mdi-clipboard-plus-outline',
        link: "/hotelsettings/hotelpackages"
    },
    {
        label: "Áreas Operativas",
        icon: 'mdi mdi-tools',
        link: "/hotelsettings/operativeareas"
    }
]

export const sidebarRoutes = [
    {
        label: "Menú",
        isMainMenu: true,
    },
    {
        label: "Inicio",
        icon: "mdi mdi-home-variant-outline",
        url: "/home",
        isHasArrow: true,
        bgcolor: "bg-primary",
    },
    {
        label: "Recepción",
        icon: "mdi mdi-ballot-outline",
        url: '/reception',
        isHasArrow: true,
    },
    {
        label: "Clientes",
        icon: "mdi mdi-account-group-outline",
        url: "/customers",
        isHasArrow: true,
    },
    {
        label: "Proveedores",
        icon: "mdi mdi-truck-outline",
        url: "/suppliers",
        isHasArrow: true,
    },
    {
        label: "Activos",
        icon: "mdi mdi-hammer-screwdriver",
        subItem: [
            { sublabel: "Activos", link: "/assets" },
            { sublabel: "Movimientos", link: "/assets/movements" },
        ],
    },
    {
        label: "Restaurante",
        icon: "mdi mdi-silverware-fork-knife",
        subItem: [
            // { sublabel: "POS Restaurante", link: "/restaurant/pos" },
            // { sublabel: "Pedidos", link: "/restaurant/orders" },
            // { sublabel: "Sesiones", link: "/restaurant/sessions" },
            { sublabel: "Gestión de menú", link: "/restaurant/menu" },
            // { sublabel: "Gestión de mesas", link: "/restaurant/tables" },
            // { sublabel: "Inventario", link: "/stock/Restaurante" },
            // { sublabel: "Configuración", link: "/restaurant/settings" },
        ],
    },
    {
        label: "Órdenes de compra",
        icon: "mdi mdi-text-box-multiple-outline",
        subItem: [
            { sublabel: "Órdenes de compra", link: "/purchaseorders" },
            { sublabel: "Recepción de pedidos", link: "/productsreception" },
        ],
    },
    {
        label: "Inventarios",
        icon: "mdi mdi-clipboard-list-outline",
        subItem: [
            { sublabel: "Hotel", link: "/stock/Hotel" },
            { sublabel: "Restaurante", link: "/stock/Restaurante" },
            { sublabel: "Tienda", link: "/stock/Tienda" },
        ],
    },
    {
        label: "Almacenes",
        icon: "mdi mdi-warehouse",
        subItem: [
            { sublabel: "Almacenes", link: "/warehouses" },
            { sublabel: "Transferencias internas", link: "/internTransfers" },
        ],
    },
    {
        label: "Contabilidad",
        icon: "mdi mdi-cash-multiple",
        subItem: [
            { sublabel: "Todos los registros contables", link: "/accountingcontrol" },
            { sublabel: "Cuentas por pagar", link: "/accountspayable" },
            { sublabel: "Cuentas por cobrar", link: "/accountsreceivable" },
        ],
    },
    {
        label: "Puestos de limpieza",
        icon: "fas fa-soap",
        subItem: [
            { sublabel: "Puestos de limpieza", link: "/cleaningjobs" },
            { sublabel: "Chequeos", link: "/cleaningjobs/checks" },
            { sublabel: "Registrar chequeo", link: "/cleaningjobs/newcheck" },
        ],
    },
    {
        label: "Facturación Electronica",
        icon: "fas fa-soap",
        subItem: [
            { sublabel: "Mantenimiento", link: "/invoice/maintenance" },
            { sublabel: "Notas de crédito", link: "/invoice/credit/notes" },
            { sublabel: "Notas de débito", link: "/invoice/debit/notes" },
            { sublabel: "Documentos Emitidas", link: "/invoice/issued" },
            { sublabel: "Parámetros", link: "/invoice/parameters" },
            { sublabel: "Compañía", link: "/invoice/companies" },
        ],
    },
    {
        label: "Configuración",
        isMainMenu: true,
    },
    {
        label: "Mi perfil",
        icon: "mdi mdi-account-circle-outline",
        url: "/profile",
        isHasArrow: true,
    },
    {
        label: "Ajustes generales",
        icon: "mdi mdi-cog-outline",
        subItem: [
            { sublabel: "Usuarios", link: "/users" },
            { sublabel: "Roles", link: "/roles" },
            { sublabel: "Tipo de proveeduría", link: "/suppliertype" },
            { sublabel: "Ubicaciones", link: "/locations" },
            { sublabel: "Impuestos", link: "/taxmanagement" },
            { sublabel: "Hotel", link: "/hotelsettings" },
        ],
    },
]

export const menuRoutesGeneralSettings = [
    {
        label: "Usuarios",
        icon: "mdi mdi-account-group-outline",
        link: '/users'
    },
    {
        label: "Roles",
        icon: "mdi mdi-account-cog",
        link: '/roles'
    },
    {
        label: "Tipo de proveeduría",
        icon: "mdi mdi-cart-outline",
        link: '/suppliertype'
    },
    {
        label: "Ubicaciones",
        icon: "mdi mdi-map-marker-radius",
        link: '/locations'
    },
    {
        label: "Impuestos",
        icon: "mdi mdi-currency-usd",
        link: '/taxmanagement'
    },
    {
        label: "Hotel",
        icon: "mdi mdi-office-building",
        link: '/hotelsettings'
    }
]

export const stepsWizardMenuBooking = [
    {
        label: 'Buscar cliente',
        icon: 'mdi mdi-account-search-outline'
    },
    {
        label: 'Tipo y fecha de reserva',
        icon: 'mdi mdi-calendar-range',
        disabled: true
    },
    {
        label: 'Paquetes',
        icon: 'mdi mdi-package',
        disabled: true
    },
    {
        label: 'Habitaciones',
        icon: 'mdi mdi-bed-outline',
        disabled: true
    },
    {
        label: 'Servicios y Tours',
        icon: 'mdi mdi-room-service-outline',
        disabled: true
    },
    {
        label: 'Notas',
        icon: 'mdi mdi-text',
        disabled: true
    },
    {
        label: 'Resumen',
        icon: 'mdi mdi-text-box-check-outline',
        disabled: true
    }
]

export const iconTypeService = [
    {
        label: 'Desayunos',
        icon: 'mdi mdi-coffee-outline'
    },
    {
        label: 'Almuerzos',
        icon: 'mdi mdi-silverware-fork-knife'
    },
    {
        label: 'Cenas',
        icon: 'mdi mdi-food-turkey'
    },
    {
        label: 'WiFi',
        icon: 'mdi mdi-wifi'
    },
    {
        label: 'Gym',
        icon: 'mdi mdi-dumbbell'
    },
    {
        label: 'Piscina',
        icon: 'mdi mdi-pool'
    },
    {
        label: 'Tours',
        icon: 'mdi mdi-compass-outline'
    },
    {
        label: 'Servicios',
        icon: 'mdi mdi-room-service-outline'
    },
    {
        label: 'Habitación',
        icon: 'mdi mdi-bed-outline'
    },
    {
        label: 'Clientes',
        icon: 'mdi mdi-account'
    },
    {
        label: 'Clientes',
        icon: 'mdi mdi-account-multiple'
    },
    {
        label: 'Habitación',
        icon: 'mdi mdi-bed-outline'
    },
    {
        label: 'Viajes',
        icon: 'mdi mdi-airplane'
    },
    {
        label: 'Alarmas',
        icon: 'mdi mdi-alarm'
    },
    {
        label: 'Extras',
        icon: 'mdi mdi-check-circle'
    },
    {
        label: 'Archivos',
        icon: 'mdi mdi-archive'
    },
    {
        label: 'Flecha abajo',
        icon: 'mdi mdi-arrow-down-bold-circle-outline'
    },
    {
        label: 'Flecha arriba',
        icon: 'mdi mdi-arrow-up-bold-circle-outline'
    },
    {
        label: 'Flecha derecha',
        icon: 'mdi mdi-arrow-right-bold-circle-outline'
    },
    {
        label: 'Flecha izquierda',
        icon: 'mdi mdi-arrow-left-bold-circle-outline'
    },
    {
        label: 'Email',
        icon: 'mdi mdi-at'
    },
    {
        label: 'Mágia',
        icon: 'mdi mdi-auto-fix'
    },
    {
        label: 'Bebes',
        icon: 'mdi mdi-baby-buggy'
    },
    {
        label: 'Banco',
        icon: 'mdi mdi-bank'
    },
    {
        label: 'Compras',
        icon: 'mdi mdi-cart'
    },
    {
        label: 'Carga',
        icon: 'mdi mdi-battery-charging-100'
    },
    {
        label: 'Playa',
        icon: 'mdi mdi-beach'
    },
    {
        label: 'Estudio',
        icon: 'mdi mdi-book'
    },
    {
        label: 'Mascotas',
        icon: 'mdi mdi-bone'
    },
    {
        label: 'Equipaje',
        icon: 'mdi mdi-briefcase'
    },
    {
        label: 'Transporte',
        icon: 'mdi mdi-bus-double-decker'
    },
    {
        label: 'Cumple años',
        icon: 'mdi mdi-cake'
    },
    {
        label: 'Calendari',
        icon: 'mdi mdi-calendar'
    },
    {
        label: 'Camara',
        icon: 'mdi mdi-camera'
    },
    {
        label: 'Seguridad',
        icon: 'mdi mdi-cctv'
    },
    {
        label: 'Datos',
        icon: 'mdi mdi-chart-bar'
    },
    {
        label: 'Iglesia',
        icon: 'mdi mdi-church'
    },
    {
        label: 'Email',
        icon: 'mdi mdi-at'
    },
    {
        label: 'Data en nube',
        icon: 'mdi mdi-cloud-download'
    },
    {
        label: 'Mensajes',
        icon: 'mdi mdi-comment'
    },
    {
        label: 'Granja',
        icon: 'mdi mdi-cow'
    },
    {
        label: 'Computo',
        icon: 'mdi mdi-cursor-default-outline'
    },
    {
        label: 'Teléfono',
        icon: 'mdi mdi-deskphone'
    },
    {
        label: 'Mundo',
        icon: 'mdi mdi-earth'
    },
    {
        label: 'Ventilador',
        icon: 'mdi mdi-fan'
    },
    {
        label: 'Ferri',
        icon: 'mdi mdi-ferry'
    },
    {
        label: 'Pesca',
        icon: 'mdi mdi-fish'
    },
    {
        label: 'Comida rápida',
        icon: 'mdi mdi-food'
    },
    {
        label: 'Comida sana',
        icon: 'mdi mdi-food-apple'
    },
    {
        label: 'Video juegos',
        icon: 'mdi mdi-gamepad'
    },
    {
        label: 'Gasolinera',
        icon: 'mdi mdi-gas-station'
    },
    {
        label: 'Email',
        icon: 'mdi mdi-at'
    },
    {
        label: 'Legal',
        icon: 'mdi mdi-gavel'
    },
    {
        label: 'Regalias',
        icon: 'mdi mdi-gift'
    },
    {
        label: 'Bar',
        icon: 'mdi mdi-martini'
    },
    {
        label: 'Mapa',
        icon: 'mdi mdi-google-maps'
    },
    {
        label: 'Musica',
        icon: 'mdi mdi-guitar-acoustic'
    },
    {
        label: 'Ropa',
        icon: 'mdi mdi-hanger'
    },
    {
        label: 'Romantico',
        icon: 'mdi mdi-heart'
    },
    {
        label: 'Casa',
        icon: 'mdi mdi-at'
    },
    {
        label: 'Hospital',
        icon: 'mdi mdi-hospital-marker'
    },
    {
        label: 'Actividad fuera',
        icon: 'mdi mdi-human-handsup'
    },
    {
        label: 'Mujer embarazada',
        icon: 'mdi mdi-human-pregnant'
    },
    {
        label: 'Incognito',
        icon: 'mdi mdi-incognito'
    },
    {
        label: 'Salud',
        icon: 'mdi mdi-leaf'
    },
    {
        label: 'Busqueda',
        icon: 'mdi mdi-magnify'
    },
    {
        label: 'Micrófono',
        icon: 'mdi mdi-microphone'
    },
    {
        label: 'Paquetes',
        icon: 'mdi mdi-package-variant-closed'
    },
    {
        label: 'Pinturas',
        icon: 'mdi mdi-palette'
    },
    {
        label: 'Formalidad',
        icon: 'mdi mdi-pen'
    },
    {
        label: 'Farmacia',
        icon: 'mdi mdi-pharmacy'
    },
    {
        label: 'Teléfono público',
        icon: 'mdi mdi-phone'
    },
    {
        label: 'Bosque',
        icon: 'mdi mdi-pine-tree'
    },
    {
        label: 'Impresora',
        icon: 'mdi mdi-printer'
    },
    {
        label: 'Presentación',
        icon: 'mdi mdi-presentation'
    },
    {
        label: 'Correr',
        icon: 'mdi mdi-run'
    },
    {
        label: 'Trabajos',
        icon: 'mdi mdi-shovel'
    },
    {
        label: 'Fumado',
        icon: 'mdi mdi-smoking'
    },
    {
        label: 'Libre de humo',
        icon: 'mdi mdi-smoking-off'
    },
    {
        label: 'Tren',
        icon: 'mdi mdi-train'
    },
    {
        label: 'TV',
        icon: 'mdi mdi-television'
    },
    {
        label: 'Montaña',
        icon: 'mdi mdi-terrain'
    },
    {
        label: 'Traductor',
        icon: 'mdi mdi-translate'
    },
    {
        label: 'Internet',
        icon: 'mdi mdi-web'
    }
]

export const typesBooking = [
    {
        label: 'Individual',
        value: 'IN'
    },
    {
        label: 'Grupales',
        value: 'GR'
    },
    {
        label: 'Bloqueo',
        value: 'BL'
    },
    {
        label: 'Sobreventa',
        value: 'OS'
    }
];

export const daysWeek = [
    {
        label: 'Lun',
    },
    {
        label: 'Mar',
    },
    {
        label: 'Mié',
    },
    {
        label: 'Jue',
    },
    {
        label: 'Vie',
    },
    {
        label: 'Sáb',
    },
    {
        label: 'Dom',
    }
]