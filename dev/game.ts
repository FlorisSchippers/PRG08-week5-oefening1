class Game {

    private phone: Phone;
    private chicken: Chicken;
    private zombies: Array<Zombie> = new Array<Zombie>();
    private grains: Array<Grain> = new Array<Grain>();
    private phones: Array<Phone> = new Array<Phone>();

    constructor() {
        this.phone = new Phone();
        this.phone.x = 0.5 * window.innerWidth - 375;
        this.phone.y = 10;
        this.phone.update();
        this.chicken = new Chicken();
        document.getElementsByTagName("ui")[0].innerHTML = "x " + this.chicken.ammo + " - Score: " + this.chicken.score;

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
                this.chicken.score++;
                this.chicken.speedmultiplier += 0.5;
                document.getElementsByTagName("ui")[0].innerHTML = "x " + this.chicken.ammo + " - Score: " + this.chicken.score;
            }
        }

        for (let phone of this.phones) {
            if (Util.checkCollision(this.chicken, phone)) {
                Util.removeFromGame(phone, this.phones);
                this.chicken.ammo++;
                document.getElementsByTagName("ui")[0].innerHTML = "x " + this.chicken.ammo + " - Score: " + this.chicken.score;
            }
        }

        let hitZombie = false;
        for (let z of this.zombies) {
            z.update();
            if (Util.checkCollision(z, this.chicken)) {
                this.chicken.div.style.height = "119px";
                this.chicken.div.style.backgroundImage = "url('images/zombie.png')";
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