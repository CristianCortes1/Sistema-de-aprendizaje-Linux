<template>

    <div class="dashboard">

        <header class="header">
            <div class="logo">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" alt="Penguin" class="logo" />
                <span class="brand">Penguin Path</span>
                <!-- <h1 class="brand">Penguin Path</h1> -->
            </div>

            <div class="status">
                <div class="streak">
                    <img src="@/Assets/Racha.svg" alt="Racha" />
                    <span>Racha: 5 días</span>
                </div>
                <div class="xp">
                    <img src="@/Assets/xp.svg" alt="XP" />
                    <span>120 XP</span>
                </div>
                <div class="perfil">
                    <img src="@/Assets/Avatar2.svg" alt="Perfil" />
                    <span>Pedrito</span>
                </div>
            </div>
        </header>

        <h1 class="titulo">Tu camino en Linux 🐧</h1>

        <div class="form-group">
            <div class="card">
                <button type="button">
                    <span>>_</span>
                    <span>Comandos básicos</span>
                </button>
            </div>
            <div class="card">
                <button type="button">
                    <img src="@/Assets/Archivos.svg" alt="Archivos" />
                    <span>Archivos y directorios</span>
                </button>
            </div>
            <div class="card">
                <button type="button">
                    <img src="@/Assets/Permisos.svg" alt="Permisos" />
                    <span>Permisos</span>
                </button>
            </div>
            <div class="card">
                <button type="button">
                    <img src="@/Assets/Procesos.svg" alt="Procesos" />
                    <span>Procesos y señales</span>
                </button>
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

    </div>

</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.dashboard {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #d17a47 0%, #8b4a6b 50%, #4a2c5a 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px;
    background: linear-gradient(135deg, #ca672d 0%, #411a56 100%);
    min-height: 80px;
    /*border-bottom: 1px solid #dee2e6;*/
}

.logo {
    display: flex;
    align-items: center;
    gap: 12;
}

.logo img {
    width: 40px;
    height: 40px;
    object-fit: contain;
}

.brand {
    font-size: 22px;
    font-weight: bold;
}

.status {
    display: flex;
    align-items: center;
    gap: 15px;
}

.status div {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: bold;
}

.status img {
    width: 28px;
    height: 28px;
    object-fit: contain;
    border-radius: 50%;
}

.status .perfil img {
    background-color: white;
    border-radius: 90%;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.titulo {
    text-align: center;
    margin: 20px 0;
    font-size: 35px;
    font-weight: bold;
}

.form-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
    padding: 20px;
    padding-bottom: 120px;
}

.form-group button {
    width: 270px;
    height: 200px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border: none;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.form-group .card:nth-child(1) button {
    background: #1e88e5;
    border: 2px solid #bdbdbd;
}

.form-group .card:nth-child(2) button {
    background: #fbc02d;
    color: #333;
    border: 2px solid #bdbdbd;
}

.form-group .card:nth-child(3) button {
    background: #424242;
    border: 2px solid #bdbdbd;
}

.form-group .card:nth-child(4) button {
    background: #424242;
    border: 2px solid #bdbdbd;
}

.form-group button:hover {
    transform: scale(1.05);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.form-group button img {
    width: 60px;
    height: 60px;
    object-fit: contain;
}

.footer {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: linear-gradient(to right, #1f1f3a, #2c003e);
    padding: 15px;
    position: fixed;
    bottom: 0;
    width: 100%;
}

.footer button {
    background: none;
    border: none;
    color: white;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.footer button img {
    width: 32px;
    height: 32px;
    object-fit: contain;
}

.footer .barra-inicio button img {
    width: 45px;
    height: 45px;
    object-fit: contain;
}

@media (max-width: 768px) {
    .header {
        padding: 15px 15px;
        min-height: 70px;
    }

    .header img.logo {
        width: 32px;
        height: 32px;
    }

    .brand {
        font-size: 18px;
    }

    .status {
        gap: 10px;
        font-size: 11px;
    }

    .perfil {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 0.8rem;
    }

    .form-group {
        flex-direction: column;
        align-items: center;
    }

    .form-group .card {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
        padding: 10px;
    }

    .footer {
        flex-direction: row;
        justify-content: space-around;
    }
}
</style>
