-- =============================================
-- SCRIPT SQL - EXTENSIÓN DE NIVEL
-- Agrega campos Disciplina y Unidad Mantenible + catálogo DISCIPLINA_NIVEL
-- =============================================
-- IMPORTANTE: Ejecutar en la base de datos correspondiente (cambiar USE)
-- =============================================

USE [TU_BASE_DE_DATOS]; -- ⚠️ Reemplazar por el nombre real de la BD
GO

PRINT '== INICIANDO SCRIPT DE EXTENSIÓN DE NIVEL ==';
GO

-- =============================================
-- 1. CREAR TABLA MAESTRA DISCIPLINA_NIVEL
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DISCIPLINA_NIVEL')
BEGIN
    CREATE TABLE [DISCIPLINA_NIVEL] (
        [ID_DISCIPLINA_NIVEL] INTEGER NOT NULL IDENTITY(1,1),
        [CODIGO] VARCHAR(10) NOT NULL,
        [DESCRIPCION] VARCHAR(255) NOT NULL,
        CONSTRAINT PK_DISCIPLINA_NIVEL PRIMARY KEY ([ID_DISCIPLINA_NIVEL])
    );
    PRINT 'Tabla DISCIPLINA_NIVEL creada';
END
ELSE
BEGIN
    PRINT 'Tabla DISCIPLINA_NIVEL ya existe (se omite creación)';
END
GO

-- =============================================
-- 2. AGREGAR COLUMNAS A NIVEL
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('NIVEL') AND name = 'ID_DISCIPLINA_NIVEL')
BEGIN
    ALTER TABLE [NIVEL]
    ADD [ID_DISCIPLINA_NIVEL] INTEGER NULL;
    PRINT 'Columna ID_DISCIPLINA_NIVEL agregada a NIVEL';
END
ELSE
BEGIN
    PRINT 'Columna ID_DISCIPLINA_NIVEL ya existe en NIVEL';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('NIVEL') AND name = 'UNIDAD_MANTENIBLE')
BEGIN
    ALTER TABLE [NIVEL]
    ADD [UNIDAD_MANTENIBLE] BIT NOT NULL DEFAULT 0;
    PRINT 'Columna UNIDAD_MANTENIBLE agregada a NIVEL';
END
ELSE
BEGIN
    PRINT 'Columna UNIDAD_MANTENIBLE ya existe en NIVEL';
END
GO

-- =============================================
-- 3. CREAR INDICE ÚNICO PARA CODIGO
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'UX_DISCIPLINA_NIVEL_CODIGO')
BEGIN
    CREATE UNIQUE INDEX UX_DISCIPLINA_NIVEL_CODIGO
    ON [DISCIPLINA_NIVEL]([CODIGO]);
    PRINT 'Índice UX_DISCIPLINA_NIVEL_CODIGO creado';
END
ELSE
BEGIN
    PRINT 'Índice UX_DISCIPLINA_NIVEL_CODIGO ya existe';
END
GO

-- =============================================
-- 4. AGREGAR FOREIGN KEY DESDE NIVEL
-- =============================================
IF NOT EXISTS (
    SELECT * FROM sys.foreign_keys WHERE name = 'FK_NIVEL_DISCIPLINA_NIVEL'
)
BEGIN
    ALTER TABLE [NIVEL]
    ADD CONSTRAINT FK_NIVEL_DISCIPLINA_NIVEL
    FOREIGN KEY ([ID_DISCIPLINA_NIVEL])
    REFERENCES [DISCIPLINA_NIVEL]([ID_DISCIPLINA_NIVEL])
    ON UPDATE NO ACTION ON DELETE NO ACTION;
    PRINT 'FK_NIVEL_DISCIPLINA_NIVEL creada';
END
ELSE
BEGIN
    PRINT 'FK_NIVEL_DISCIPLINA_NIVEL ya existe';
END
GO

-- =============================================
-- 5. DATOS SINTÉTICOS PARA DISCIPLINA_NIVEL
-- =============================================
IF NOT EXISTS (SELECT * FROM [DISCIPLINA_NIVEL])
BEGIN
    INSERT INTO [DISCIPLINA_NIVEL] ([CODIGO], [DESCRIPCION]) VALUES
    ('E', 'Eléctrico'),
    ('G', 'General'),
    ('I', 'Instrumentación'),
    ('M', 'Mecánico');
    PRINT 'Datos sintéticos insertados en DISCIPLINA_NIVEL';
END
ELSE
BEGIN
    PRINT 'DISCIPLINA_NIVEL ya contiene datos (se omite inserción)';
END
GO

PRINT '== SCRIPT DE EXTENSIÓN DE NIVEL COMPLETADO ==';
GO
