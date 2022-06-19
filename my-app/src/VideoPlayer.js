import React from "react";
// import Video from "react-native-video"
import './style/Player.css';

export class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoUrl: props.videoUrl,
        }
        this.videoRef = React.createRef();

        this.handleSeeking = this.handleSeeking.bind(this);
        this.handleSeeked = this.handleSeeked.bind(this);

    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.videoUrl != this.props.videoUrl) {
            this.loadSource(this.props.videoUrl)
        }
    }

    loadSource(url) {
        // set this.state.url to videoUrl and load video with url.
        this.setState({
            videoUrl: url
        })
        this.videoRef.current.load();
        console.log("Video reloaded using url: " + url);
    }

    handleSeeking(e) {
        this.videoRef.current.pause();
    }

    handleSeeked(e) {
        this.videoRef.current.play();
        return this.props.onSeeked(this.videoRef.current.currentTime);
    }

    render() {
        return (
            <div className="VideoPlayer">
                <h3>This is a Videoplayer</h3>
                <video 
                    src={this.state.videoUrl}
                    onPause={this.props.onPause}
                    onPlay={this.props.onPlay}
                    onWaiting={this.props.onPause}
                    onSeeking={this.props.onSeeking}
                    onSeeked={this.handleSeeked}
                    controls
                    preload="auto" 
                    ref={this.videoRef}
                    // autoPlay
                />
            </div>
        );
    }
}