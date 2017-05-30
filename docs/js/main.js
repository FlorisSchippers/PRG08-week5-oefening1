var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameObject = (function () {
    function GameObject(tag, parent) {
        this.x = 0;
        this.y = 0;
        this.xspeed = 0;
        this.yspeed = 0;
        this.speedmultiplier = 1;
        this.direction = 1;
        this.div = document.createElement(tag);
        parent.appendChild(this.div);
    }
    GameObject.prototype.update = function () {
        this.direction = (this.xspeed < 0) ? 1 : -1;
        this.div.style.transform = "translate(" + this.x + "px, " + this.y + "px) scale(" + this.direction + ",1)";
    };
    return GameObject;
}());
var Chicken = (function (_super) {
    __extends(Chicken, _super);
    function Chicken() {
        var _this = this;
        _super.call(this, "bird", document.body);
        this.observers = [];
        this.score = 0;
        this.ammo = 0;
        this.x = 10;
        this.y = 10;
        this.width = 67;
        this.height = 110;
        this.speedmultiplier = 2;
        window.addEventListener("click", function (e) { return _this.onWindowClick(e); });
        this.div.addEventListener("click", function (e) { return _this.onClick(e); });
    }
    Chicken.prototype.subscribe = function (o) {
        this.observers.push(o);
    };
    Chicken.prototype.unsubscribe = function () {
    };
    Chicken.prototype.update = function () {
        this.x += this.xspeed;
        this.y += this.yspeed;
        _super.prototype.update.call(this);
    };
    Chicken.prototype.onWindowClick = function (e) {
        Util.setSpeed(this, e.clientX - this.x, e.clientY - this.y);
        this.div.style.backgroundImage = "url('images/chickenwalking.gif')";
    };
    Chicken.prototype.onClick = function (e) {
        var _this = this;
        if (this.ammo > 0) {
            this.ammo--;
            document.getElementsByTagName("ui")[0].innerHTML = "x " + this.ammo + " - Score: " + this.score;
            this.div.style.backgroundImage = "url('images/chickencalling.png')";
            this.xspeed = 0;
            this.yspeed = 0;
            for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
                var o = _a[_i];
                o.notify();
            }
            setTimeout(function () {
                _this.div.style.backgroundImage = "url('images/chickenwalking.gif')";
                for (var _i = 0, _a = _this.observers; _i < _a.length; _i++) {
                    var o = _a[_i];
                    if (o instanceof Zombie) {
                        o.div.style.backgroundImage = "url('images/zombie.png')";
                        o.speedmultiplier = Math.random() * 2;
                    }
                }
            }, 2500);
            e.stopPropagation();
        }
    };
    return Chicken;
}(GameObject));
var Game = (function () {
    function Game() {
        var _this = this;
        this.zombies = new Array();
        this.grains = new Array();
        this.phones = new Array();
        this.phone = new Phone();
        this.phone.x = 0.5 * window.innerWidth - 375;
        this.phone.y = 10;
        this.phone.update();
        this.chicken = new Chicken();
        document.getElementsByTagName("ui")[0].innerHTML = "x " + this.chicken.ammo + " - Score: " + this.chicken.score;
        for (var z = 0; z < 10; z++) {
            this.zombies.push(new Zombie(this.chicken));
        }
        for (var g = 0; g < 20; g++) {
            this.grains.push(new Grain());
        }
        for (var p = 0; p < 3; p++) {
            this.phones.push(new Phone());
        }
        requestAnimationFrame(function () { return _this.gameLoop(); });
    }
    Game.prototype.gameLoop = function () {
        var _this = this;
        this.chicken.update();
        for (var _i = 0, _a = this.grains; _i < _a.length; _i++) {
            var grain = _a[_i];
            if (Util.checkCollision(this.chicken, grain)) {
                Util.removeFromGame(grain, this.grains);
                this.chicken.score++;
                this.chicken.speedmultiplier += 0.5;
                document.getElementsByTagName("ui")[0].innerHTML = "x " + this.chicken.ammo + " - Score: " + this.chicken.score;
            }
        }
        for (var _b = 0, _c = this.phones; _b < _c.length; _b++) {
            var phone = _c[_b];
            if (Util.checkCollision(this.chicken, phone)) {
                Util.removeFromGame(phone, this.phones);
                this.chicken.ammo++;
                document.getElementsByTagName("ui")[0].innerHTML = "x " + this.chicken.ammo + " - Score: " + this.chicken.score;
            }
        }
        var hitZombie = false;
        for (var _d = 0, _e = this.zombies; _d < _e.length; _d++) {
            var z = _e[_d];
            z.update();
            if (Util.checkCollision(z, this.chicken)) {
                this.chicken.div.style.height = "119px";
                this.chicken.div.style.backgroundImage = "url('images/zombie.png')";
                hitZombie = true;
            }
        }
        if (!hitZombie)
            requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    return Game;
}());
window.addEventListener("load", function () {
    new Game();
});
var Grain = (function (_super) {
    __extends(Grain, _super);
    function Grain() {
        _super.call(this, "grain", document.body);
        this.width = 20;
        this.height = 24;
        this.x = Math.random() * (window.innerWidth - 20);
        this.y = Math.random() * (window.innerHeight - 24);
        this.update();
    }
    return Grain;
}(GameObject));
var Phone = (function (_super) {
    __extends(Phone, _super);
    function Phone() {
        _super.call(this, "phone", document.body);
        this.width = 50;
        this.height = 92;
        this.x = Math.random() * (window.innerWidth - 50);
        this.y = Math.random() * (window.innerHeight - 220);
        this.update();
    }
    return Phone;
}(GameObject));
var Util = (function () {
    function Util() {
    }
    Util.setSpeed = function (go, xdist, ydist) {
        var distance = Math.sqrt(xdist * xdist + ydist * ydist);
        go.xspeed = xdist / distance;
        go.yspeed = ydist / distance;
        go.xspeed *= go.speedmultiplier;
        go.yspeed *= go.speedmultiplier;
    };
    Util.checkCollision = function (go1, go2) {
        return (go1.x < go2.x + go2.width &&
            go1.x + go1.width > go2.x &&
            go1.y < go2.y + go2.height &&
            go1.height + go1.y > go2.y);
    };
    Util.removeFromGame = function (go, arr) {
        go.div.remove();
        var i = arr.indexOf(go);
        if (i != -1) {
            arr.splice(i, 1);
        }
    };
    return Util;
}());
var Zombie = (function (_super) {
    __extends(Zombie, _super);
    function Zombie(c) {
        _super.call(this, "zombie", document.body);
        c.subscribe(this);
        this.width = 67;
        this.height = 119;
        this.x = Math.random() * (window.innerWidth - 67);
        this.y = Math.random() * (window.innerHeight / 2) + (window.innerHeight / 2 - 67);
        this.speedmultiplier = Math.random() * 2;
        this.chicken = c;
    }
    Zombie.prototype.notify = function () {
        this.div.style.backgroundImage = "url('images/calling.png')";
        this.speedmultiplier = 0;
    };
    Zombie.prototype.update = function () {
        Util.setSpeed(this, this.chicken.x - this.x, this.chicken.y - this.y);
        this.x += this.xspeed;
        this.y += this.yspeed;
        _super.prototype.update.call(this);
    };
    return Zombie;
}(GameObject));
//# sourceMappingURL=main.js.map