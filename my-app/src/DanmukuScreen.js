import React from 'react';

export class DanmukuScreen extends React.Component {
    /*
        props = {
            danmukuOpacity
            danmukuRelativeSpeed
            danmukuDuration
            paused
            ended
            seeking
            initialized
            newDanmuku
        }

        state = {

        }
    
    */

    constructor(props) {
        super(props);

        // this.state = {
        //     newDanmuku: null,
        // };
        this.danmukuOnScreen = [];
        this.capacity = 10;     // maximal number of danmuku on screen
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.seeking || !this.props.initialized) {
            console.log(`danmukuscreen is cleared. seeking: ${this.props.seeking}, intialized: ${this.props.initialized}`);
            this.clear();
        }
        else if(this.props.ended) {
            console.log('Danmuku player ended. Danmukuscreen is cleared.')
            this.clear();
        }

        if(this.props.paused){
            this.pause();
        }else{
            this.play();
        }

        if(this.props.newDanmuku != null){
            if(this.props.newDanmuku.ID != prevProps.newDanmuku.ID){
            // if(prevProps.newDanmuku == null || this.props.newDanmuku.ID != prevProps.newDanmuku.ID){
                console.log(this.props.newDanmuku.timestamp + " - new danmuku of ID: " + this.props.newDanmuku.ID + " has been added to the danmuku screen");
                const d = this.props.newDanmuku;        // copy new danmuku and push
                this.danmukuOnScreen.push(d);
            }
        }
    }
    
    clear() {
        while (this.danmukuOnScreen.length > 0) {
            let d = this.danmukuOnScreen.pop();
            console.log("Deleted: " + d.textContent)
        }
        this.danmukuOnScreen = [];
    }
    
    pause() {
        // console.log("danmukuscreen is paused.");
        this.danmukuOnScreen.forEach(
            (item, index, arr) => {
                console.log("ID: " + item.ID + " is paused.");
            }
        )
    }

    play() {
        // console.log("danmukuscreen is playing.");
        this.danmukuOnScreen.forEach(
            (item, index, arr) => {
                console.log("ID: " + item.ID + " is playing.");
            }
        )
    }

    render() {
        return (
            <div className="danmukuScreen">
                <div className="danmukuTrack"></div>
            </div>
        );
    }

}