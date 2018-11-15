import Phaser from "phaser";

export default function() {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: "phaser-container",
    width: 800,
    height: 600,
    scene: {
      preload,
      create
    }
  });

  function preload() {
    this.load.image("bob", "/assets/images/bob.png");
  }

  function create() {
    const logo = this.add.image(400, 150, "bob");

    this.tweens.add({
      targets: logo,
      y: 450,
      duration: 2000,
      ease: "Power2",
      yoyo: true,
      loop: -1
    });
  }
}
