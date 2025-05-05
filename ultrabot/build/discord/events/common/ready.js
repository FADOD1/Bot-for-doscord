import { createEvent } from "#base";
createEvent({
    name: "Bot pronto",
    event: "ready",
    async run(client) {
        console.log(`Iniciando evento de perfil em ${client.user?.tag}`);
        const statuses = [
            { name: "SA-MP", type: 0 }, // Jogando SA-MP
            { name: "Tijolo samp", type: 3 }, // Assistindo Ultranews
            { name: "um rock pesadão", type: 2 }, // Ouvindo Spotify
            { name: "Gta San Andreas", type: 0 }, //Jogando ultramods.store
            { name: "Não use datas que se autodenominam 'fivem'", type: 3 }, // Assistindo
            { name: "Entre no antigo servidor para achar varios mods", type: 3 }, // Assistindo
        ];
        let index = 0;
        setInterval(() => {
            const status = statuses[index];
            client.user?.setActivity(status.name, { type: status.type });
            index = (index + 1) % statuses.length; // Alterna entre os status
        }, 10000); // Troca a cada 100 segundos
    },
});
