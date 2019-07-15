cc.Class({
    extends: cc.Component,

    properties: {
        ndBtn: cc.Node,
        ndResult: cc.Node,
        _audioTask: null,
        _audioID: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.initCanvas();
        this.initParas();
        this.initEvent();
        this.initShow();
    },

    // update (dt) {},

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
        
    },

    initEvent(){
        this.ndBtn.on("click", function (argument) {
            this.gameStart();
        }, this);
        cc.find("test", this.node).on("click", function (argument) {
            this.ndResult.active = true;
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
        this.ndBtn.active = false;
        cc.find("test", this.node).active = true;
        this.playAudio();
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
});
