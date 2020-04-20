import React, {Component} from 'react';

class AskQuestion extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            desc: "",
            comments: []
        }
    }

    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    async onSubmit() {
        await fetch(`${this.API_URL}/newquestion`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify({
                title: this.state.title,
                desc: this.state.desc
            })
        });
    }

    render() {
        return (
            <>
                <input
                    placeholder="Write a title here"
                    name="title"
                    onChange={ event => this.onChange(event)}
                    type="text"
                />
                <input
                    placeholder="Write your question here"
                    name="desc"
                    onChange={ event => this.onChange(event)}
                    type="text"
                />
                <button onClick={_ => this.onSubmit()}>Ask Question</button>
            </>
        );
    }
}

export default AskQuestion;
