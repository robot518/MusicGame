var SPEED = 100;

cc.Class({
    extends: cc.Component,

    properties: {
        ndBtn: cc.Node,
        ndResult: cc.Node,
        ndPlayer: cc.Node,
        ndMap: cc.Node,
        _audioTask: null,
        _audioID: null,
        _gameStatus: 0, // 0准备，1开始，2结束
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.initCanvas();
        this.initParas();
        this.initEvent();
        this.initShow();
    },

    update (dt) {
        if (this._gameStatus == 1){
            var dx = this.speed * dt;
            this.ndPlayer.x += dx;
            var dy = SPEED/2 * dt;
            this.ndPlayer.y += dy;
            this.ndMap.x -= 2*dx;
            this.ndMap.y -= 2*dy;
            // var pos = this._getTilePos(cc.v2(this.ndPlayer.x, this.ndPlayer.y));
            // var id = this._layerFloor.getTileGIDAt(pos);
            // cc.log(pos.x, pos.y, id);
            // if (id == 0) this.gameOver();
        }
    },

    initCanvas(){
        var canvas = this.node.getComponent(cc.Canvas);
        var size = canvas.designResolution;
        var cSize = cc.view.getFrameSize();
        if (cSize.width/cSize.height >= size.width/size.height){
            canvas.fitWidth = false;
            canvas.fitHeight = true;
        }else{
            canvas.fitWidth = true;
            canvas.fitHeight = false;
        }
        canvas.alignWithScreen();
    },

    initParas(){
        this._tiledMap = this.ndMap.getComponent('cc.TiledMap');
    },

    initEvent(){
        this.ndBtn.on("click", function (argument) {
            if (this._gameStatus == 0)
                this.gameStart();
            else if (this._gameStatus == 1){
                this.speed = -this.speed;
                this.ndPlayer.scaleX = -this.ndPlayer.scaleX;
            }
        }, this);
        cc.find("test", this.node).on("click", function (argument) {
            this.gameOver();
            // this.ndPlayer.setPosition(cc.v2(8.5, -210));
        }, this);
        cc.find("back", this.ndResult).on("click", function (argument) {
            this.stopAudio();
            cc.director.loadScene("Lobby");
        }, this);
    },

    initShow(){
        this.ndBtn.active = true;
        cc.find("test", this.node).active = false;
        this.ndResult.active = false;
    },

    showCount(iCount){
        cc.find("lab", this.ndResult).getComponent(cc.Label).string = iCount.toString();
    },

    gameStart(){
        this.playSound("click");
        this.ndMap.active = true;
        this._layerFloor = this._tiledMap.getLayer("floor");
        var anim = this.ndPlayer.getComponent(cc.Animation);
        anim.play();
        this._gameStatus = 1;
        // var para = Math.random() >= 0.5 ? 1 : -1;
        var para = 1;
        if (para > 0) this.ndPlayer.scaleX = -this.ndPlayer.scaleX;
        this.speed = para*SPEED;
        cc.find("test", this.node).active = true;
        this.playAudio();
    },

    gameOver(){
        this._gameStatus = 2;
        // this.ndResult.active = true;
        // this.ndMap.active = false;
        var anim = this.ndPlayer.getComponent(cc.Animation);
        anim.stop();
    },

    playAudio () {
        // return current audio object
        cc.log("this._audioTask = ", this._audioTask);
        this._audioID = cc.audioEngine.play(this._audioTask, false);
    },

    stopAudio () {
        cc.audioEngine.stop(this._audioID);
    },

    playSound(sName){
        var url = cc.url.raw("resources/audio/"+sName+".mp3");
        cc.audioEngine.play(url, false);
    },

    _getTilePos(posInPixel) {
        var mapSize = this.ndMap.getContentSize();
        var tileSize = this._tiledMap.getTileSize();
        var x = Math.floor(posInPixel.x / tileSize.width);
        var y = Math.floor((mapSize.height - posInPixel.y) / tileSize.height);
        var multi = tileSize.width/tileSize.height;

        // Math.abs(posInPixel.x*tileSize.height/2)+Math.abs(posInPixel.y*tileSize.width/2)<tileSize.height*tileSize.width/4;
        var m = (posInPixel.x+multi*(mapSize.height-posInPixel.y)-mapSize.width/2-multi*tileSize.height/2)/(multi*tileSize.height);
        var n = (multi*(mapSize.height-posInPixel.y)-posInPixel.x+mapSize.width/2-multi*tileSize.height/2)/(multi*tileSize.height);
        cc.log(mapSize.height, mapSize.width, tileSize.height, tileSize.width, x, y, posInPixel.x, posInPixel.y, m, n);
        return cc.v2(x, y);
    },
});
