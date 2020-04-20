import React, {Component} from 'react';
import PostAnswer from "./PostAnswer";

class Question extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id
        }
    }

    submit(answer) {
        this.setState({
            answer: answer
        }, () => {
            this.props.submitAnswer(this.state.answer, this.state.id);
        });
    }

    async addVote(id, vote) {
        await fetch(`${this.API_URL}/vote`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify({
                answerId: id,
                vote: vote
            })
        });
    }

    render() {
        const id = this.props.id;
        const question = this.props.getQuestion(id);

        return (
            <>
                <h1>{question.title}</h1>
                <p>{question.question}</p>

                <PostAnswer data={this.state.id} />

                <h2>Replies</h2>
                <ul id="replies">
                    {question.comments.map(x => (
                        <li key={x._id}>
                            <p>{x.text}</p>
                            <div>
                                <button className="updoot" onClick={ () => {this.addVote(x._id, "up")}}>Upvote</button>
                                <p>{x.votes}</p>
                                <button className="downdoot" onClick={ () => {this.addVote(x._id, "down")}}>Downvote</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </>
        );
    }
}

export default Question;

