import { createCommand } from "#base";

createCommand({
    name: "servers", // Nome do comando (ex: !servers)
    description: "Mostra em quais servidores o bot está",
    async run(interaction) {
        
        const guilds = interaction.client.guilds.cache;
        
        // Formata a lista de servidores
        const serverList = guilds.map(
            (guild) => `**${guild.name}** (ID: \`${guild.id}\`) 👥 **${guild.memberCount} membros**`
        ).join("\n");

        // Envia a resposta (dividida em chunks se for muito grande)
        await interaction.reply({
            embeds: [{
                title: "🌍 Servidores onde estou presente",
                description: serverList.slice(0, 2000), // Discord limita a 2000 caracteres
                color: 0x00FF00, // Cor verde
                footer: { text: `📊 Total: ${guilds.size} servidores` },
            }],
        });
    },
});