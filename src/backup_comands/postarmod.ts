// definitive postarmod

import { createCommand } from "#base";
import {
    ApplicationCommandType,
    ChannelType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder
} from "discord.js";

createCommand({
    name: "postarmod",
    description: "Posta uma embed personalizada em um canal específico.",
    type: ApplicationCommandType.ChatInput,
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
            required: true,
        },
        {
            name: "descricao",
            description: "Descrição da embed (suporte a formatação Markdown)",
            type: 3,
            required: true,
        },
        {
            name: "descricao2",
            description: "Segunda parte da descrição (suporte a formatação Markdown, negrito, e espaçamento)",
            type: 3,
            required: false,
        },
        {
            name: "descricao3",
            description: "Terceira parte da descrição (suporte a formatação Markdown, negrito, e espaçamento)",
            type: 3,
            required: false,
        },
        {
            name: "download",
            description: "Link de download para o botão",
            type: 3,
            required: false,
        },
        {
            name: "encurta",
            description: "Link de download encurtado",
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
            name: "banner",
            description: "URL de uma imagem maior ao lado do icon",
            type: 3,
            required: false,
        },
        {
            name: "footer",
            description: "Footer custom",
            type: 3,
            required: false,
        },
        {
            name: "video",
            description: "Anexe o arquivo de vídeo (.mp4, etc.)",
            type: 11,
            required: false,
        },
        {
            name: "arquivo",
            description: "Anexe o arquivo para download direto",
            type: 11,
            required: false,
        },
    ],
    async run(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const canal = interaction.options.getChannel("canal", true);
        const titulo = interaction.options.getString("titulo", true);
        const titulo2 = interaction.options.getString("titulo2");
        const titulo3 = interaction.options.getString("titulo3");
        const descricao = interaction.options.getString("descricao", true);
        const descricao2 = interaction.options.getString("descricao2");
        const descricao3 = interaction.options.getString("descricao3");
        const imagem = interaction.options.getString("imagem");
        const banner = interaction.options.getString("banner");
        const video = interaction.options.getAttachment("video");
        const downloadLink = interaction.options.getString("download");
        const encurtaLink = interaction.options.getString("encurta");
        const youtubeLink = interaction.options.getString("youtube");
        const footer = interaction.options.getString("footer") ?? "© Ultragaz Mods. Todos os Direitos Reservados.";
        const arquivo = interaction.options.getAttachment("arquivo");
        const autor = interaction.user;

        if (!canal.isTextBased()) {
            return interaction.followUp({
                content: "❌ Canal inválido! Selecione um canal de texto.",
                ephemeral: true
            });
        }

        // Processar textos com quebras de linha
        const processarTexto = (texto: string | null) => 
            texto ? texto.replace(/\\n/g, "\n") : "";

        // Combinar títulos e descrições
        const tituloCompleto = [titulo, titulo2, titulo3]
            .map(processarTexto)
            .filter(Boolean)
            .join('\n');

        const descricaoCompleta = [descricao, descricao2, descricao3]
            .map(processarTexto)
            .filter(Boolean)
            .join('\n\n');

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Mod postado por: ${autor.username}`, iconURL: autor.displayAvatarURL() })
            .setTitle(tituloCompleto)
            .setDescription(descricaoCompleta)
            .setColor("#4354ff")
            .setFooter({ text: footer })
            .setTimestamp();

        if (imagem) embed.setImage(imagem);
        embed.setThumbnail(banner || autor.displayAvatarURL());

        const buttonsRow = new ActionRowBuilder<ButtonBuilder>();

        // Adicionar botões
        [downloadLink, encurtaLink, youtubeLink].forEach((link, index) => {
            if (!link) return;
            
            const buttonConfig = {
                0: {
                    label: "Download",
                    emoji: "1336552472487137346",
                    style: ButtonStyle.Link
                },
                1: {
                    label: "Download Encurta",
                    emoji: "1336552472487137346",
                    style: ButtonStyle.Link
                },
                2: {
                    label: "YouTube",
                    emoji: "1334557136616685648",
                    style: ButtonStyle.Link
                }
            }[index];

            if (buttonConfig) {
                buttonsRow.addComponents(
                    new ButtonBuilder()
                        .setLabel(buttonConfig.label)
                        .setEmoji({ id: buttonConfig.emoji })
                        .setStyle(buttonConfig.style)
                        .setURL(link)
                );
            }
        });

        try {
            const mainMessage = await canal.send({
                embeds: [embed],
                components: buttonsRow.components.length > 0 ? [buttonsRow] : []
            });

            // Enviar arquivos adicionais
            if (arquivo) {
                await canal.send({ files: [new AttachmentBuilder(arquivo.url)] });
            }

            // Lidar com vídeo e reações
            const targetMessage = video ? await canal.send({ files: [new AttachmentBuilder(video.url)] }) : mainMessage;
            await targetMessage.react("1328485808570892399");
            await targetMessage.react("1328485863138656317");

            return interaction.followUp({
                content: "✅ Mod postado com sucesso!",
                ephemeral: true
            });

        } catch (error) {
            console.error(error);
            return interaction.followUp({
                content: "❌ Ocorreu um erro ao postar o mod verifique os logs!",
                ephemeral: true
            });
        }
    },
});