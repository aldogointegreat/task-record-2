-- =============================================
-- SCRIPT SQL - EXTENSIÓN DE ACTIVIDAD_NIVEL
-- Agregar nuevos campos y crear catálogos maestros
-- =============================================
-- IMPORTANTE: Ejecutar este script en orden
-- Si la tabla ACTIVIDAD_NIVEL ya existe, se usarán ALTER TABLE
-- Si no existe, usar el CREATE TABLE completo del bd_taskrecord.md
-- =============================================

USE [TASKRECORDS]; 
GO

-- =============================================
-- PASO 1: AGREGAR NUEVOS CAMPOS A ACTIVIDAD_NIVEL
-- =============================================
-- Solo ejecutar si la tabla ACTIVIDAD_NIVEL ya existe
-- Si la tabla no existe, usar el CREATE TABLE completo del bd_taskrecord.md

PRINT 'Agregando nuevos campos a ACTIVIDAD_NIVEL...';
GO

-- Verificar si los campos ya existen antes de agregarlos
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[ACTIVIDAD_NIVEL]') AND name = 'FUNCIONALIDAD')
BEGIN
    ALTER TABLE [ACTIVIDAD_NIVEL]
    ADD [FUNCIONALIDAD] VARCHAR(MAX) NULL;
    PRINT 'Campo FUNCIONALIDAD agregado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[ACTIVIDAD_NIVEL]') AND name = 'MODO_FALLA')
BEGIN
    ALTER TABLE [ACTIVIDAD_NIVEL]
    ADD [MODO_FALLA] VARCHAR(MAX) NULL;
    PRINT 'Campo MODO_FALLA agregado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[ACTIVIDAD_NIVEL]') AND name = 'EFECTO_FALLA')
BEGIN
    ALTER TABLE [ACTIVIDAD_NIVEL]
    ADD [EFECTO_FALLA] VARCHAR(MAX) NULL;
    PRINT 'Campo EFECTO_FALLA agregado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[ACTIVIDAD_NIVEL]') AND name = 'TIEMPO_PROMEDIO_FALLA')
BEGIN
    ALTER TABLE [ACTIVIDAD_NIVEL]
    ADD [TIEMPO_PROMEDIO_FALLA] DECIMAL(10,2) NULL;
    PRINT 'Campo TIEMPO_PROMEDIO_FALLA agregado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[ACTIVIDAD_NIVEL]') AND name = 'UNIDAD_TIEMPO_FALLA')
BEGIN
    ALTER TABLE [ACTIVIDAD_NIVEL]
    ADD [UNIDAD_TIEMPO_FALLA] VARCHAR(20) NULL;
    PRINT 'Campo UNIDAD_TIEMPO_FALLA agregado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[ACTIVIDAD_NIVEL]') AND name = 'ID_CONSECUENCIA_FALLA')
BEGIN
    ALTER TABLE [ACTIVIDAD_NIVEL]
    ADD [ID_CONSECUENCIA_FALLA] INTEGER NULL;
    PRINT 'Campo ID_CONSECUENCIA_FALLA agregado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[ACTIVIDAD_NIVEL]') AND name = 'ID_CLASE_MANTENCION')
BEGIN
    ALTER TABLE [ACTIVIDAD_NIVEL]
    ADD [ID_CLASE_MANTENCION] INTEGER NULL;
    PRINT 'Campo ID_CLASE_MANTENCION agregado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[ACTIVIDAD_NIVEL]') AND name = 'TAREA_MANTENCION')
BEGIN
    ALTER TABLE [ACTIVIDAD_NIVEL]
    ADD [TAREA_MANTENCION] VARCHAR(MAX) NULL;
    PRINT 'Campo TAREA_MANTENCION agregado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[ACTIVIDAD_NIVEL]') AND name = 'FRECUENCIA_TAREA')
BEGIN
    ALTER TABLE [ACTIVIDAD_NIVEL]
    ADD [FRECUENCIA_TAREA] DECIMAL(10,2) NULL;
    PRINT 'Campo FRECUENCIA_TAREA agregado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[ACTIVIDAD_NIVEL]') AND name = 'UNIDAD_FRECUENCIA')
BEGIN
    ALTER TABLE [ACTIVIDAD_NIVEL]
    ADD [UNIDAD_FRECUENCIA] VARCHAR(20) NULL;
    PRINT 'Campo UNIDAD_FRECUENCIA agregado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[ACTIVIDAD_NIVEL]') AND name = 'DURACION_TAREA')
BEGIN
    ALTER TABLE [ACTIVIDAD_NIVEL]
    ADD [DURACION_TAREA] DECIMAL(10,2) NULL;
    PRINT 'Campo DURACION_TAREA agregado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[ACTIVIDAD_NIVEL]') AND name = 'CANTIDAD_RECURSOS')
BEGIN
    ALTER TABLE [ACTIVIDAD_NIVEL]
    ADD [CANTIDAD_RECURSOS] INTEGER NULL;
    PRINT 'Campo CANTIDAD_RECURSOS agregado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[ACTIVIDAD_NIVEL]') AND name = 'ID_CONDICION_ACCESO')
BEGIN
    ALTER TABLE [ACTIVIDAD_NIVEL]
    ADD [ID_CONDICION_ACCESO] INTEGER NULL;
    PRINT 'Campo ID_CONDICION_ACCESO agregado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[ACTIVIDAD_NIVEL]') AND name = 'ID_DISCIPLINA_TAREA')
BEGIN
    ALTER TABLE [ACTIVIDAD_NIVEL]
    ADD [ID_DISCIPLINA_TAREA] INTEGER NULL;
    PRINT 'Campo ID_DISCIPLINA_TAREA agregado';
END
GO

PRINT 'Campos agregados a ACTIVIDAD_NIVEL exitosamente';
GO

-- =============================================
-- PASO 2: CREAR NUEVAS TABLAS MAESTRAS
-- =============================================

PRINT 'Creando nuevas tablas maestras...';
GO

-- CONSECUENCIA_FALLA
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CONSECUENCIA_FALLA')
BEGIN
    CREATE TABLE [CONSECUENCIA_FALLA] (
        [ID_CONSECUENCIA] INTEGER NOT NULL IDENTITY(1,1),
        [CODIGO] VARCHAR(10) NOT NULL,
        [NOMBRE] VARCHAR(255) NOT NULL,
        PRIMARY KEY([ID_CONSECUENCIA])
    );
    PRINT 'Tabla CONSECUENCIA_FALLA creada';
END
ELSE
BEGIN
    PRINT 'Tabla CONSECUENCIA_FALLA ya existe';
END
GO

-- CLASE_MANTENCION
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CLASE_MANTENCION')
BEGIN
    CREATE TABLE [CLASE_MANTENCION] (
        [ID_CLASE] INTEGER NOT NULL IDENTITY(1,1),
        [CODIGO] VARCHAR(10) NOT NULL,
        [NOMBRE] VARCHAR(255) NOT NULL,
        PRIMARY KEY([ID_CLASE])
    );
    PRINT 'Tabla CLASE_MANTENCION creada';
END
ELSE
BEGIN
    PRINT 'Tabla CLASE_MANTENCION ya existe';
END
GO

-- CONDICION_ACCESO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CONDICION_ACCESO')
BEGIN
    CREATE TABLE [CONDICION_ACCESO] (
        [ID_CONDICION] INTEGER NOT NULL IDENTITY(1,1),
        [CODIGO] VARCHAR(10) NOT NULL,
        [NOMBRE] VARCHAR(255) NOT NULL,
        PRIMARY KEY([ID_CONDICION])
    );
    PRINT 'Tabla CONDICION_ACCESO creada';
END
ELSE
BEGIN
    PRINT 'Tabla CONDICION_ACCESO ya existe';
END
GO

-- DISCIPLINA_TAREA
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DISCIPLINA_TAREA')
BEGIN
    CREATE TABLE [DISCIPLINA_TAREA] (
        [ID_DISCIPLINA_TAREA] INTEGER NOT NULL IDENTITY(1,1),
        [CODIGO] VARCHAR(20) NOT NULL,
        [NOMBRE] VARCHAR(255) NOT NULL,
        PRIMARY KEY([ID_DISCIPLINA_TAREA])
    );
    PRINT 'Tabla DISCIPLINA_TAREA creada';
END
ELSE
BEGIN
    PRINT 'Tabla DISCIPLINA_TAREA ya existe';
END
GO

PRINT 'Tablas maestras creadas exitosamente';
GO

-- =============================================
-- PASO 3: CREAR ÍNDICES ÚNICOS PARA CÓDIGOS
-- =============================================

PRINT 'Creando índices únicos...';
GO

-- CONSECUENCIA_FALLA
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'UX_CONSECUENCIA_FALLA_CODIGO')
BEGIN
    CREATE UNIQUE INDEX UX_CONSECUENCIA_FALLA_CODIGO
    ON [CONSECUENCIA_FALLA]([CODIGO]);
    PRINT 'Índice UX_CONSECUENCIA_FALLA_CODIGO creado';
END
GO

-- CLASE_MANTENCION
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'UX_CLASE_MANTENCION_CODIGO')
BEGIN
    CREATE UNIQUE INDEX UX_CLASE_MANTENCION_CODIGO
    ON [CLASE_MANTENCION]([CODIGO]);
    PRINT 'Índice UX_CLASE_MANTENCION_CODIGO creado';
END
GO

-- CONDICION_ACCESO
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'UX_CONDICION_ACCESO_CODIGO')
BEGIN
    CREATE UNIQUE INDEX UX_CONDICION_ACCESO_CODIGO
    ON [CONDICION_ACCESO]([CODIGO]);
    PRINT 'Índice UX_CONDICION_ACCESO_CODIGO creado';
END
GO

-- DISCIPLINA_TAREA
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'UX_DISCIPLINA_TAREA_CODIGO')
BEGIN
    CREATE UNIQUE INDEX UX_DISCIPLINA_TAREA_CODIGO
    ON [DISCIPLINA_TAREA]([CODIGO]);
    PRINT 'Índice UX_DISCIPLINA_TAREA_CODIGO creado';
END
GO

PRINT 'Índices únicos creados exitosamente';
GO

-- =============================================
-- PASO 4: AGREGAR FOREIGN KEYS
-- =============================================

PRINT 'Agregando foreign keys...';
GO

-- ID_CONSECUENCIA_FALLA
IF NOT EXISTS (
    SELECT * FROM sys.foreign_keys 
    WHERE name = 'FK_ACTIVIDAD_NIVEL_CONSECUENCIA_FALLA'
)
BEGIN
    ALTER TABLE [ACTIVIDAD_NIVEL]
    ADD CONSTRAINT FK_ACTIVIDAD_NIVEL_CONSECUENCIA_FALLA
    FOREIGN KEY([ID_CONSECUENCIA_FALLA])
    REFERENCES [CONSECUENCIA_FALLA]([ID_CONSECUENCIA])
    ON UPDATE NO ACTION ON DELETE NO ACTION;
    PRINT 'FK_ACTIVIDAD_NIVEL_CONSECUENCIA_FALLA agregada';
END
GO

-- ID_CLASE_MANTENCION
IF NOT EXISTS (
    SELECT * FROM sys.foreign_keys 
    WHERE name = 'FK_ACTIVIDAD_NIVEL_CLASE_MANTENCION'
)
BEGIN
    ALTER TABLE [ACTIVIDAD_NIVEL]
    ADD CONSTRAINT FK_ACTIVIDAD_NIVEL_CLASE_MANTENCION
    FOREIGN KEY([ID_CLASE_MANTENCION])
    REFERENCES [CLASE_MANTENCION]([ID_CLASE])
    ON UPDATE NO ACTION ON DELETE NO ACTION;
    PRINT 'FK_ACTIVIDAD_NIVEL_CLASE_MANTENCION agregada';
END
GO

-- ID_CONDICION_ACCESO
IF NOT EXISTS (
    SELECT * FROM sys.foreign_keys 
    WHERE name = 'FK_ACTIVIDAD_NIVEL_CONDICION_ACCESO'
)
BEGIN
    ALTER TABLE [ACTIVIDAD_NIVEL]
    ADD CONSTRAINT FK_ACTIVIDAD_NIVEL_CONDICION_ACCESO
    FOREIGN KEY([ID_CONDICION_ACCESO])
    REFERENCES [CONDICION_ACCESO]([ID_CONDICION])
    ON UPDATE NO ACTION ON DELETE NO ACTION;
    PRINT 'FK_ACTIVIDAD_NIVEL_CONDICION_ACCESO agregada';
END
GO

-- ID_DISCIPLINA_TAREA
IF NOT EXISTS (
    SELECT * FROM sys.foreign_keys 
    WHERE name = 'FK_ACTIVIDAD_NIVEL_DISCIPLINA_TAREA'
)
BEGIN
    ALTER TABLE [ACTIVIDAD_NIVEL]
    ADD CONSTRAINT FK_ACTIVIDAD_NIVEL_DISCIPLINA_TAREA
    FOREIGN KEY([ID_DISCIPLINA_TAREA])
    REFERENCES [DISCIPLINA_TAREA]([ID_DISCIPLINA_TAREA])
    ON UPDATE NO ACTION ON DELETE NO ACTION;
    PRINT 'FK_ACTIVIDAD_NIVEL_DISCIPLINA_TAREA agregada';
END
GO

PRINT 'Foreign keys agregadas exitosamente';
GO

-- =============================================
-- PASO 5: INSERTAR DATOS SINTÉTICOS
-- =============================================

PRINT 'Insertando datos sintéticos...';
GO

-- CONSECUENCIA_FALLA
IF NOT EXISTS (SELECT * FROM [CONSECUENCIA_FALLA] WHERE CODIGO = 'E')
BEGIN
    INSERT INTO [CONSECUENCIA_FALLA] ([CODIGO], [NOMBRE]) VALUES
    ('E', 'Consecuencia al medio ambiente'),
    ('H', 'Consecuencia Escondida'),
    ('N', 'Consecuencia NO Operacional'),
    ('O', 'Consecuencia Operacional'),
    ('S', 'Consecuencia de Seguridad Personal');
    PRINT '5 registros insertados en CONSECUENCIA_FALLA';
END
ELSE
BEGIN
    PRINT 'CONSECUENCIA_FALLA ya tiene datos';
END
GO

-- CLASE_MANTENCION
IF NOT EXISTS (SELECT * FROM [CLASE_MANTENCION] WHERE CODIGO = 'OHF')
BEGIN
    INSERT INTO [CLASE_MANTENCION] ([CODIGO], [NOMBRE]) VALUES
    ('OHF', 'Operar hasta la Falla'),
    ('PDM', 'Tareas de mantención predictiva'),
    ('REEM', 'Tareas de Reemplazo Programadas'),
    ('REST', 'Tareas de Restauraciones Programadas'),
    ('TAREA', 'Tarea de Frecuencia Fija');
    PRINT '5 registros insertados en CLASE_MANTENCION';
END
ELSE
BEGIN
    PRINT 'CLASE_MANTENCION ya tiene datos';
END
GO

-- CONDICION_ACCESO
IF NOT EXISTS (SELECT * FROM [CONDICION_ACCESO] WHERE CODIGO = 'ED')
BEGIN
    INSERT INTO [CONDICION_ACCESO] ([CODIGO], [NOMBRE]) VALUES
    ('ED', 'Equipo Detenido'),
    ('EF', 'Equipo en Marcha');
    PRINT '2 registros insertados en CONDICION_ACCESO';
END
ELSE
BEGIN
    PRINT 'CONDICION_ACCESO ya tiene datos';
END
GO

-- DISCIPLINA_TAREA
IF NOT EXISTS (SELECT * FROM [DISCIPLINA_TAREA] WHERE CODIGO = 'ANA_ACTE')
BEGIN
    INSERT INTO [DISCIPLINA_TAREA] ([CODIGO], [NOMBRE]) VALUES
    ('ANA_ACTE', 'Analista en Aceite'),
    ('ANA_TERM', 'Analista en Termografía'),
    ('ANA_VIBR', 'Analista en Vibración'),
    ('C_CAB_M', 'Mecánico Contratista Cabina/Aire AC'),
    ('C_ELE_EL', 'Eléctrico Equipo Liviano Contratista'),
    ('C_MEC_EL', 'Mecánico Equipo Liviano Contratista'),
    ('C_MEC_FL', 'Mecánico Contratista Finning Camiones'),
    ('C_MECA_M', 'Mecánico Mina Contratista'),
    ('CON_EXT', 'CONTRATISTA EXTINTORES'),
    ('ELE_CAMI', 'Eléctrico de Camiones'),
    ('ELE_MANT', 'Eléctrico de Mantención Camiones'),
    ('ELE_PLPER', 'Eléctrico Palas-Perfo'),
    ('ELEC', 'Eléctrico - Planta'),
    ('ELEC_PDM', 'Predictivo Eléctrico - Planta'),
    ('ELIN_HUM', 'Elec-Inst A. Humeda'),
    ('ELIN_SEC', 'Elec-Inst A. Seca'),
    ('INST', 'Instrumentación - Planta'),
    ('LUB_CHANC', 'Lubricador Chancado'),
    ('LUB_SX', 'Lubricador SX'),
    ('LUB_TERR', 'Lubricador de palas y perforadoras'),
    ('MEC_CAMI', 'Mecanico Camiones'),
    ('MEC_CHANC', 'Mecánico Chancado'),
    ('MEC_MANT', 'Mecánico Mantención'),
    ('MEC_MOTO', 'Mecánico Motores'),
    ('MEC_PLPER', 'Mecánico Palas-Perfo'),
    ('MEC_SERV', 'Mecanico Servicio'),
    ('MEC_SX', 'Mecánico SX'),
    ('MEC_TERR', 'Mecánico de Terreno Camiones'),
    ('OO_CC', 'Obras Civiles'),
    ('OP_APIL', 'Operaciones Apilado'),
    ('OP_CHANC', 'Operaciones Chancado'),
    ('OP_RO', 'Operaciones Osmosis'),
    ('OP_SX', 'Operaciones SX'),
    ('OPE_PLPER', 'Operaciones Palas-Perfo'),
    ('PDM_MEC', 'Predictivo Mecánico'),
    ('SOL_CAMI', 'Soldador Camiones'),
    ('SOL_PALA', 'Soldador Palas y perforadoras');
    PRINT '37 registros insertados en DISCIPLINA_TAREA';
END
ELSE
BEGIN
    PRINT 'DISCIPLINA_TAREA ya tiene datos';
END
GO

-- =============================================
-- FINALIZACIÓN
-- =============================================

PRINT '========================================';
PRINT 'SCRIPT COMPLETADO EXITOSAMENTE';
PRINT '========================================';
PRINT 'Resumen:';
PRINT '- Campos agregados a ACTIVIDAD_NIVEL: 14';
PRINT '- Tablas maestras creadas: 4';
PRINT '- Foreign keys agregadas: 4';
PRINT '- Índices únicos creados: 4';
PRINT '- Registros insertados: 49';
PRINT '========================================';
GO

