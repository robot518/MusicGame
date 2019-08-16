const {ccclass, property} = cc._decorator;

@ccclass
export default class Lobby extends cc.Component {

    @property(cc.Node)
    ndContent: cc.Node = null;

    @property(cc.Node)
    ndLoad: cc.Node = null;

    @property(cc.Label)
    labTime: cc.Label = null;

    @property(cc.AudioSource)
    music: cc.AudioSource = null;

    @property({
        type: cc.AudioClip
    })
    audioClick: cc.AudioClip = null;

    _iLv: number = 1;
    _videoAd: any;
    _bannerAd: any;
    _bLoaded: boolean;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.initCanvas();
        this.initParas();
        this.initEvent();
        this.initShow();
    }

    // update (dt) {}

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
    }

    initParas(){
        this._bLoaded = false;
    }

    initEvent(){
        cc.find("share", this.node).on("click", function (argument) {
            this.playSound("click");
            this.onWxEvent("share");
        }, this);
        this.onWxEvent("initBanner");
        this.onWxEvent("initVideo");
        if (CC_WECHATGAME && cc.sys.os === cc.sys.OS_ANDROID){
            var self = this;
            wx.onShow(()=>{
                // console.log("self.music.isPlaying = " + (self.music && self.music.isPlaying));
                if (self.music) self.music.play();
            });
        }
    }

    initShow(){
        this.ndLoad.active = false;
        this.showScv();
        if (!CC_WECHATGAME) cc.find("share", this.node).active = false;
    }

    onWxEvent(s){
        if (!CC_WECHATGAME) return;
        let self = this;
        switch(s){
            case "initBanner":
                if (this._bannerAd != null) this._bannerAd.show();
                else{
                    var systemInfo = wx.getSystemInfoSync();
                    this._bannerAd = wx.createBannerAd({
                        adUnitId: 'adunit-92462c04a69b2dc5',
                        adIntervals: 30,
                        style: {
                            left: 0,
                            top: systemInfo.windowHeight - 144,
                            width: 720,
                        }
                    });
                    this._bannerAd.onResize(res => {
                        if (self._bannerAd != null)
                            self._bannerAd.style.top = systemInfo.windowHeight - self._bannerAd.style.realHeight;
                    })
                    this._bannerAd.show();
                    this._bannerAd.onError(err => {
                        console.log(err);
                        //无合适广告
                        if (err.errCode == 1004){

                        }
                    })
                }
                break;
            case "initVideo":
                if (this._videoAd == null){
                    this._videoAd = wx.createRewardedVideoAd({
                        adUnitId: 'adunit-bfb7593ec3f884b7'
                    });
                    this._videoAd.onClose(res => {
                        if (res && res.isEnded || res === undefined){
                            self._videoAd.offClose();
                            self.loadMusic();
                        }else{
    
                        }
                    });
                    this._videoAd.onError(err => {
                      console.log(err)
                    });
                }
                break;
            case "share":
                wx.shareAppMessage({
                    title: "你来挑战我啊！",
                    imageUrl: canvas.toTempFilePathSync({
                        destWidth: 500,
                        destHeight: 400
                    })
                });
                break;
            case "showVideo":
                if (self._videoAd != null){
                    self._videoAd.show()
                    .catch(err => {
                        self._videoAd.load()
                        .then(() => self._videoAd.show())
                    })
                }
                break;
        }
    }

    showScv(){
        var children = this.ndContent.children;
        for (let i = 0; i < 2; i++) {
            cc.find("play", children[i]).on("click", function (argument) {
                this.playSound("click");
                this._iLv = i+1;
                this.loadMusic();
                // this.loadLvScene();
            }, this);
        };
        for (let i = 2; i < 6; i++) {
            cc.find("play", children[i]).on("click", function (argument) {
                this._iLv = i+1;
                this.playSound("click");
                this.onWxEvent("showVideo");
            }, this);
        };
    }

    loadMusic(){
        this.ndLoad.active = true;
        // var remoteUrl = "http://47.111.184.119/MusicGame/Lv"+this._iLv+".mp3";
        var remoteUrl = "https://websocket.guanzhiwangluogongyi.vip/MusicGame/Lv"+this._iLv+".mp3";
        if (CC_WECHATGAME) {
            // let audio = wx.createInnerAudioContext();
            // this.labTime.node.active = false;
            // audio.src = remoteUrl;
            // audio.onError((res)=>{
            //     console.log(res.errMsg);
            //     console.log(res.errCode);
            // });
            // audio.onCanplay(()=>{
            //     // console.log("可以播放");
            //     if (this._bLoaded == true) return;
            //     this.loadLvScene(audio);
            // });
            var self = this;
            var downTask = wx.downloadFile({
                url: remoteUrl,
                success(res){
                    console.log("res = ", res);
                    if (res.statusCode == 200){
                        let audio = wx.createInnerAudioContext();
                        audio.src = res.tempFilePath;
                        self.loadLvScene(audio);
                    }
                }
            })
            downTask.onProgressUpdate((res)=>{
                this.labTime.string = res.progress.toString()+"%";
            })
        }else {
            this.labTime.node.active = false;
            //网页版去下载本地
            // remoteUrl = "../MusicGame/Lv"+this._iLv+".mp3";
            //4399
            remoteUrl = "./MusicGame/Lv"+this._iLv+".mp3";
            cc.loader.load({url: remoteUrl, type: "mp3"}, this.onProgress.bind(this), this.onComplete.bind(this));
        }
    }

    onProgress(completedCount, totalCount){
        cc.log(completedCount, totalCount);
    }

    onComplete(err, res){
        if (err || !res){
            console.log(err);
            return;
        }
        this.loadLvScene(res);
    }

    loadLvScene(res){
        var lv = this._iLv;
        // console.log("lv = " + lv);
        this._bLoaded = true;
        if (this._bannerAd != null) this._bannerAd.hide();
        if (this._videoAd != null) this._videoAd.offClose();
        cc.director.loadScene("Level", function (err, scene) {
            var obj = scene.getChildByName("Canvas").getComponent("Level");
            obj.audioTask = res;
            obj.iLv = lv;
            var url = 'map/Lv'+lv;
            // var url = "map/Lv"+this.iLv;
            obj.onCreateTileMap(url);
            if (res.offCanplay) res.offCanplay();
        });
    }

    playSound(sName){
        if (sName == "click") cc.audioEngine.play(this.audioClick, false, 1);
    }
}
