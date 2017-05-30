class Game {

    private score: number = 0;
    private chicken: Chicken;
    private zombies: Array<Zombie> = new Array<Zombie>();
    private grains: Array<Grain> = new Array<Grain>();
    private phones: Array<Phone> = new Array<Phone>();

    constructor() {
        document.getElementsByTagName("ui")[0].innerHTML = "Score: " + this.score;
        this.chicken = new Chicken();

        for (let z = 0; z < 10; z++) {
            this.zombies.push(new Zombie(this.chicken));
        }
        for (let g = 0; g < 20; g++) {
            this.grains.push(new Grain());
        }
        for (let p = 0; p < 3; p++) {
            this.phones.push(new Phone());
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    private gameLoop() {
        // beweging
        this.chicken.update();

        for (let grain of this.grains) {
            if (Util.checkCollision(this.chicken, grain)) {
                Util.removeFromGame(grain, this.grains);
                this.score++;
                document.getElementsByTagName("ui")[0].innerHTML = "Score: " + this.score;
            }
        }

        for (let phone of this.phones) {
            if (Util.checkCollision(this.chicken, phone)) {
                Util.removeFromGame(phone, this.grains);
                this.chicken.ammo++;
            }
        }

        let hitZombie = false;
        for (let z of this.zombies) {
            z.update();
            if (Util.checkCollision(z, this.chicken)) {
                hitZombie = true;
            }
        }

        // loop gaat door als we geen zombie raken 
        if (!hitZombie) requestAnimationFrame(() => this.gameLoop());
    }

}

window.addEventListener("load", function () {
    new Game();
});