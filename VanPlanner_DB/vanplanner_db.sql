

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Base de datos: `vanplanner_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `colaboradores`
--

CREATE TABLE `colaboradores` (
  `id_colaborador` int(11) NOT NULL,
  `viaje_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `rol` enum('editor','lector') DEFAULT 'editor',
  `estado` enum('pendiente','aceptado','rechazado') DEFAULT 'pendiente',
  `invitado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `respondido_en` timestamp NULL DEFAULT NULL,
  `token_invitacion` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gastos`
--

CREATE TABLE `gastos` (
  `id_gasto` int(11) NOT NULL,
  `viaje_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `tipo` enum('combustible','peaje','comida','alojamiento','entrada','parking','compra','otros') NOT NULL,
  `cantidad` decimal(10,2) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `fecha_gasto` date NOT NULL,
  `lugar` varchar(200) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('presupuestado','realizado') DEFAULT 'realizado',
  `registrado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `itinerarios`
--

CREATE TABLE `itinerarios` (
  `id_itinerario` int(11) NOT NULL,
  `viaje_id` int(11) NOT NULL,
  `dia_numero` int(11) NOT NULL COMMENT 'Día 1, 2, 3...',
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time DEFAULT NULL,
  `actividad` varchar(200) NOT NULL,
  `ubicacion` varchar(200) DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `es_conduccion` tinyint(1) DEFAULT 0,
  `ruta_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paradas`
--

CREATE TABLE `paradas` (
  `id_parada` int(11) NOT NULL,
  `viaje_id` int(11) NOT NULL,
  `orden_secuencia` int(11) NOT NULL COMMENT 'Orden en el viaje (1, 2, 3...)',
  `nombre_lugar` varchar(150) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `latitud` decimal(10,8) DEFAULT NULL,
  `longitud` decimal(11,8) DEFAULT NULL,
  `tipo` enum('gasolinera','restaurante','hotel','mirador','atraccion','supermercado','otros') DEFAULT NULL,
  `hora_estimada_llegada` time DEFAULT NULL,
  `hora_estimada_salida` time DEFAULT NULL,
  `notas` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rutas`
--

CREATE TABLE `rutas` (
  `id_ruta` int(11) NOT NULL,
  `viaje_id` int(11) NOT NULL,
  `parada_origen_id` int(11) NOT NULL,
  `parada_destino_id` int(11) NOT NULL,
  `orden_secuencia` int(11) NOT NULL COMMENT 'Orden del tramo (1, 2, 3...)',
  `distancia_km` decimal(8,2) NOT NULL,
  `tiempo_estimado_min` int(11) NOT NULL COMMENT 'Tiempo en minutos',
  `peajes_estimados` decimal(8,2) DEFAULT 0.00,
  `instrucciones` text DEFAULT NULL,
  `tipo_ruta` enum('mas_rápida','mas_corta','evitar_autopistas','evitar_peajes') DEFAULT 'mas_rápida'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(8) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `sexo` enum('masculino','femenino','otro') DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `contrasenya` varchar(255) NOT NULL,
  `tipo_usuario` enum('user','admin') DEFAULT 'user',
  `acepta_terminos` tinyint(1) NOT NULL DEFAULT 0,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellidos`, `ciudad`, `username`, `fecha_nacimiento`, `sexo`, `email`, `contrasenya`, `tipo_usuario`, `acepta_terminos`, `activo`) VALUES
(1, 'Priscilla', 'Tomás Cervera', 'Burriana', 'pristoncer', NULL, NULL, 'pristomcer.23@mail.com', '123456.Qw', 'user', 1, 1),
(2, 'Joan', 'Bosch Navarro', 'Puzol', 'jobonita', NULL, NULL, 'jobonita@mail.com', 'jobona.1', 'user', 1, 1),
(3, 'Abigail', 'Sistema', 'Valencia', 'admin', NULL, NULL, 'admin@vanplanner.com', 'admin.123', 'admin', 1, 1),

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculos`
--

CREATE TABLE `vehiculos` (
  `id_vehiculo` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `nombre_vehiculo` varchar(50) DEFAULT 'Mi vehículo',
  `marca_modelo` varchar(100) DEFAULT NULL,
  `consumo` decimal(5,2) DEFAULT NULL COMMENT 'Consumo en l/100km',
  `tipo_combustible` enum('gasolina','diésel','eléctrico','híbrido') DEFAULT NULL,
  `capacidad_tanque` decimal(6,2) DEFAULT NULL COMMENT 'Capacidad en litros',
  `es_principal` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vehiculos`
--

INSERT INTO `vehiculos` (`id_vehiculo`, `usuario_id`, `nombre_vehiculo`, `marca_modelo`, `consumo`, `tipo_combustible`, `capacidad_tanque`, `es_principal`, `created_at`) VALUES
(1, 1, 'Mi coche', 'Seat León', 5.80, 'diésel', 55.00, 1, '2026-01-15 21:04:42'),
(2, 2, 'La frago', 'Ford Transit', 8.20, 'diésel', 70.00, 1, '2026-01-15 21:04:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `viajes`
--

CREATE TABLE `viajes` (
  `id_viaje` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `vehiculo_id` int(11) DEFAULT NULL,
  `nombre_viaje` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `origen` varchar(200) NOT NULL,
  `destino` varchar(200) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `distancia_total` decimal(8,2) DEFAULT 0.00 COMMENT 'Distancia total en km',
  `presupuesto_estimado` decimal(10,2) DEFAULT 0.00,
  `presupuesto_real` decimal(10,2) DEFAULT 0.00,
  `estado` enum('planificando','activo','completado','cancelado') DEFAULT 'planificando',
  `es_publico` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `colaboradores`
--
ALTER TABLE `colaboradores`
  ADD PRIMARY KEY (`id_colaborador`),
  ADD UNIQUE KEY `uk_viaje_usuario` (`viaje_id`,`usuario_id`),
  ADD UNIQUE KEY `token_invitacion` (`token_invitacion`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `gastos`
--
ALTER TABLE `gastos`
  ADD PRIMARY KEY (`id_gasto`),
  ADD KEY `viaje_id` (`viaje_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `itinerarios`
--
ALTER TABLE `itinerarios`
  ADD PRIMARY KEY (`id_itinerario`),
  ADD UNIQUE KEY `uk_viaje_dia_hora` (`viaje_id`,`dia_numero`,`hora_inicio`),
  ADD KEY `ruta_id` (`ruta_id`);

--
-- Indices de la tabla `paradas`
--
ALTER TABLE `paradas`
  ADD PRIMARY KEY (`id_parada`),
  ADD UNIQUE KEY `uk_viaje_orden` (`viaje_id`,`orden_secuencia`);

--
-- Indices de la tabla `rutas`
--
ALTER TABLE `rutas`
  ADD PRIMARY KEY (`id_ruta`),
  ADD UNIQUE KEY `uk_viaje_orden` (`viaje_id`,`orden_secuencia`),
  ADD KEY `parada_origen_id` (`parada_origen_id`),
  ADD KEY `parada_destino_id` (`parada_destino_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  ADD PRIMARY KEY (`id_vehiculo`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `viajes`
--
ALTER TABLE `viajes`
  ADD PRIMARY KEY (`id_viaje`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `vehiculo_id` (`vehiculo_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `colaboradores`
--
ALTER TABLE `colaboradores`
  MODIFY `id_colaborador` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `gastos`
--
ALTER TABLE `gastos`
  MODIFY `id_gasto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `itinerarios`
--
ALTER TABLE `itinerarios`
  MODIFY `id_itinerario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `paradas`
--
ALTER TABLE `paradas`
  MODIFY `id_parada` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rutas`
--
ALTER TABLE `rutas`
  MODIFY `id_ruta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  MODIFY `id_vehiculo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `viajes`
--
ALTER TABLE `viajes`
  MODIFY `id_viaje` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `colaboradores`
--
ALTER TABLE `colaboradores`
  ADD CONSTRAINT `colaboradores_ibfk_1` FOREIGN KEY (`viaje_id`) REFERENCES `viajes` (`id_viaje`) ON DELETE CASCADE,
  ADD CONSTRAINT `colaboradores_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `gastos`
--
ALTER TABLE `gastos`
  ADD CONSTRAINT `gastos_ibfk_1` FOREIGN KEY (`viaje_id`) REFERENCES `viajes` (`id_viaje`) ON DELETE CASCADE,
  ADD CONSTRAINT `gastos_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `itinerarios`
--
ALTER TABLE `itinerarios`
  ADD CONSTRAINT `itinerarios_ibfk_1` FOREIGN KEY (`viaje_id`) REFERENCES `viajes` (`id_viaje`) ON DELETE CASCADE,
  ADD CONSTRAINT `itinerarios_ibfk_2` FOREIGN KEY (`ruta_id`) REFERENCES `rutas` (`id_ruta`) ON DELETE SET NULL;

--
-- Filtros para la tabla `paradas`
--
ALTER TABLE `paradas`
  ADD CONSTRAINT `paradas_ibfk_1` FOREIGN KEY (`viaje_id`) REFERENCES `viajes` (`id_viaje`) ON DELETE CASCADE;

--
-- Filtros para la tabla `rutas`
--
ALTER TABLE `rutas`
  ADD CONSTRAINT `rutas_ibfk_1` FOREIGN KEY (`viaje_id`) REFERENCES `viajes` (`id_viaje`) ON DELETE CASCADE,
  ADD CONSTRAINT `rutas_ibfk_2` FOREIGN KEY (`parada_origen_id`) REFERENCES `paradas` (`id_parada`) ON DELETE CASCADE,
  ADD CONSTRAINT `rutas_ibfk_3` FOREIGN KEY (`parada_destino_id`) REFERENCES `paradas` (`id_parada`) ON DELETE CASCADE;

--
-- Filtros para la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  ADD CONSTRAINT `vehiculos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `viajes`
--
ALTER TABLE `viajes`
  ADD CONSTRAINT `viajes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `viajes_ibfk_2` FOREIGN KEY (`vehiculo_id`) REFERENCES `vehiculos` (`id_vehiculo`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
