import { createCommand } from "#base";
import {
    ApplicationCommandType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageComponentInteraction,
    ThreadChannel,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";

createCommand({
    name: "atendimento",
    description: "Cria um menu de atendimento com botões para marcar como resolvido ou não resolvido.",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const thread = interaction.channel;

        // Verifica se o comando foi usado em uma thread
        if (!(thread instanceof ThreadChannel)) {
            await interaction.followUp({
                content: "Este comando só pode ser usado dentro de uma thread.",
                ephemeral: true,
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle("Atendimento - Escolha uma opção")
            .setDescription(
                `Selecione se o problema na thread "${thread.name}" foi resolvido ou não resolvido.`
            )
            .setColor("#4354ff")
            .setTimestamp();

        const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel("Resolvido")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("resolvido"),
            new ButtonBuilder()
                .setLabel("Não Resolvido")
                .setStyle(ButtonStyle.Danger)
                .setCustomId("nao_resolvido")
        );

        const message = await thread.send({
            embeds: [embed],
            components: [buttonsRow],
        });

        // Aguardar a interação com os botões
        const filter = (i: MessageComponentInteraction) =>
            i.customId === "resolvido" || i.customId === "nao_resolvido";
        const collector = message.createMessageComponentCollector({
            filter,
            time: 0,
        });

        collector.on("collect", async (i: MessageComponentInteraction) => {
            const isResolved = i.customId === "resolvido";

            // Criar modal para o usuário definir o motivo do encerramento
            const modal = new ModalBuilder()
                .setCustomId("motivoModal")
                .setTitle("Definir Motivo do Encerramento");

            const motivoInput = new TextInputBuilder()
                .setCustomId("motivoInput")
                .setLabel("Motivo do Encerramento:")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder("Insira o motivo para encerrar o tópico...")
                .setRequired(true);

            const modalRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
                motivoInput
            );

            modal.addComponents(modalRow);

            await i.showModal(modal);

            const submitted = await i.awaitModalSubmit({
                time: 60000,
            }).catch(() => null);

            if (!submitted) {
                await i.followUp({
                    content: "Você não enviou o motivo a tempo.",
                    ephemeral: true,
                });
                return;
            }
            
            const motivo = submitted.fields.getTextInputValue("motivoInput");

            // Adicionar (Resolvido) ou (Não Resolvido) ao final do nome da thread
            const newName = `${thread.name} (${isResolved ? "Resolvido" : "Não Resolvido"})`;
            await thread.setName(newName);

            // Atualizar a embed com avatar, quem fechou, e o motivo do encerramento
            const updatedEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `Tópico fechado por ${submitted.user.username}`,
                    iconURL: submitted.user.displayAvatarURL(),
                })
                .setTitle(isResolved ? "Problema Resolvido" : "Problema Não Resolvido")
                .setDescription(`👤 **Solicitante:** <@${thread.ownerId}>`)
                .setColor("#4354ff")
                .setFooter({
                    text: `Motivo: ${motivo}`,
                })
                .setTimestamp();

            await message.edit({
                embeds: [updatedEmbed],
                components: [],
            });

            await submitted.reply({
                content: "O tópico foi encerrado com sucesso.",
                ephemeral: true,
            });
        });

        collector.on("end", async () => {
            // Desativar botões após o tempo expirar
            await message.edit({
                components: [
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setLabel("Resolvido")
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true)
                            .setCustomId("resolvido"),
                        new ButtonBuilder()
                            .setLabel("Não Resolvido")
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(true)
                            .setCustomId("nao_resolvido")
                    ),
                ],
            });
        });

        await interaction.followUp({
            content: "O menu de atendimento foi criado nesta thread.",
            ephemeral: true,
        });
    },
});
