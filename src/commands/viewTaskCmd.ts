import { Context } from 'telegraf';

const viewTaskCmd = (ctx: Context) => {

  ctx.replyWithMarkdownV2(
    `Registered Tasks:
    /start - Start the bot
    /help - Show help
    /echo - Echo back your message`
  );
};

export default viewTaskCmd;
