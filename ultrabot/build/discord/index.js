import { setupCreators } from "#base";
// const blockedUsers = ["926839794187767819"]
export const { createCommand, createEvent, createResponder } = setupCreators({
    commands: {
        defaultMemberPermissions: ['Administrator'],
        /* async middleware(interaction, block) {
             const { user } = interaction;*/
        /* if (blockedUsers.includes(user.id)){
           interaction.reply({ flags, content: "Você não pode usar nenhum comando bobox kkkkkk 🥱" });
           block();
           return;
         }*/
    },
});
