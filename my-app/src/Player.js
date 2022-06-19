import React from "react";
import './style/Player.css';
import { DanmukuPlayer } from "./DanmukuPlayer";
import { FileSubmitBar, InfoDisplayBar, InfoOnChangeBar, InfoSubmitBar } from "./Info";
import { VideoPlayer } from "./VideoPlayer";

// export class Player extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             videoUrl: "",
//             danmukuXML: "",
//             danmukuOpacity: 1,
//             danmukuRelativeSpeed: 1,
//             danmukuDuration: 12,

//             // player state
//             paused: true,
//             waiting: true,
//         }

//     }



//     render() {
//         return (
//             <div className="Player">
//                 <h2>This is a player</h2>
//                 <VideoPlayer
//                     src={this.state.videoUrl}/>
//                 <DanmukuPlayer 
//                     xml={this.state.danmukuXML}
//                     danmukuOpacity={this.state.danmukuOpacity}
//                     danmukuRelativeSpeed={this.state.danmukuRelativeSpeed}
//                     danmukuDuration={this.state.danmukuDuration} 
//                     paused={this.paused}
//                     waiting={this.waiting} />
//                 <div>
//                     <FileSubmitBar 
//                         prompt="Upload Danmuku xml file"
//                         fileType="text" 
//                         onChange={(xml) => {this.setState( {danmukuXML: xml} ); }} />
//                 </div>
                

                
//             </div>
//         );
//     }
// }
export class Player extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <h2>This is a player</h2>
                <DanmukuPlayer 
                    danmukuOpacity={1}
                    danmukuRelativeSpeed={1}
                    danmukuDuration={12}
                />
            </div>
        );
    }

}