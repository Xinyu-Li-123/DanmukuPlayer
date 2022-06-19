import React from "react";
import { render } from "react-dom";
import './style/Info.css';
import {INPUT_TYPE_RANGE, validateType} from './utils'


export class InfoDisplayBar extends React.Component {
    /*
        An InfoDisplayBar is used to display dynamic info. It contains
        -   a piece of prompt
        -   a dynamic info
        -   an optional button
        e.g.
        <div>Total Count: {count}</div>

        props: {
            prompt: ""
            dynamic_info: state of the parent component
            button: React.Component()
        }
    */

    render() {
        return (
            <div className="InfoBar">
                {this.props.prompt}:&nbsp;&nbsp;&nbsp;&nbsp;
                {this.props.dynamic_info}&nbsp;&nbsp;&nbsp;&nbsp;
                {this.props.button === undefined ? "" : this.props.button}
            </div>
        );
    }

}

export class InfoSubmitBar extends React.Component {
    /* 
        An InfoSubmitBar submit certain info from an input element to some other component. The dataflow is:
        InfoSubmitBar -> InfoContainer -> root -> targetComponent

        It contains
        -   a piece of prompt as label
        -   an input field (text or checkbox)
        -   a submit button

        props: {
            propmt: "",
            type: "",   // "text" or "checkbox"
            onSubmit: function,  // callback
        }

        Note that InfoSubmitBar only support input of type listed in ./utils.INPUT_TYPE_RANGE
    */

    constructor(props) {
        if(!validateType(props.type)){
            throw new RangeError(`type of InfoSubmitBar: ${props.type} is not in the valid range of types [${INPUT_TYPE_RANGE}]`);
        }
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.inputRef = React.createRef();
    }

    clearInputValue() {
        if(this.props.type === "text") {
            this.inputRef.current.value = "";
        }
        else if(this.props.type === "checkbox") {
            this.inputRef.current.checked = false;
        }
    }

    getInputValue() {
        if(this.props.type === "text" || this.props.type === "range") {
            return this.inputRef.current.value;
        }
        else if(this.props.type === "checkbox") {
            return this.inputRef.current.checked;
        }
        else if(this.props.type === "file") {
            
        }
    }

    handleSubmit(e) {
        const inputValue = this.getInputValue();
        console.log("input value: " + inputValue);
        if(this.props.preserveInput === undefined || !this.props.preserveInput){
            // this.inputRef.current.value = "";
            this.clearInputValue();
        }
        return this.props.onSubmit(inputValue);
    }

    render() {
        return (
            <div className="InfoBar">
                <label>
                    {this.props.prompt}:&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type={this.props.type} onChange={this.handleInputChange} ref={this.inputRef} />&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="button" value="submit" onClick={this.handleSubmit}/>
                </label>
            </div>
        );
    }
}


export class InfoOnChangeBar extends React.Component {
    /*
        An InfoOnChangeBar should contain some dynamic info that needs to be passed to other component when it's changed.
        For example, a slider input that control the speed of a video should be an InfoOnChangeBar. The value of the slider, on its change,
            should be passed to the video player component.
        
        It contains
        -   a piece of prompt as label
        -   an input field

        props: {
            prompt: "",
            type: "",
            onChange: function,
            displayValue: true,     // display the value of the input dynamically
            min: 0,
            max: 100,
            step: 10
        }
    */

    constructor(props) {
        if(!validateType(props.type)){
            throw new RangeError(`type of InfoSubmitBar: ${props.type} is not in the valid range of types [${INPUT_TYPE_RANGE}]`);
        }

        super(props);
        this.state = {
            inputValue: null
        }
        this.handleChange = this.handleChange.bind(this);        
    }

    handleChange(e) {
        console.log(this.props.type);
        if(this.props.type === "text" || this.props.type === "range") {
            const inputValue = e.target.value;
            this.setState({inputValue: inputValue});
            return this.props.onChange(inputValue);
        }
        else if(this.props.type === "checkbox") {
            const inputValue = e.target.checked;
            this.setState({inputValue: inputValue});
            return this.props.onChange(inputValue);
        }
    }

    render() {
        return (
            <div className="InfoBar">
                <label>
                    {this.props.prompt}:&nbsp;&nbsp;&nbsp;&nbsp;     
                    <input 
                        type={this.props.type}
                        onChange={this.handleChange} 
                        min={this.props.min != undefined && this.props.type === "range" ? this.props.min : null}
                        max={this.props.max != undefined && this.props.type === "range" ? this.props.max : null}
                        step={this.props.min != undefined && this.props.type === "range" ? this.props.step : null}/>&nbsp;&nbsp;&nbsp;&nbsp;     
                    {this.props.displayValue === undefined || this.props.displayValue ? this.state.inputValue : ""}
                </label>
            </div>
        );
    }
}

export class FileSubmitBar extends React.Component {
    /*
    A FileSUbmitBar submit a file, convert it to text or blob (e.g. video).

    props: {
        propmt: "",
        fileType: ""  // "binary" or "blob",
        onChange,
    }
    */
    constructor(props) {
        if(!["text", "blob"].includes(props.fileType)){
            throw new RangeError("File type must be text or blob, instead of " + props.fileType)
        }
        super(props);

        this.fileReader = new FileReader();

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        // convert file to text / blob
        const file = e.target.files[0];
        const onChange = this.props.onChange;

        if(this.props.fileType === "text"){
            this.fileReader.readAsText(file);
            this.fileReader.onload = () => {
                const textResult = this.fileReader.result;
                return onChange(textResult);
            }
        }
        else if(this.props.fileType === "blob"){
            this.fileReader.readAsArrayBuffer(file);
            this.fileReader.onload = function(e) {
                let buffer = e.target.result;

                // We have to convert the buffer to a blob:
                let videoBlob = new Blob([new Uint8Array(buffer)], { type: 'video/mp4' });
            
                // The blob gives us a URL to the video file:
                const url = window.URL.createObjectURL(videoBlob);
                return onChange(url);
            }
        }
    }

    render() {
        return (
            <div>
                <label>
                    {this.props.prompt}:&nbsp;&nbsp;&nbsp;&nbsp;     
                    <input type="file" onChange={this.handleChange}/>
                </label>
            </div>
        );
    }
}


export class InfoContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            countBound: Infinity,
        };
        this.handleCountUpdate = this.handleCountUpdate.bind(this);
        this.handleCountBoundChange = this.handleCountBoundChange.bind(this);
    }

    handleCountUpdate() {
        const count = this.state.count;
        const countBound = this.state.countBound;
        count < countBound ? this.setState({count: count+1}) : this.setState({count: countBound});
    }

    handleCountBoundChange(num) {
        let newCountBound = Number(num);
        const count = this.state.count;
        if(isNaN(newCountBound)) {
            return ;
        }
        newCountBound = parseInt(newCountBound);
        this.setState({countBound: newCountBound});
        if(count > newCountBound){
            this.setState({count: newCountBound});
        }
    }

    handleDanmukuFileSubmit(xml_txt) {

    }

    render() {
        return (
            <div className="InfoContainer">
                <h2>This is the info container</h2>

                <InfoDisplayBar 
                    name="count-display"
                    prompt="Current Count" 
                    dynamic_info={this.state.count} 
                    button={<button onClick={this.handleCountUpdate}>COUNT++</button>}/>

                <InfoSubmitBar 
                    name="countBound-submit"
                    prompt="Enter your desired upper bound for count"
                    type="text" 
                    onSubmit={this.handleCountBoundChange} 
                    preserveInput={true}/>
                
                <InfoOnChangeBar 
                    name="countBound-onChange"
                    prompt="Set the upper bound for count"
                    type="range"
                    min={20} max={90} step={7}
                    onChange={this.handleCountBoundChange}
                />

                <InfoOnChangeBar
                    name="showDanmuku" 
                    prompt="Show Danmuku"
                    type="checkbox"
                    onChange={() => console.log("poof")}
                />

                <FileSubmitBar
                    name="danmukuFileSubmit"
                    prompt="Upload Danmuku File"
                    fileType="text"
                    onChange={(str) => console.log(str)} />
                
                {/* <FileSubmitBar
                    name="VideoFileSubmit"
                    prompt="Upload Video File"
                    fileType="blob"
                    onChange={() => console.log("wow")} /> */}
            </div>
        );
    }
}
