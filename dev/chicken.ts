/// <reference path="gameobject.ts" />

class Chicken extends GameObject implements Observable {

    public observers: Array<Observer> = [];
    public score: number = 0;
    public ammo: number = 0;

    constructor() {
        super("bird", document.body);

        this.x = 10;
        this.y = 10;
        this.width = 67;
        this.height = 110;
        this.speedmultiplier = 2;

        window.addEventListener("click", (e: MouseEvent) => this.onWindowClick(e));
        this.div.addEventListener("click", (e: MouseEvent) => this.onClick(e));
    }

    public subscribe(o: Observer): void {
        this.observers.push(o);
    }

    public unsubscribe(): void {

    }

    public update() {
        this.x += this.xspeed;
        this.y += this.yspeed;
        super.update();
    }

    // de beweegrichting aanpassen aan waar in het window is geklikt
    private onWindowClick(e: MouseEvent): void {
        Util.setSpeed(this, e.clientX - this.x, e.clientY - this.y);
        this.div.style.backgroundImage = "url('images/chickenwalking.gif')";
    }

    // er is op de kip geklikt
    private onClick(e: MouseEvent): void {
        if (this.ammo > 0) {
            this.ammo--;
            document.getElementsByTagName("ui")[0].innerHTML = "x " + this.ammo + " - Score: " + this.score;
            this.div.style.backgroundImage = "url('images/chickencalling.png')";
            this.xspeed = 0;
            this.yspeed = 0;

            for (let o of this.observers) {
                o.notify();
            }

            setTimeout(() => {
                this.div.style.backgroundImage = "url('images/chickenwalking.gif')";
                for (let o of this.observers) {
                    if (o instanceof Zombie) {
                        o.div.style.backgroundImage = "url('images/zombie.png')";
                        o.speedmultiplier = Math.random() * 2;
                    }
                }
            }, 2500);

            // hiermee voorkomen we dat window.click ook uitgevoerd wordt
            e.stopPropagation();
        }
    }
}