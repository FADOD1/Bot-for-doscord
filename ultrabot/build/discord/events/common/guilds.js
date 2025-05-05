import { createEvent } from "#base";
createEvent({
    name: "Listar servidores ao iniciar",
    event: "ready",
    async run(client) {
        console.log(`✅ Bot online em ${client.user?.tag}`);
        // Lista todas as guilds (servidores) onde o bot está
        const guilds = client.guilds.cache;
        console.log("\n🛡️ Servidores onde estou presente:");
        guilds.forEach((guild) => {
            console.log(`- ${guild.name} (ID: ${guild.id}) | Membros: ${guild.memberCount}`);
        });
        console.log(`\n📊 Total de servidores: ${guilds.size}`);
    },
});
