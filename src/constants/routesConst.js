export const menuRoutes = [
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
]