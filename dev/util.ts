class Util {
    /**
     * deze formule rekent een constante snelheid uit in de richting van het doel
     */
    public static setSpeed(go: GameObject, xdist: number, ydist: number): void {
        let distance: number = Math.sqrt(xdist * xdist + ydist * ydist);
        go.xspeed = xdist / distance;
        go.yspeed = ydist / distance;

        go.xspeed *= go.speedmultiplier;
        go.yspeed *= go.speedmultiplier;
    }

    /**
     * deze formule rekent uit of twee gameobjecten elkaar overlappen
     */
    public static checkCollision(go1: GameObject, go2: GameObject): boolean {
        return (go1.x < go2.x + go2.width &&
            go1.x + go1.width > go2.x &&
            go1.y < go2.y + go2.height &&
            go1.height + go1.y > go2.y)
    }

    /**
     * verwijder een item uit een array, en verwijder meteen het dom element uit de body
     */
    public static removeFromGame(go: GameObject, arr: Array<any>) {
        go.div.remove();
        let i: number = arr.indexOf(go);
        if (i != -1) {
            arr.splice(i, 1);
        }
    }
}