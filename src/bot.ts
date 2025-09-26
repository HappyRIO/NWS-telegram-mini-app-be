import { Telegraf, Context, Markup } from 'telegraf';
import { BOT_TOKEN, WEB_APP_URL } from './config';

const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx:Context) => {
  const imageUrl = 'https://nodewaves.com/images/nws-token-banner.png'; // Replace with your image URL
  const description = 
  'NWSCoin — Play to to get $NWS and NWSChain rewards.\n' +
  'Get $NWS for every friend you refer and every day you login, and extra rewards on NWSChain.\n' +
  "$NWS is already listed on 40+ exchanges. 4M NWS Reward pool won't last long!.\n" +
  'Choose an option below:';

  const keyboard = Markup.inlineKeyboard([
    [{text: "🎮 Play", web_app: { url: WEB_APP_URL || "" }}],
  ]);

  ctx.replyWithPhoto(imageUrl, {
    caption: `${description}\n\nChoose an option:`,
    reply_markup: keyboard.reply_markup,
  });
});

console.log("TelegramBot Ready!");
export default bot;