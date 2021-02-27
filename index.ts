import { Client, VoiceChannel } from "discord.js";
import { config } from "dotenv";
import path from "path";

config();
const c: Client = new Client();

const filename = path.resolve("./samples/chavales.mp3");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function playSongAndLeave(channel: VoiceChannel): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    const conn = await channel.join();
    const dispatcher = conn.play(filename, {
      volume: 0.5,
    });

    dispatcher.on("start", () => {
      console.log(`\t${channel.name}`);
    });

    dispatcher.on("finish", () => {
      channel.leave();
      resolve(true);
    });

    // Always remember to handle errors appropriately!
    dispatcher.on("error", (err) => {
      console.error(err);
      resolve(false);
    });
  });
}
c.on("ready", async () => {
  console.log("Conectado a discord");

  for (let guild of c.guilds.cache.array()) {
    const chanSet: Set<VoiceChannel | null> = new Set<VoiceChannel | null>(
      guild.voiceStates.cache.array().map((vs) => vs.channel)
    );

    console.log(`${guild.name}:`);
    // AHORA RECORRO LOS CANALES DEL SERVIDOR FELIZ VIERNESEANDO
    for (let ch of chanSet) {
      if (!ch) continue;
      await sleep(1300);
      await playSongAndLeave(ch);
    }
  }
  process.exit(0); // MATO AL BOT
});

c.login(process.env.DS_TOKEN);
