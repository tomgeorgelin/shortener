import React from "react";
import Card from "./Card";

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFinal = this.handleChangeFinal.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClickCopy = this.handleClickCopy.bind(this);
        this.handleFocus = this.handleFocus.bind(this);

        this.state = {
            url : '',
            code : '',
            finalUrl: '',
            displayCode : false
        };
    }

    handleClick() {
        if(this.state.url) {
            fetch('/api', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({url: this.state.url})
            })
            .then(res => res.json())
            .then(data => {
                var code = data.code
                this.setState({code,displayCode:true,finalUrl:code})
            })
            .catch(error => console.log(error));
        }
    }

    handleChange(event) {
        this.setState({url:event.target.value});
    }

    handleChangeFinal(event) {
        this.setState({finalUrl:event.target.value});
    }

    handleClickCopy() {
        navigator.clipboard.writeText(this.state.finalUrl);
    }

    handleFocus(event) {
        event.target.select();
    }

    render() {
        var result = <Card>
            <div>
                <div className="title">This is your shortened link!</div>
                <input type="text" name="long-url" value={this.state.finalUrl} onChange={this.handleChangeFinal} onFocus={this.handleFocus}/>
                <div onClick={this.handleClickCopy} className="button">Copy link</div>
            </div>
        </Card>

        return <React.Fragment>
            <Card style={{marginTop:'20vh'}} className="my-5">
                <div className="title">Create your own shortened link!</div>
                <input type="text" value={this.state.url} onChange={this.handleChange} className="my-5"/>
                <div onClick={this.handleClick} className="button">Create link</div>
            </Card>
            {this.state.displayCode ? result : ''}
        </React.Fragment> 
    }
}

export default Home;