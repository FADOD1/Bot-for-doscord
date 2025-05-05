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
            description: "Título principal da embed",
            type: 3,
            required: false,
        },
        /*{
            name: "titulo1",
            description: "Primeiro subtítulo (aparecerá em negrito na descrição)",
            type: 3,
            required: false,
        },
        {
            name: "titulo2",
            description: "Segundo subtítulo (aparecerá em negrito na descrição)",
            type: 3,
            required: false,
        },
        {
            name: "titulo3",
            description: "Terceiro subtítulo (aparecerá em negrito na descrição)",
            type: 3,
            required: false,
        },*/
        {
            name: "descricao",
            description: "Descrição principal (suporte a formatação Markdown)",
            type: 3,
            required: false,
        },
        /*{
            name: "descricao1",
            description: "Primeira seção da descrição (aparecerá após o primeiro subtítulo)",
            type: 3,
            required: false,
        },
        {
            name: "descricao2",
            description: "Segunda seção da descrição",
            type: 3,
            required: false,
        },
        {
            name: "descricao3",
            description: "Terceira seção da descrição",
            type: 3,
            required: false,
        },*/
        {
            name: "download",
            description: "Link de download para o botão",
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
            name: "icone",
            description: "URL de uma imagem maior ao lado do icon",
            type: 3,
            required: false,
        },
        /*{
            name: "footer",
            description: "Footer custom",
            type: 3,
            required: false,
        },*/
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
        const titulo = interaction.options.getString("titulo");
        //const titulo1 = interaction.options.getString("titulo1");
        //const titulo2 = interaction.options.getString("titulo2");
        //const titulo3 = interaction.options.getString("titulo3");
        const descricao = interaction.options.getString("descricao");
        //const descricao1 = interaction.options.getString("descricao1");
        //const descricao2 = interaction.options.getString("descricao2");
        //const descricao3 = interaction.options.getString("descricao3");
        const imagem = interaction.options.getString("imagem");
        const banner = interaction.options.getString("banner");
        const video = interaction.options.getAttachment("video");
        const downloadLink = interaction.options.getString("download");
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

        // Construir a descrição com títulos em negrito e espaçamento
        let descricaoCompleta = "";
        
        // Adicionar descrição principal se existir
        if (descricao) descricaoCompleta += processarTexto(descricao) + "\n\n";
        
        /*
        if (titulo1) descricaoCompleta += `**${processarTexto(titulo1)}**\n`;
        if (descricao1) descricaoCompleta += processarTexto(descricao1) + "\n\n";
        
        if (titulo2) descricaoCompleta += `**${processarTexto(titulo2)}**\n`;
        if (descricao2) descricaoCompleta += processarTexto(descricao2) + "\n\n";
        
        if (titulo3) descricaoCompleta += `**${processarTexto(titulo3)}**\n`;
        if (descricao3) descricaoCompleta += processarTexto(descricao3) + "\n\n";*/

        // Remover espaços extras no final
        descricaoCompleta = descricaoCompleta.trim();

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Mod postado por: ${autor.username}`, iconURL: autor.displayAvatarURL() })
            .setColor("#4354ff")
            .setFooter({ text: footer })
            .setTimestamp();

        // Definir título e descrição apenas se existirem
        if (titulo) embed.setTitle(processarTexto(titulo));
        if (descricaoCompleta) embed.setDescription(descricaoCompleta);

        if (imagem) embed.setImage(imagem);
        if (banner) {
            embed.setThumbnail(banner);
        } else {
            embed.setThumbnail(autor.displayAvatarURL());
        }

        const buttonsRow = new ActionRowBuilder<ButtonBuilder>();

        // Adicionar botão de download se existir
        if (downloadLink) {
            buttonsRow.addComponents(
                new ButtonBuilder()
                    .setLabel("Download")
                    .setEmoji({ id: "1336552472487137346" })
                    .setStyle(ButtonStyle.Link)
                    .setURL(downloadLink)
            );
        }

        // Adicionar botão do YouTube se existir
        if (youtubeLink) {
            buttonsRow.addComponents(
                new ButtonBuilder()
                    .setLabel("YouTube")
                    .setEmoji({ id: "1334557136616685648" })
                    .setStyle(ButtonStyle.Link)
                    .setURL(youtubeLink)
            );
        }

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
                content: `✅ Mod postado com sucesso! ${autor.username}`,
                ephemeral: true
            });

        } catch (error) {
            console.error(error);
            return interaction.followUp({
                content: "❌ Ocorreu um erro ao postar o mod verifique os logs @alan_od!",
                ephemeral: true
            });
        }
    },
});