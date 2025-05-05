import { createCommand } from "#base";
import { ApplicationCommandType, ChannelType,
// EmbedBuilder,
// ActionRowBuilder,
// ButtonBuilder,
// ButtonStyle,
 } from "discord.js";
createCommand({
    name: "enviarmsg",
    description: "Envia uma mensagem personalizada para um canal específico.",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["ManageMessages"],
    options: [
        {
            name: "canal",
            description: "Selecione o canal onde será enviada a mensagem",
            type: 7,
            channelTypes: [ChannelType.GuildText],
            required: true,
        },
        {
            name: "mensagem",
            description: "Mensagem a ser enviada no canal",
            type: 3,
            required: true,
        },
    ],
    async run(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const canal = interaction.options.getChannel("canal");
        const mensagem = interaction.options.getString("mensagem");
        if (!canal || !canal.isTextBased()) {
            await interaction.followUp({
                content: "O canal selecionado não é válido para enviar mensagens.",
                ephemeral: true,
            });
            return;
        }
        // Verificar se a mensagem não é nula antes de enviar
        if (mensagem != null) {
            await canal.send({
                content: mensagem,
            });
            await interaction.followUp({
                content: "Mensagem enviada com sucesso!",
                ephemeral: true,
            });
        }
        else {
            await interaction.followUp({
                content: "A mensagem não pode ser vazia.",
                ephemeral: true,
            });
        }
    },
});
