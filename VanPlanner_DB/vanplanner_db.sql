-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-02-2026 a las 15:36:38
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

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

--
-- Volcado de datos para la tabla `colaboradores`
--

INSERT INTO `colaboradores` (`id_colaborador`, `viaje_id`, `usuario_id`, `rol`, `estado`, `invitado_en`, `respondido_en`, `token_invitacion`) VALUES
(9, 27, 25, 'editor', 'aceptado', '2026-02-03 00:52:33', NULL, NULL),
(12, 29, 25, 'editor', 'aceptado', '2026-02-03 01:32:39', NULL, NULL),
(18, 29, 26, 'editor', 'aceptado', '2026-02-04 15:48:50', NULL, NULL),
(19, 32, 25, 'editor', 'aceptado', '2026-02-05 12:42:25', NULL, NULL),
(20, 33, 33, 'editor', 'aceptado', '2026-02-05 19:12:03', NULL, NULL),
(21, 33, 26, 'editor', 'aceptado', '2026-02-05 19:15:15', NULL, NULL);

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

--
-- Volcado de datos para la tabla `gastos`
--

INSERT INTO `gastos` (`id_gasto`, `viaje_id`, `usuario_id`, `tipo`, `cantidad`, `precio_unitario`, `total`, `fecha_gasto`, `lugar`, `descripcion`, `estado`, `registrado_en`) VALUES
(3, 27, 25, 'combustible', NULL, NULL, 121.00, '2026-02-03', NULL, 'figueres', 'realizado', '2026-02-03 01:15:52'),
(4, 27, 25, 'combustible', NULL, NULL, 23.00, '2026-02-03', NULL, 'Gasolinera puzol', 'realizado', '2026-02-03 01:15:59'),
(5, 27, 25, 'comida', NULL, NULL, 21.00, '2026-02-03', NULL, 'Tito Vicent', 'realizado', '2026-02-03 01:16:06'),
(7, 33, 33, 'combustible', NULL, NULL, 60.00, '2026-02-05', NULL, 'Gasolinera repson', 'realizado', '2026-02-05 19:13:17'),
(8, 33, 33, 'alojamiento', NULL, NULL, 50.00, '2026-02-05', NULL, 'Hotel paraiso', 'realizado', '2026-02-05 19:14:23');

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
  `orden_secuencia` int(11) DEFAULT NULL COMMENT 'Orden en el viaje (1, 2, 3...)',
  `nombre_lugar` varchar(150) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `latitud` decimal(10,8) DEFAULT NULL,
  `longitud` decimal(11,8) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `hora_estimada_llegada` time DEFAULT NULL,
  `hora_estimada_salida` time DEFAULT NULL,
  `notas` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `paradas`
--

INSERT INTO `paradas` (`id_parada`, `viaje_id`, `orden_secuencia`, `nombre_lugar`, `direccion`, `latitud`, `longitud`, `tipo`, `hora_estimada_llegada`, `hora_estimada_salida`, `notas`) VALUES
(12, 27, 1, 'Zaragoza', 'Zaragoza, EspaÃ±a', 41.64743400, -0.88614510, 'gasolinera', '10:10:00', '12:12:00', 'Fecha: 2026-02-16 | CategorÃ­a: transporte'),
(13, 27, 2, 'Salamanca', 'Salamanca, EspaÃ±a', 40.97010400, -5.66354000, 'otros', '11:11:00', '12:12:00', 'Fecha: 2026-02-18 | CategorÃ­a: otro'),
(14, 27, 3, 'Hotel Riu Plaza Guadalajara', 'Av. Adolfo LÃ³pez Mateos Sur 830, Chapalita, 44500 Guadalajara, Jal., MÃ©xico', 20.66591000, -103.39342000, 'hotel', '18:00:00', '23:59:00', 'Fecha: 2026-02-16 | CategorÃ­a: hotel'),
(15, 27, 4, 'Plaza de EspaÃ±a', 'Plaza de EspaÃ±a, Madrid, EspaÃ±a', 40.42342400, -3.71356000, 'otros', '17:00:00', '17:30:00', 'Fecha: 2026-02-16 | CategorÃ­a: otro'),
(18, 27, 5, 'Catedral-BasÃ­lica de Nuestra SeÃ±ora del Pilar', 'Plaza del Pilar, s/n, Casco Antiguo, 50003 Zaragoza, EspaÃ±a', 41.65690000, -0.87850560, 'atraccion', '10:00:00', '12:00:00', 'Fecha: 2026-02-19 | CategorÃ­a: monumento'),
(26, 29, 1, 'Toledo', 'Toledo, España', 39.86283000, -4.02732320, 'otros', '10:00:00', '11:11:00', 'Fecha: 2026-02-04 | Categoría: otro'),
(27, 29, 2, 'Zaragoza', 'Zaragoza, España', 41.64743400, -0.88614510, 'supermercado', '10:10:00', '11:11:00', 'Fecha: 2026-02-06 | Categoría: compras'),
(28, 29, 3, 'Albacete', 'Albacete, España', 38.99440000, -1.86017300, 'otros', '10:10:00', '12:12:00', 'Fecha: 2026-02-05 | Categoría: otro'),
(29, 33, 1, 'Barcelona', 'Barcelona, España', 41.38743600, 2.16864970, 'otros', '12:00:00', '15:00:00', 'Fecha: 2026-03-01 | Categoría: otro'),
(30, 33, 2, 'HOTEL PARAISO', 'Parque Principal, Zaragoza, Antioquia, Colombia', 7.49250840, -74.86835000, 'hotel', '18:00:00', '23:59:00', 'Fecha: 2026-03-01 | Categoría: hotel'),
(31, 33, 3, 'Rumanía', 'Rumanía', 45.94316000, 24.96676000, 'otros', '10:10:00', '11:11:00', 'Fecha: 2026-03-11 | Categoría: otro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recordatorios`
--

CREATE TABLE `recordatorios` (
  `id_recordatorio` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `texto` text NOT NULL,
  `completado` tinyint(1) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `recordatorios`
--

INSERT INTO `recordatorios` (`id_recordatorio`, `usuario_id`, `texto`, `completado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(6, 25, 'Reservar camping en Portugal', 0, '2026-02-04 10:16:17', '2026-02-04 15:35:07'),
(10, 33, 'Registrar primer viaje', 0, '2026-02-05 19:10:05', NULL),
(11, 33, 'comprar cerveza', 0, '2026-02-05 19:10:10', NULL),
(12, 33, 'comer mcdonals', 0, '2026-02-05 19:10:12', NULL);

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
  `activo` tinyint(1) DEFAULT 1,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellidos`, `ciudad`, `username`, `fecha_nacimiento`, `sexo`, `email`, `contrasenya`, `tipo_usuario`, `acepta_terminos`, `activo`, `fecha_registro`) VALUES
(3, 'Admin', 'Sistema', 'Valencia', 'admin', NULL, NULL, 'admin@vanplanner.com', 'admin.123', 'admin', 1, 1, '2026-02-03 02:24:14'),
(15, 'Noelie', 'Tomas', 'Almazora', 'Noelie', '2025-12-29', 'masculino', 'noelie2@gmail.com', '12345.Aa', 'user', 1, 1, '2026-02-03 02:24:14'),
(23, 'silvia', 'cervera', 'burriana', 'silvia', '1994-06-21', 'femenino', 'silviacer@gmail.com', '12345.Aa', 'user', 1, 1, '2026-02-03 02:24:14'),
(25, 'Joan', 'Bosch Navarro', 'PuÃ§ol', 'Joan', '1996-01-16', 'masculino', 'jobona2@gmail.com', '12345.Aa', 'user', 1, 1, '2026-02-03 02:24:14'),
(26, 'Laura', 'Mora Mulero', 'Puerto de Sagunto', 'Laura', '2004-02-10', 'femenino', 'lauramoramul@gmail.com', '12345.Aa', 'user', 1, 1, '2026-02-03 02:24:14'),
(27, 'sdaf', 'fdsa', NULL, 'sdaf', NULL, NULL, 'a@a.com', '111.aaa.BBB', 'user', 1, 1, '2026-02-03 02:24:14'),
(32, 'Abigail', 'Tomás Cervera', NULL, 'abitc', NULL, NULL, 'abitomcer@gmail.com', '12345.Aa', 'user', 1, 0, '2026-02-03 14:59:06'),
(33, 'Sara', 'Castelló Sanchez', 'Borriol', 'sara21', '1996-04-18', 'femenino', 'saracastello@gmail.com', '12345.Aa', 'user', 1, 1, '2026-02-05 19:08:48');

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
(3, 26, 'sasdsads', 'asdad', 21.00, 'gasolina', 12.00, 1, '2026-02-01 23:47:04'),
(4, 25, 'Mi furgo', 'ford Transit', 9.00, 'diésel', 70.00, 1, '2026-02-02 09:17:45'),
(6, 33, 'La frago', 'California', 9.00, 'gasolina', 60.00, 1, '2026-02-05 19:10:45');

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
  `estado` enum('planificando','activo','completado','cancelado') DEFAULT 'planificando'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `viajes`
--

INSERT INTO `viajes` (`id_viaje`, `usuario_id`, `vehiculo_id`, `nombre_viaje`, `descripcion`, `origen`, `destino`, `fecha_inicio`, `fecha_fin`, `distancia_total`, `presupuesto_estimado`, `presupuesto_real`, `estado`) VALUES
(27, 25, 4, 'Viaje San Valentin', 'Vamos en ave desde madrid a barcelona', 'Madrid', 'Barcelona', '2026-02-16', '2026-02-20', 505.00, 0.00, 0.00, 'planificando'),
(29, 25, 4, 'A la capi', 'Vamos a fabrik', 'Madrid', 'Puçol', '2026-02-04', '2026-02-07', 303.00, 0.00, 0.00, 'planificando'),
(32, 25, 4, 'viaje rapido', 'viaje rapido', 'Burriana', 'Puçol', '2026-02-06', '2026-02-07', 36.00, 0.00, 0.00, 'planificando'),
(33, 33, 6, 'Chochona', 'Huyendo de las fallas', 'Zaragoza', 'Seúl', '2026-03-01', '2026-03-20', 9745.00, 0.00, 0.00, 'planificando');

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
-- Indices de la tabla `recordatorios`
--
ALTER TABLE `recordatorios`
  ADD PRIMARY KEY (`id_recordatorio`);

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
  MODIFY `id_colaborador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `gastos`
--
ALTER TABLE `gastos`
  MODIFY `id_gasto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `itinerarios`
--
ALTER TABLE `itinerarios`
  MODIFY `id_itinerario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `paradas`
--
ALTER TABLE `paradas`
  MODIFY `id_parada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `recordatorios`
--
ALTER TABLE `recordatorios`
  MODIFY `id_recordatorio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `rutas`
--
ALTER TABLE `rutas`
  MODIFY `id_ruta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  MODIFY `id_vehiculo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `viajes`
--
ALTER TABLE `viajes`
  MODIFY `id_viaje` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

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
