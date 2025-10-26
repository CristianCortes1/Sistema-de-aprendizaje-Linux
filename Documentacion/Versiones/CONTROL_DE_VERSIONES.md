# 📚 Control de Versiones de Documentos

Este archivo centraliza el versionado y el historial de cambios de los documentos de la carpeta `Documentacion/`.

---

## 🎯 Objetivo y alcance
- Establecer un esquema único de versionado para documentos (plantillas, guías, políticas, manuales, etc.).
- Mantener un historial de cambios auditable por documento.
- Registrar estados y responsables.

Aplica a cualquier documento bajo `Documentacion/` y subcarpetas (excepto actas de reuniones fechadas que son snapshots independientes).

---

## 🧭 Esquema de versiones (SemVer documental)
- Formato: Mayor.Menor.Parche (ej.: `2.1.0`).
  - Mayor: cambios de alcance o estructura que reordenan/rompen el documento.
  - Menor: secciones nuevas o mejoras sin romper estructura base.
  - Parche: correcciones menores (typos, redacción, links).

## 🏷️ Estados
- Borrador → En revisión → Aprobado → Obsoleto

---

## 🔁 Flujo de cambios recomendado
1) Proponer cambio (issue/tarea) y estimar impacto (Mayor/Menor/Parche).
2) Editar documento, actualizar versión acorde y completar historial.
3) Revisar y aprobar (si aplica).
4) Congelar versión previa importante (PDF/DOCX) en `Documentacion/Releases/`.
5) (Opcional) Crear tag en Git: `v{X.Y.Z}-doc-{NOMBRE}`.

---

## 🗂️ Convenciones de archivos y snapshots
- Mantener **un archivo fuente** por documento (idealmente Markdown).
- Generar snapshots en hitos (Mayor o entregables):
  - `Documentacion/Releases/{NOMBRE}_v{X.Y.Z}.pdf`
- Evitar duplicar fuentes por versión; usar historial en este archivo.

---

## 📋 Tabla maestra de documentos
Actualiza esta tabla cuando cambie la versión, estado o responsables.

| Documento | ID | Versión actual | Estado | Propietario/Equipo | Última actualización | Ruta |
|-----------|----|-----------------|--------|--------------------|----------------------|------|
| SCRIPT_PLANNING.md | DOC-001 | 1.0.0 | Plantilla | Equipo | 2025-10-23 | Documentacion/SCRIPT_PLANNING.md |
| | | | | | | |

> Nota: añade aquí más documentos a medida que los vayas gestionando.

---

## 🧾 Historial de cambios por documento
Registra cada cambio con claridad (qué, por qué, quién, cuándo). Usa estas subsecciones y repítelas por documento.

### SCRIPT_PLANNING.md (DOC-001)
- Ruta: `Documentacion/SCRIPT_PLANNING.md`

| Versión | Fecha | Autor | Cambios clave | Aprobado por |
|--------:|-------|-------|---------------|--------------|
| 1.0.0 | 2025-10-23 | {Tu nombre} | Creación de plantilla genérica para reuniones. | {Revisor} |

#### Notas
- Estado actual: Plantilla
- Próximos cambios previstos: Añadir ejemplo rellenable por tipo de reunión.

---

### {NOMBRE_DEL_DOCUMENTO}.md (DOC-XXX)
- Ruta: `Documentacion/{NOMBRE_DEL_DOCUMENTO}.md`

| Versión | Fecha | Autor | Cambios clave | Aprobado por |
|--------:|-------|-------|---------------|--------------|
| X.Y.Z | YYYY-MM-DD | {Nombre} | {Descripción breve del cambio} | {Revisor} |
| X.Y.Z | YYYY-MM-DD | {Nombre} | {Descripción breve del cambio} | {Revisor} |

#### Notas
- Estado actual: {Borrador | En revisión | Aprobado | Obsoleto}
- Próximos cambios previstos: {Opcional}

---

## ✅ Buenas prácticas
- Mensajes claros en el historial (qué y por qué), enlaza a issue/tarea cuando exista.
- Mantén consistencia en los términos y en el formato de tablas.
- Revisa ortografía y links antes de publicar una nueva versión.
- Si el documento impacta procesos, registra quién lo aprueba y cuándo.

---

## 🧩 Anexos (opcionales)
- Comandos de exportación a PDF/DOCX (Pandoc/VS Code).
- Lista de tags Git usados para releases documentales.
