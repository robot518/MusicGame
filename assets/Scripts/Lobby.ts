import { GLB } from "./GLBConfig";

const {ccclass, property} = cc._decorator;

//测试下载音乐的速度计时用
let bPlayTime = false;
let iTime = 0;

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
    _interstitialAd: any;
    labPlayTime: any;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.initCanvas();
        this.initParas();
        this.initEvent();
        this.initShow();
    }

    update (dt) {
        if (bPlayTime){
            iTime+=dt;
            this.labPlayTime.string = iTime.toFixed(2);
        }
    }

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
        this.labPlayTime = this.ndLoad.getChildByName("lab").getComponent(cc.Label);
    }

    initEvent(){
        // cc.find("share", this.node).on("click", function (argument) {
        //     this.playSound("click");
        // }, this);
    }

    initShow(){
        this.ndLoad.active = false;
        this.showScv();
        if (!CC_WECHATGAME) cc.find("share", this.node).active = false;
    }

    showScv(){
        var children = this.ndContent.children;
        for (let i = 0; i < 2; i++) {
            cc.find("play", children[i]).on("click", function (argument) {
                this.playSound("click");
                this._iLv = i+1;
                // this.loadMusic();
                this.loadLvScene();
            }, this);
        };
        for (let i = 2; i < 6; i++) {
            cc.find("play", children[i]).on("click", function (argument) {
                this._iLv = i+1;
                this.playSound("click");
                // this.onWxEvent("showVideo");
            }, this);
        };
    }

    loadMusic(){
        this.ndLoad.active = true;
        // var remoteUrl = "http://47.111.184.119/MusicGame/Lv"+this._iLv+".mp3";
        var remoteUrl = "https://websocket.guanzhiwangluogongyi.vip/MusicGame/Lv"+this._iLv+".mp3"; //第一首26s
        // var remoteUrl = "https://websocket.guanzhiwangluogongyi.vip/MusicGame/zip/Lv"+this._iLv+".mp3.zip"; //第一首26s
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
            if (this._interstitialAd != null) this.onWxEvent("showInterstitial");
            let self = this;
            let audio = wx.createInnerAudioContext();
            if (GLB.tMusic[self._iLv]){
                audio.src = GLB.tMusic[self._iLv];
                self.loadLvScene(audio);
            }else{
                // bPlayTime = true;
                var downTask = wx.downloadFile({
                    url: remoteUrl,
                    success(res){
                        // console.log("res = ", res, wx.env.USER_DATA_PATH);
                        if (res.statusCode == 200){
                            // let fileMgr = wx.getFileSystemManager();
                            // fileMgr.unzip({
                            //     zipFilePath: res.tempFilePath,
                            //     targetPath: wx.env.USER_DATA_PATH,
                            //     success(res){
                            //         // console.log("res2 = ", res);
                            //         GLB.tMusic[self._iLv] = res.tempFilePath;
                            //         audio.src = res.tempFilePath;
                            //         self.loadLvScene(audio);
                            //     },
                            //     fail(e){
                            //         console.log("e = ", e);
                            //     }
                            // })
                            GLB.tMusic[self._iLv] = res.tempFilePath;
                            audio.src = res.tempFilePath;
                            self.loadLvScene(audio);
                        }
                    }
                })
                downTask.onProgressUpdate((res)=>{
                    this.labTime.string = res.progress.toString()+"%";
                })
            }
        }else {
            this.labTime.node.active = false;
            //网页版去下载本地
            // remoteUrl = "../MusicGame/Lv"+this._iLv+".mp3";
            //4399
            // remoteUrl = "./MusicGame/Lv"+this._iLv+".mp3";
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
        if (this._interstitialAd != null && this._interstitialAd.destroy) this._interstitialAd.destroy();
        cc.director.loadScene("Level", function (err, scene) {
            var obj = scene.getChildByName("Canvas").getComponent("Level");
            obj.audioTask = res;
            obj.iLv = lv;
            var url = 'map/Lv'+lv;
            // var url = "map/Lv"+this.iLv;
            obj.onCreateTileMap(url);
            if (res && res.offCanplay) res.offCanplay();
        });
    }

    playSound(sName){
        if (sName == "click") cc.audioEngine.play(this.audioClick, false, 1);
    }
}
