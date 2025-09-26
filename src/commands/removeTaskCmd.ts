import { Context } from 'telegraf';

const removeTaskCmd = (ctx: Context) => {
  ctx.reply('Welcome to remove Task by TaskID.');
};

export default removeTaskCmd;