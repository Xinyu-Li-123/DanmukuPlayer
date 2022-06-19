import React from "react";
import './style/Player.css';
import { VideoPlayer } from "./VideoPlayer";
import { PlayerSetting } from "./PlayerSetting";
import { FileSubmitBar, InfoDisplayBar, InfoOnChangeBar, InfoSubmitBar } from "./Info";
import { createSchedule, sleep } from "./utils";
import { DanmukuScreen } from "./DanmukuScreen";

export class DanmukuPlayer extends React.Component {
    constructor(props) {
    /*
        props = {
            danmukuOpacity: 1
            danmukuRelativeSpeed: 1
            danmukuDuration: 12
        }

        state = {
            xml: "",
            danmukuOpacity: props.danmukuOpacity,
            danmukuRelativeSpeed: props.danmukuRelativeSpeed,
            danmukuDuration: props.danmukuDuration,
            danmukuList: [],
            danmukuSchedule: [],
            danmukuIntervals: [],

            // DanmukuPlayer-related stuff
            paused: true,
            ended: false,
            seeking: false,

            // VideoPlayer-related stuff
            videoUrl: "https://ia800300.us.archive.org/17/items/BigBuckBunny_124/Content%2Fbig_buck_bunny_720p_surround.mp4"
        
        }
    
    */

        super(props);

        this.state = {
            // Danmuku-related stuff
            xml: "",
            danmukuOpacity: props.danmukuOpacity,
            danmukuRelativeSpeed: props.danmukuRelativeSpeed,
            danmukuDuration: props.danmukuDuration,

            // DanmukuPlayer stuff
            ID: -1,
            paused: true,
            started: false,
            ended: true,
            seeking: false,
            newDanmuku: null,
            initialized: false,

            // Layout stuff
            width: 668,     // px
            height: 428,    // px


            // VideoPlayer-related stuff
            videoUrl: "https://ia800300.us.archive.org/17/items/BigBuckBunny_124/Content%2Fbig_buck_bunny_720p_surround.mp4"
        }
        this.danmukuList = [];
        this.danmukuSchedule = [];
        this.danmukuIntervals = [];
        this.newHandle = null;
        this.newIndex = 0;


        this.pause = this.pause.bind(this);
        this.play = this.play.bind(this);
        this.end = this.end.bind(this);
        this.onSeeking = this.onSeeking.bind(this);
        this.onSeeked = this.onSeeked.bind(this);
        this.initialize = this.initialize.bind(this);
        this.sendOneDanmuku = this.sendOneDanmuku.bind(this);
        this.handleUrlUpdate = this.handleUrlUpdate.bind(this);
        this.handleDanmukuXMLUpdate = this.handleDanmukuXMLUpdate.bind(this);

        // this.sendDanmukuFromCount = 0;
    }


    componentDidUpdate(prevProps, prevState) {
        // let prevFirstID = prevState.ID;
        // let curFirstID = this.ID;
        // console.log(prevFirstID, curFirstID, this.state.paused)
        // if(curFirstID >= 0){
        //     if(prevFirstID != curFirstID) {
        //         console.log(curFirstID, prevFirstID, this.state.paused);
        //         // console.log(this.props)
        //         console.log("1111111111");
        //         this.sendDanmukuFrom(0.0);      // send danmuku from the beginning
        //     }
        // }
    }


    async initialize(xml) {
        //  initialize danmuku and danmuku player state, 
        //  parse xml, 
        //  prepare danmuku list, danmuku schedule, danmuku intervals
        //  send danmuku when the video is played

        console.log(xml)

        const ds = await createSchedule(xml);

        this.danmukuList = ds[0];
        this.danmukuSchedule = ds[1];
        this.danmukuIntervals = ds[2];



        this.setState({
            // Danmuku-related stuff
            xml: xml,            
            
            // DanmukuPlayer-related stuff
            // paused: true,
            ID: this.danmukuList[0].ID,
            ended: false,
            seeking: false,
            newDanmuku: null,
            initialized: true,
        });
        this.newHandle = null;
        this.newIndex = 0;
    }

    pause() {
        console.log("paused");
        this.setState({
            paused: true,})
        clearTimeout(this.newHandle);
    }

    play() {
        console.log("played");
        this.setState({
            started: true,
            paused: false,})        
        this.newHandle = setTimeout(() => {this.sendOneDanmuku(this.newIndex)}, 
                                    1000 * this.danmukuIntervals[this.newIndex])
    }

    end() {
        console.log("ended");
        this.pause();
        this.setState({
            started: false,
            ended: true,
        })
    }

    onSeeking(e) {
        // clearTimeout(this.newHandle);
        this.pause();
        this.newHandle = null;
        this.newIndex = -1;

        console.log("start seeking");
        this.setState({
            seeking: true,
            // paused: true,
        });
        
    }

    async onSeeked(newTimestamp) {
        console.log("Seeked to timestamp: " + newTimestamp);
        console.log("222222222222")
        this.newIndex = await this.computeFirstDanmukuIndex(newTimestamp);
        
        this.play();
        this.setState({
            seeking: false,
            // paused: false,
        });
        
        // if(!this.state.paused){
        //     this.sendDanmukuFrom(newTimestamp);     
        // }   
    }

    handleDanmukuXMLUpdate(xml) {
        this.end();
        this.initialize(xml)
    }

    handleUrlUpdate(url) {
        this.setState({
            paused: true,
            seeking: false,
            videoUrl: url,})
        
    }

    async computeFirstDanmukuIndex(timestamp){
        // reload danmuku based on current timestamp of the video
    
        // binary search for the starting danmuku (the nth danmuku should be the starting one)
    
        let m = 0;
        let n = this.danmukuSchedule.length - 1;
        while (m <= n) {
            let k = (n + m) >> 1;
            let cmp = timestamp - this.danmukuSchedule[k];
            if (cmp > 0) {
                m = k + 1;
            } else if(cmp < 0) {
                n = k - 1;
            } else {
                break;
            }
        }
        n += 1;
        while(n != 0){
            if(this.danmukuSchedule[n] == this.danmukuSchedule[n-1]){
                n -= 1;
            }else{
                break;
            }
        }
        return n;
    }

    sendOneDanmuku(index) {
        const danmuku = this.danmukuList[index];
        // console.log(danmuku);
        const interval = 1000 * this.danmukuIntervals[index+1];

        // console.log(danmuku.timestamp + ": " + danmuku.textContent);
        
        this.setState({
            newDanmuku: danmuku,
        }); 
        this.newHandle = setTimeout(() => {this.sendOneDanmuku(index+1)}, interval);
        this.newIndex = index;
    }

    render() {

        let testXML = `<i>
        <chatserver>chat.bilibili.com</chatserver>
        <chatid>58074804</chatid>
        <mission>0</mission>
        <maxlimit>3000</maxlimit>
        <state>0</state>
        <real_name>0</real_name>
        <source>k-v</source>
        <d p="621.92300,1,25,16777215,1655443003,0,6ef217bb,1076692963675053312,11">我不仅摘星了，还摘了两颗呢（</d>
        <d p="1082.51700,5,25,16707842,1655438762,0,7b4a6a61,1076657389903549184,11">无情铁手</d>
        <d p="135.40600,1,25,15138834,1655310795,0,1ffbe052,1075583927294531584,11">上一个学生会还在互相暗恋</d>
        <d p="184.61200,1,25,16755202,1654843462,0,32d5ae66,1071663654186956800,11">这个历史总是惊人的相似</d>
        <d p="184.90500,5,25,15772458,1654773039,0,d3d62e6d,1071072896165805056,11">历史总是惊人的相似</d>
        <d p="1043.53100,1,25,16777215,1654345542,0,ada98a44,1067486797719873536,11">奇怪的属性觉醒了</d>
        <d p="187.79200,1,25,16707842,1654246480,0,7bb51b32,1066655806843372800,11">历史总是惊人的相似</d>
        <d p="981.29000,5,25,41194,1654140155,0,5cd9ba9d,1065763881755874560,11">满屏聚聚，突然的幺蛾子</d>
        <d p="665.67400,5,25,15772458,1654139297,0,5cd9ba9d,1065756685614179328,11">我们H队一笔一划都是直的</d>
        <d p="1078.38500,1,25,16777215,1654090224,0,26925e7c,1065345033944727296,11">太阳:嘴角老兄又见面了</d>
        <d p="1336.48800,5,25,15772458,1654057262,0,eb96cfb7,1065068526710081792,11">怎么还走后门啊哈哈哈哈</d>
        <d p="1060.51900,5,25,15772458,1654057014,0,eb96cfb7,1065066446922495744,11">是心动啊~糟糕眼神躲不掉~</d>
        </i>`

        return (
            <div className="DanmukuPlayer">
                <h3>This is a Danmukuplayer</h3>

                <DanmukuScreen
                    danmukuOpacity={this.props.danmukuOpacity}
                    danmukuRelativeSpeed={this.props.danmukuRelativeSpeed}
                    danmukuDuration={this.props.danmukuDuration}
                    paused={this.state.paused}
                    ended={this.state.ended}
                    seeking={this.state.seeking}
                    initialized={this.state.initialized}
                    newDanmuku={this.state.newDanmuku}
                />      

                <VideoPlayer
                    videoUrl={this.state.videoUrl}
                    onPause={this.pause}
                    onPlay={this.play}
                    onWaiting={() => {console.log("waiting..."); this.pause();}}
                    onEnded={this.end}
                    onSeeking={this.onSeeking}
                    onSeeked={this.onSeeked}
                />
                {/* <PlayerSetting> */}
                <div className="InfoContainer">
                    <FileSubmitBar 
                        prompt="Submit Danmuku XML File"
                        fileType="text"
                        onChange={this.handleDanmukuXMLUpdate} />

                    <FileSubmitBar
                        prompt="Submit Local Video File"
                        fileType="blob"
                        onChange={this.handleUrlUpdate} />

                    <InfoSubmitBar 
                        prompt="Submit Video URL"
                        type="text"
                        onSubmit={this.handleUrlUpdate} />
                </div>
                {/* </PlayerSetting> */}
            </div>
        );
    }
}