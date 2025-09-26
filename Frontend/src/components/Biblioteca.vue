<template>

    <div class="biblioteca">
        <div class=" header">
            <h1>Biblioteca</h1>
        </div>

        <div class="comandos-basicos">
            <table>
                <thead>
                    <tr>
                        <th class="titulo">Comandos básicos</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>→ ls</td>
                    </tr>
                    <tr>
                        <td>→ pw</td>
                    </tr>
                    <tr>
                        <td>→ cd</td>
                    </tr>
                    <tr>
                        <td>→ echo</td>
                    </tr>
                    <tr>
                        <td>→ clear</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="archivos-y-directorios">
            <table>
                <thead>
                    <tr>
                        <th class="titulo">Archivos y directorios</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>→ touch</td>
                    </tr>
                    <tr>
                        <td>→ mkdir</td>
                    </tr>
                    <tr>
                        <td>→ rm</td>
                    </tr>
                    <tr>
                        <td>→ rmdir</td>
                    </tr>
                    <tr>
                        <td>→ cp</td>
                    </tr>
                    <tr>
                        <td>→ mv</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="bloqueados">
            <div class="permisos">Permisos
                <span class="permiso">Aún no disponible</span>
            </div>
            <div class="procesos">Procesos y señales
                <span class="proceso">Aún no disponible</span>
            </div>
        </div>
    </div>

    <footer class="footer">
        <div class="barra-inicio">
            <button type="button"><img src="@/Assets/Inicio.svg">Inicio</button>
        </div>
        <div class="barra">
            <button type="button"><img src="@/Assets/Biblioteca.svg">Biblioteca</button>
        </div>
        <div class="barra">
            <button type="button"><img src="@/Assets/Ranking.svg">Ranking</button>
        </div>
        <div class="barra">
            <button type="button"><img src="@/Assets/Configuración.svg">Configuracion</button>
        </div>
    </footer>


</template>

<style scoped>



</style>