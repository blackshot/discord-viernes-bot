import { rejects } from "assert";
import { Channel, Client, VoiceChannel, VoiceConnection } from "discord.js";
import { config } from "dotenv";
import path from 'path';

config();
const c: Client = new Client();

const filename = path.resolve("./samples/chavales.mp3");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function promSong(conn: VoiceConnection, channel: VoiceChannel): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
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
      dispatcher.on("error", (err)=>{
        console.error(err);
        resolve(false);
      });
  })
}
c.on("ready", async () => {
  console.log("Conectado a discord");
  
  for (let guild of c.guilds.cache.array()){
    const chanSet: Set<string | null> = new Set<string | null>();
    for(let vs of guild.voiceStates.cache.array()){
      chanSet.add(vs.channelID);
    }
    console.log(`${guild.name}:`);
    // AHORA RECORRO LOS CANALES DEL GUILD FELIZ VIERNESEANDO
    for(let ch of chanSet){
      const channel = <VoiceChannel>c.channels.cache.get(ch || "");
      if (!channel) continue;
      await sleep(1300);
      const conn = await channel.join();
      const sw = await promSong(conn, channel);
    }
  }
  process.exit(0);
});

c.login(process.env.DS_TOKEN);
