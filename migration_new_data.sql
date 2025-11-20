-- =============================================
-- Script de Actualización de Schema y Datos
-- =============================================

-- 1. Actualizar Estructura de NIVEL
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[NIVEL]') AND name = 'GENERADO')
BEGIN
    ALTER TABLE [NIVEL] ADD [GENERADO] BIT NOT NULL DEFAULT 0;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[NIVEL]') AND name = 'COMENTARIO')
BEGIN
    ALTER TABLE [NIVEL] ADD [COMENTARIO] VARCHAR(MAX) NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[NIVEL]') AND name = 'ID_USR')
BEGIN
    ALTER TABLE [NIVEL] ADD [ID_USR] INTEGER NULL;
    ALTER TABLE [NIVEL] ADD CONSTRAINT FK_NIVEL_USUARIO FOREIGN KEY([ID_USR]) REFERENCES [USUARIO]([ID_USR]);
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[NIVEL]') AND name = 'FECHA_CREACION')
BEGIN
    ALTER TABLE [NIVEL] ADD [FECHA_CREACION] DATETIME NULL;
END
GO

-- 2. Limpiar Datos Existentes
-- Deshabilitar constraints temporalmente para limpieza masiva
EXEC sp_msforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all"
GO

-- Borrar en orden correcto respetando Foreign Keys
DELETE FROM [COMPLEMENTO]; -- Debe borrarse antes de ACTIVIDAD_NIVEL
DELETE FROM [ATRIBUTO_VALOR];
DELETE FROM [ACTIVIDAD_NIVEL];
DELETE FROM [REP_ACTIVIDAD];
DELETE FROM [MODO_FALLA];
DELETE FROM [REP_NIVEL];
DELETE FROM [REP_ENTREGA];
DELETE FROM [USUARIO_PM];
DELETE FROM [PM];
DELETE FROM [NIVEL];
DELETE FROM [JERARQUIA];
DELETE FROM [ATRIBUTO];
-- DELETE FROM [ENTREGA]; -- Opcional si se quiere limpiar entregas

-- Resetear Identificadores
DBCC CHECKIDENT ('[COMPLEMENTO]', RESEED, 0);
DBCC CHECKIDENT ('[ATRIBUTO_VALOR]', RESEED, 0);
DBCC CHECKIDENT ('[ACTIVIDAD_NIVEL]', RESEED, 0);
DBCC CHECKIDENT ('[REP_ACTIVIDAD]', RESEED, 0);
DBCC CHECKIDENT ('[MODO_FALLA]', RESEED, 0);
DBCC CHECKIDENT ('[REP_NIVEL]', RESEED, 0);
DBCC CHECKIDENT ('[REP_ENTREGA]', RESEED, 0);
DBCC CHECKIDENT ('[USUARIO_PM]', RESEED, 0);
DBCC CHECKIDENT ('[PM]', RESEED, 0);
DBCC CHECKIDENT ('[NIVEL]', RESEED, 0);
DBCC CHECKIDENT ('[JERARQUIA]', RESEED, 0);
DBCC CHECKIDENT ('[ATRIBUTO]', RESEED, 0);
GO

-- Habilitar constraints
EXEC sp_msforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all"
GO

-- 3. Insertar Nueva Data Sintética

-- JERARQUIA
SET IDENTITY_INSERT [JERARQUIA] ON;
INSERT INTO [JERARQUIA] ([IDJ], [DESCRIPCION]) VALUES
(1, 'EMPRESA'),
(2, 'AREA'),
(3, 'PROCESO'),
(4, 'CONJUNTO'),
(5, 'ACTIVO'),
(6, 'SISTEMA'),
(7, 'COMPONENTE'),
(8, 'SUB COMPONENTE'),
(9, 'PLANTILLA');
SET IDENTITY_INSERT [JERARQUIA] OFF;

-- ATRIBUTO
SET IDENTITY_INSERT [ATRIBUTO] ON;
INSERT INTO [ATRIBUTO] ([IDT], [DESCRIPCION]) VALUES
(1, 'MARCA'),
(2, 'MODELO'),
(3, 'AÑO'),
(4, 'VALOR DE MEDIDA'),
(5, 'FRECUENCIA'),
(6, 'REFERENCIA'),
(7, 'DURACION'),
(8, 'TIPO SISTEMA'),
(9, 'VALOR OPTIMO');
SET IDENTITY_INSERT [ATRIBUTO] OFF;

-- USUARIOS (Dummy si no existen, necesarios para ID_USR en NIVEL)
-- Asumimos que existen usuarios con ID 1 y 2, si no, habría que crearlos.
IF NOT EXISTS (SELECT 1 FROM [USUARIO] WHERE [ID_USR] = 1)
BEGIN
    SET IDENTITY_INSERT [USUARIO] ON;
    INSERT INTO [USUARIO] ([ID_USR], [NOMBRE], [USUARIO], [CONTRASENA], [ID_ROL], [ID_DIS]) 
    VALUES (1, 'Admin', 'admin', '1234', NULL, NULL);
    SET IDENTITY_INSERT [USUARIO] OFF;
END
IF NOT EXISTS (SELECT 1 FROM [USUARIO] WHERE [ID_USR] = 2)
BEGIN
    SET IDENTITY_INSERT [USUARIO] ON;
    INSERT INTO [USUARIO] ([ID_USR], [NOMBRE], [USUARIO], [CONTRASENA], [ID_ROL], [ID_DIS]) 
    VALUES (2, 'User', 'user', '1234', NULL, NULL);
    SET IDENTITY_INSERT [USUARIO] OFF;
END

-- NIVEL
SET IDENTITY_INSERT [NIVEL] ON;
-- IDN, IDJ, IDNP, NOMBRE, GENERADO, PLANTILLA, NROPM, COMENTARIO, ID_USR, FECHA_CREACION
INSERT INTO [NIVEL] ([IDN], [IDJ], [IDNP], [NOMBRE], [GENERADO], [PLANTILLA], [NROPM], [COMENTARIO], [ID_USR], [FECHA_CREACION]) VALUES
(1, 1, NULL, 'VELADERO', 0, 0, 0, NULL, NULL, NULL),
(2, 2, 1, 'MINA', 0, 0, 0, NULL, NULL, NULL),
(3, 3, 2, 'ACARREO', 0, 0, 0, NULL, NULL, NULL),
(4, 4, 3, '994K', 0, 0, 0, NULL, NULL, NULL),
(5, 5, 4, 'CF1000', 0, 0, 0, NULL, NULL, NULL),
(6, 5, 4, 'CF1001', 0, 0, 0, NULL, NULL, NULL),
(7, 5, 4, 'CF100X (GENERICO)', 1, 0, 0, NULL, NULL, NULL),
(8, 6, 7, 'SISTEMA MOTOR', 0, 0, 0, NULL, NULL, NULL),
(9, 6, 7, 'SISTEMA TRANSMISION', 0, 0, 0, NULL, NULL, NULL),
(10, 6, 7, 'SISTEMA FRENO', 0, 0, 0, NULL, NULL, NULL),
(11, 6, 7, 'SISTEMA HIDRAULICO', 0, 0, 0, NULL, NULL, NULL),
(12, 6, 7, 'SISTEMA CABINA', 0, 0, 0, NULL, NULL, NULL),
(13, 7, 8, 'LUBRICACION', 0, 0, 0, NULL, NULL, NULL),
(14, 7, 12, 'CABINA', 0, 0, 0, NULL, NULL, NULL),
(15, 7, 7, 'CHASIS', 0, 0, 0, NULL, NULL, NULL),
(16, 9, 7, 'PLT 994K', 1, 1, 0, NULL, 1, NULL),
(17, 6, 16, 'SISTEMA MOTOR', 0, 0, 0, NULL, NULL, NULL),
(18, 6, 16, 'SISTEMA TRANSMISION', 0, 0, 0, NULL, NULL, NULL),
(19, 6, 16, 'SISTEMA FRENO', 0, 0, 0, NULL, NULL, NULL),
(20, 9, 8, 'PLT 994K / SISTEMA MOTOR', 1, 1, 1, NULL, 1, NULL),
(21, 6, 20, 'SISTEMA MOTOR', 0, 0, 0, NULL, NULL, NULL),
(22, 9, 8, 'PLT 994K / SISTEMA MOTOR', 1, 1, 2, NULL, 2, NULL),
(23, 6, 22, 'SISTEMA MOTOR', 0, 0, 0, NULL, NULL, NULL),
(24, 9, 7, 'PLT 994K', 1, 1, 2, NULL, 2, NULL),
(25, 6, 24, 'SISTEMA MOTOR', 0, 0, 0, NULL, NULL, NULL),
(26, 6, 24, 'SISTEMA TRANSMISION', 0, 0, 0, NULL, NULL, NULL),
(27, 6, 24, 'SISTEMA FRENO', 0, 0, 0, NULL, NULL, NULL);
SET IDENTITY_INSERT [NIVEL] OFF;

-- ACTIVIDAD_NIVEL
SET IDENTITY_INSERT [ACTIVIDAD_NIVEL] ON;
-- IDA, IDN, IDT, ORDEN, DESCRIPCION
INSERT INTO [ACTIVIDAD_NIVEL] ([IDA], [IDN], [IDT], [ORDEN], [DESCRIPCION]) VALUES
(1, 8, NULL, 1, 'Actividad sistema motor1'),
(2, 8, NULL, 2, 'Actividad sistema motor2'),
(3, 8, NULL, 3, 'Actividad sistema motor3'),
(4, 8, NULL, 4, 'Actividad sistema motor4'),
(5, 8, NULL, 5, 'Actividad sistema motor5'),
(6, 8, 1, 1, 'MARCA'),
(7, 8, 2, 2, 'MODELO'),
(8, 8, 3, 3, 'AÑO'),
(9, 9, NULL, 1, 'Actividad Transmision1'),
(10, 9, NULL, 2, 'Actividad Transmision2'),
(11, 9, NULL, 3, 'Actividad Transmision3'),
(12, 10, NULL, 1, 'Actividad Freno1'),
(13, 10, NULL, 2, 'Actividad Freno2'),
(14, 10, NULL, 3, 'Actividad Freno3'),
(15, 13, NULL, 1, 'Actividad Lubricación 01'),
(16, 13, NULL, 2, 'Actividad Lubricación 02'),
(17, 13, NULL, 3, 'Actividad Lubricación 03'),
(18, 15, NULL, 1, 'Actividad Chasis 01'),
(19, 15, NULL, 2, 'Actividad Chasis 02'),
(20, 15, NULL, 3, 'Actividad Chasis 03'),
(21, 17, NULL, 1, 'Actividad sistema motor1'),
(22, 17, NULL, 2, 'Actividad sistema motor2'),
(23, 17, NULL, 3, 'Actividad sistema motor4'),
(24, 17, NULL, 4, 'Actividad sistema motor5'),
(25, 17, 8, 8, 'TIPO SISTEMA'),
(26, 18, NULL, 1, 'Actividad Transmision1'),
(27, 18, NULL, 2, 'Actividad Transmision3'),
(28, 18, 8, 8, 'TIPO SISTEMA'),
(29, 19, NULL, 1, 'Actividad Freno1'),
(30, 19, NULL, 2, 'Actividad Freno2'),
(31, 19, 8, 8, 'TIPO SISTEMA'),
(32, 21, NULL, 1, 'Actividad sistema motor3'),
(33, 21, NULL, 2, 'Actividad sistema motor4'),
(34, 23, NULL, 1, 'Actividad sistema motor2'),
(35, 23, NULL, 2, 'Actividad sistema motor5'),
(36, 8, 4, 4, 'VALOR DE MEDIDA'),
(37, 8, 9, 9, 'VALOR OPTIMO');
SET IDENTITY_INSERT [ACTIVIDAD_NIVEL] OFF;

-- ATRIBUTO_VALOR
SET IDENTITY_INSERT [ATRIBUTO_VALOR] ON;
-- IDAV, IDA, VALOR
INSERT INTO [ATRIBUTO_VALOR] ([IDAV], [IDA], [VALOR]) VALUES
(1, 6, 'CUMMINS'),
(2, 7, 'C456'),
(3, 8, '###'),
(4, 25, 'CALIENTE'),
(5, 28, 'CALIENTE'),
(6, 31, 'BAHIA'),
(7, 36, 'CENTIGRADOS'),
(8, 37, '50');
SET IDENTITY_INSERT [ATRIBUTO_VALOR] OFF;

-- PM
SET IDENTITY_INSERT [PM] ON;
-- IDPM, IDN, NRO, CONJUNTO, PROGRAMACION, ESTADO, HOROMETRO, INICIO, FIN
INSERT INTO [PM] ([IDPM], [IDN], [NRO], [CONJUNTO], [PROGRAMACION], [ESTADO], [HOROMETRO], [INICIO], [FIN]) VALUES
(1, 5, 1, 4, '2024-11-13', 'COMPLETADO', 500, '2024-11-13', '2024-11-18'),
(2, 5, 2, 4, '2025-05-12', 'COMPLETADO', 1000, '2025-05-12', '2025-05-17'),
(3, 5, 3, 4, '2025-11-12', 'PENDIENTE', 1500, '2025-11-12', '2025-11-12'); -- Fin asumido igual a inicio por no tener dato exacto o se deja null si permitido, pero NOT NULL en schema
SET IDENTITY_INSERT [PM] OFF;

-- REPORTE_NIVEL
SET IDENTITY_INSERT [REP_NIVEL] ON;
-- IDRN, IDPM, IDN, IDJ, IDNP, DESCRIPCION
INSERT INTO [REP_NIVEL] ([IDRN], [IDPM], [IDN], [IDJ], [IDNP], [DESCRIPCION]) VALUES
(1, 1, 9, 6, 8, 'SISTEMA MOTOR'), -- OJO: IDN en data es 9, Desc 'SISTEMA MOTOR'. En Nivel N9 es 'SISTEMA TRANSMISION'. 
-- En Spreadsheet: RN1 | PM1 | N9 | J6 | N8 | SISTEMA MOTOR
-- N9 en Nivel es TRANSMISION. N8 es SISTEMA MOTOR.
-- Spreadsheet RepNivel IDN column says N9. Desc says SISTEMA MOTOR.
-- Spreadsheet IDNP says N8.
-- Maybe RepNivel references IDN (FK) as 'N9'?
-- Let's follow spreadsheet data EXACTLY for IDs.
(2, 1, 10, 6, 8, 'SISTEMA TRANSMISION'),
(3, 1, 11, 6, 8, 'SISTEMA FRENO');
-- RN4-8 empty
SET IDENTITY_INSERT [REP_NIVEL] OFF;

-- REP_ACTIVIDAD
SET IDENTITY_INSERT [REP_ACTIVIDAD] ON;
-- IDRA, IDRN, ORDEN, DESCRIPCION, REFERENCIA (Req), DURACION (Req)
-- Spreadsheet: IDRA, IDRN(FK), ORDEN, DESCRIPCION
-- Missing: REFERENCIA, DURACION in spreadsheet?
-- 'OTROS CAMPOS ...' column exists.
-- Schema: REFERENCIA VARCHAR(255) NOT NULL, DURACION INTEGER NOT NULL.
-- I will use defaults.
INSERT INTO [REP_ACTIVIDAD] ([IDRA], [IDRN], [ORDEN], [DESCRIPCION], [REFERENCIA], [DURACION]) VALUES
(1, 1, 1, 'Actividad sistema motor1', '-', 0),
(2, 1, 2, 'Actividad sistema motor2', '-', 0),
(3, 1, 3, 'Actividad sistema motor4', '-', 0),
(4, 1, 4, 'Actividad sistema motor5', '-', 0),
(5, 2, 5, 'Actividad Transmision1', '-', 0),
(6, 2, 6, 'Actividad Transmision3', '-', 0),
(7, 3, 7, 'Actividad Freno1', '-', 0),
(8, 3, 8, 'Actividad Freno2', '-', 0);
SET IDENTITY_INSERT [REP_ACTIVIDAD] OFF;

-- Check constraints for DURACION > 0 in REP_ACTIVIDAD?
-- Schema: CHECK ([DURACION] > 0);
-- Update Duracion to 1
UPDATE [REP_ACTIVIDAD] SET [DURACION] = 1;

GO

