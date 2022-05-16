import Phaser from "phaser";

class MyScene extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup;
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private apple?: Phaser.Physics.Arcade.Group;

    private score = 0;
    private scoreText?: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'myscene' });
    }

    preload() {
        this.load.setBaseURL("https://labs.phaser.io");

        this.load.image('sky', 'assets/skies/sky3.png');
        this.load.image('ground', 'assets/sprites/platform.png');
        this.load.image('apple', 'assets/sprites/apple.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.add.image(400, 300, "sky");
        
        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNames('dude', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4}],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNames('dude', {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(this.player, this.platforms);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.apple = this.physics.add.group({
            key: 'apple',
            repeat: 11,
            setXY: { x: 12, y:0, stepX: 70 }
        });

        this.apple.children.iterate(c =>{
            const child = c as Phaser.Physics.Arcade.Image
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.apple, this.platforms);
        this.physics.add.overlap(this.player, this.apple, undefined, this.handleCollectApple);

        this.scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '32px'
        });
    }

    private handleCollectApple(player: Phaser.GameObjects.GameObject, a: Phaser.GameObjects.GameObject){
        const apple = a as Phaser.Physics.Arcade.Image;
        apple.disableBody(true, true);

        this.score += 10;
        this.scoreText?.setText(`Sccore: ${this.score}`);
    }


    update() {
        if (!this.cursors){ return }
        if (this.cursors.left?.isDown){
            this.player?.setVelocityX(-160);
            this.player?.anims.play('left', true);
        }else if (this.cursors.right?.isDown){
            this.player?.setVelocityX(160);
            this.player?.anims.play('right', true);
        }else{
            this.player?.setVelocityX(0);
            this.player?.anims.play('turn');
        }
        if (this.cursors.up?.isDown && this.player?.body.touching.down){
            this.player?.setVelocityY(-330);
        }
    }
}
export default MyScene