import { Context } from 'telegraf';

const helpCmd = (ctx: Context) => {
  ctx.replyWithMarkdownV2(
    `List of Commands:
     1 /start:    lanuch this bot
     2 /viewtask: list all online tasks
     3 /addtask:  add a new task
     4 /deltask:  remove a old task by TaskID`
  );
};

export default helpCmd;