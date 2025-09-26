import { Telegraf, Context } from 'telegraf';
import { BOT_TOKEN } from '../config';

// const ghost = new Telegraf(BOT_TOKEN);

const addTaskCmd = (ctx: Context) => {
  ctx.state.userData = {tgId: ctx.from?.id, message: ctx.message}
  ctx.reply('Welcome to add new Task!');
  console.log(ctx.state.userData);
};

export default addTaskCmd;