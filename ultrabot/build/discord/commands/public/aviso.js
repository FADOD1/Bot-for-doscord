import { createCommand } from "#base";
import { ApplicationCommandType, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, } from "discord.js";
createCommand({
    name: "aviso",
    description: "Posta uma embed personalizada em um canal específico.",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["ManageMessages"],
    options: [
        {
            name: "canal",
            description: "Selecione o canal onde será postada a embed",
            type: 7,
            channelTypes: [ChannelType.GuildText],
            required: true,
        },
        {
            name: "titulo",
            description: "Título da embed",
            type: 3,
            required: false,
        },
        {
            name: "descricao",
            description: "Descrição da embed (suporte a formatação Markdown)",
            type: 3,
            required: false,
        },
        {
            name: "discord",
            description: "Link do nosso discord",
            type: 3,
            required: false,
        },
        {
            name: "youtube",
            description: "Link do YouTube para o botão",
            type: 3,
            required: false,
        },
        {
            name: "imagem",
            description: "URL de uma imagem para a embed",
            type: 3,
            required: false,
        },
        {
            name: "footer",
            description: "Texto do rodapé da embed",
            type: 3,
            required: false,
        },
        {
            name: "video",
            description: "Anexe o arquivo de vídeo (.mp4, etc.)",
            type: 11,
            required: false,
        },
    ],
    async run(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const canal = interaction.options.getChannel("canal");
        const titulo = interaction.options.getString("titulo");
        const descricao = interaction.options.getString("descricao");
        const imagem = interaction.options.getString("imagem");
        const video = interaction.options.getAttachment("video");
        const downloadLink = interaction.options.getString("discord");
        const youtubeLink = interaction.options.getString("youtube");
        const footer = interaction.options.getString("footer");
        if (!canal || !canal.isTextBased()) {
            await interaction.followUp({
                content: "O canal selecionado não é válido para enviar mensagens.",
                ephemeral: true,
            });
            return;
        }
        const descricaoFormatada = descricao?.trim().replace(/\\n/g, "\n");
        const userAvatarURL = interaction.user.displayAvatarURL({ extension: "png", size: 512 });
        const embed = new EmbedBuilder()
            .setAuthor({ name: `Aviso postado por ${interaction.user.tag}`, iconURL: userAvatarURL })
            .setTitle(titulo || "Aviso")
            .setDescription(descricaoFormatada || "Sem descrição fornecida.")
            .setColor("#4354ff")
            .setThumbnail(userAvatarURL)
            .setFooter({ text: footer || "© Ultragaz Mods. Todos os Direitos Reservados." })
            .setTimestamp();
        if (imagem)
            embed.setImage(imagem);
        const buttons = [];
        if (downloadLink) {
            buttons.push(new ButtonBuilder()
                .setLabel("Discord")
                .setEmoji("🛢")
                .setStyle(ButtonStyle.Link)
                .setURL(downloadLink));
        }
        if (youtubeLink) {
            buttons.push(new ButtonBuilder()
                .setLabel("YouTube")
                .setEmoji("▶️")
                .setStyle(ButtonStyle.Link)
                .setURL(youtubeLink));
        }
        const components = buttons.length > 0 ? [new ActionRowBuilder().addComponents(buttons)] : [];
        const message = await canal.send({
            embeds: [embed],
            components,
        });
        await message.react("✅");
        await message.react("❌");
        if (video) {
            const attachment = new AttachmentBuilder(video.url, { name: video.name });
            await canal.send({ files: [attachment] });
        }
        await interaction.followUp({
            content: "Embed enviada com sucesso! Confira o canal selecionado.",
            ephemeral: true,
        });
    },
});
