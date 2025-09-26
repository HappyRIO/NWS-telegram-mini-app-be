import { Context } from 'telegraf';

const startCmd = (ctx: Context) => {
  ctx.reply('Welcome to the mini-app! Use /help to see available commands.');
};

export default startCmd;

/*   Types of Replies with Telegraf
✅🖊 Text Replies
bot.command('start', (ctx) => {ctx.reply('Welcome! Use /help to see available commands.');});
✅📝Formatted Text
bot.command('help', (ctx) => {
  ctx.replyWithMarkdown('Available commands:\n/start - Start the bot\n/help - Show help\n/echo - Echo back your message');}
);
✅⌨ Inline Keyboard
bot.command('menu', (ctx) => {
    ctx.reply('Choose an option:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Option 1', callback_data: 'option1' }],
                [{ text: 'Option 2', callback_data: 'option2' }]
            ]
        }
    });
});
✅📸 Photo or Media
bot.command('photo', (ctx) => {
    ctx.replyWithPhoto({ url: 'https://example.com/photo.jpg' }, { caption: 'Here is a photo!' });
});
✅📃 Documents
bot.command('sendfile', (ctx) => {
    ctx.replyWithDocument({ url: 'https://example.com/document.pdf' });
});
✅🗺 Location
bot.command('location', (ctx) => {
    ctx.replyWithLocation(40.7128, -74.0060); // Example coordinates for New York City
});
✅🔊 Audio or Video
bot.command('audio', (ctx) => {
    ctx.replyWithAudio({ url: 'https://example.com/audio.mp3' });
});
✅⚙ Custom Reply Markup
bot.command('options', (ctx) => {
    ctx.reply('Choose an option:', {
        reply_markup: {
            keyboard: [
                ['Option 1', 'Option 2'],
                ['Option 3']
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
});
*/