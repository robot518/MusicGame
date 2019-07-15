cc.Class({
    extends: cc.Component,

    properties: {
        ndItems: cc.Node,
        ndLoad: cc.Node,
        labLoad: cc.Label,
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
        // this.initBannerAd();
        cc.find("share", this.node).on("click", function (argument) {
            this.playSound("click");
            this.share();
        }, this);
        // this.initVideoAd();
    },

    initShow(){
        this.ndLoad.active = false;
        this.showScv(1);
    },

    initVideoAd(){
        if (!window.wx) return;
        this.videoAd = wx.createRewardedVideoAd({
            adUnitId: 'adunit-a7fcb876faba0c89'
        });
        this.videoAd.onClose(res => {
            if (res && res.isEnded || res === undefined){
                this.loadMusic();
            }else{

            }
        });
        this.videoAd.onError(err => {
          console.log(err)
        });
    },

    initBannerAd(){
        if (!window.wx) return;
        if (this.bannerAd != null)
            this.bannerAd.destory();
        var systemInfo = wx.getSystemInfoSync();
        this.bannerAd = wx.createBannerAd({
            adUnitId: 'adunit-24778ca4dc4e174a',
            style: {
                left: 0,
                top: systemInfo.windowHeight - 144,
                width: 720,
            }
        });
        var self = this;
        this.bannerAd.onResize(res => {
            if (self.bannerAd)
                self.bannerAd.style.top = systemInfo.windowHeight - self.bannerAd.style.realHeight;
        })
        this.bannerAd.show();
        this.bannerAd.onError(err => {
          console.log(err);
          //无合适广告
          if (err.errCode == 1004){

          }
        })
    },

    showScv(iCount){
        var children = this.ndItems.children;
        for (let i = 0; i < 4; i++) {
            cc.find("play", children[i]).on("click", function (argument) {
                this.playSound("click");
                if (i < iCount){
                    this.loadMusic();
                } else {
                    // this.showVideo();
                }
            }, this);
        };
        for (let i = 4; i < 6; i++) {
            this.playSound("click");
            cc.find("play", children[i]).on("click", function (argument) {
                // this.showVideo();
            }, this);
        };
    },

    share(){
        if (!window.wx) return;
        wx.shareAppMessage({
            title: "你来挑战我啊！",
            imageUrl: canvas.toTempFilePathSync({
                destWidth: 500,
                destHeight: 400
            })
        });
    },

    showVideo(){
        if (!window.wx) return;
        if (self.videoAd != null){
            self.videoAd.show()
            .catch(err => {
                self.videoAd.load()
                .then(() => self.videoAd.show())
            })
        }
    },

    loadMusic(){
        this.ndLoad.active = true;
        this.labLoad.string = "下载中...";
        var remoteUrl = "http://47.107.178.120/MusicGame/test.mp3";
        cc.loader.load({url: remoteUrl, type: "mp3"}, this.onProgress.bind(this), this.onComplete.bind(this));
    },

    onProgress(completedCount, totalCount){
        cc.log(completedCount, totalCount);
        // this.labLoad.string = (100*completedCount/totalCount).toString()+"%";
    },

    onComplete(err, res){
        if (err || !res){
            console.log(err);
            return;
        }
        this.labLoad.string = "下载完成";
        cc.director.loadScene("Level", function (err, scene) {
            scene.getChildByName("Canvas").getComponent("Level")._audioTask = res;
        });
    },

    playSound(sName){
        var url = cc.url.raw("resources/audio/"+sName+".mp3");
        cc.audioEngine.play(url, false);
    },
});
