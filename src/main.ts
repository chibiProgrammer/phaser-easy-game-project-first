import Phaser from "phaser";
import MyScene from "./scenes/MyScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    },
  },
  scene: MyScene,
};
new Phaser.Game(config);