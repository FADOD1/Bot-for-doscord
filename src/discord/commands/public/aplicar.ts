import { createCommand, createResponder, ResponderType } from "#base";
import { brBuilder, createModalFields, modalFieldsToRecord } from "@magicyan/discord";
import { TextInputStyle, ApplicationCommandType } from "discord.js";
import z from "zod";
import axios from "axios";

const WEBHOOK_URL = "https://discord.com/api/webhooks/1330183011077197824/le94d1BGYvaPT-HR7l8QFwpQjBIcvL3JgXfnar2vYAoAessyIPX2yakuST02FmztkoB0"; // Substitua pela URL da sua webhook

const formSchema = z.object({
    modName: z.string().min(1, "O nome do mod é obrigatório."),
    errorDescription: z.string().min(10, "A descrição do erro deve conter pelo menos 10 caracteres."),
});

createCommand({
    name: "report",
    description: "Comando para reportar erros em mods de SA-MP.",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        await interaction.showModal({
            customId: "report_error",
            title: "Reportar Erro de Mod",
            components: createModalFields({
                modName: {
                    label: "Nome do Mod",
                    placeholder: "Digite o nome do mod com problema.",
                    required: true,
                },
                errorDescription: {
                    label: "Descrição do Erro",
                    placeholder: "Descreva detalhadamente o erro encontrado.",
                    style: TextInputStyle.Paragraph,
                    minLength: 10,
                    required: true,
                },
            }),
        });
    },
});

createResponder({
  customId: "report_error",
  types: [ResponderType.Modal],
  cache: "cached",
  async run(interaction) {
      try {
          const fields = formSchema.parse(modalFieldsToRecord(interaction.fields));

          // Envia os dados para a webhook
          await axios.post(WEBHOOK_URL, {
              content: "Novo relatório de erro recebido!",
              embeds: [
                  {
                      title: "Relatório de Erro de Mod",
                      fields: [
                          { name: "Mod", value: fields.modName, inline: true },
                          { name: "Descrição do Erro", value: fields.errorDescription, inline: false },
                      ],
                      color: 0xff0000, // Cor vermelha para indicar um erro
                  },
              ],
          });

          await interaction.reply({
              ephemeral: true,
              content: brBuilder(
                  "O seu relatório foi enviado com sucesso!",
                  `- Mod: ${fields.modName}`,
                  `- Descrição do Erro: ${fields.errorDescription}`
              ),
          });
      } catch (error) {
          console.error("Erro ao processar o relatório:", error);
          await interaction.reply({
              ephemeral: true,
              content: "Ocorreu um erro ao enviar seu relatório. Por favor, tente novamente mais tarde.",
          });
      }
  },
});