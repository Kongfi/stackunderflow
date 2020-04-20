import React, {Component} from 'react';
import { Router, Link } from "@reach/router";
import AskQuestion from './AskQuestion';
import Question from './Question';
import Questions from './Questions';

class App extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);
        this.state = {
            questions: []
        };
    }

    componentDidMount() {
        // Get everything from the API
        this.getQuestions().then(() => console.log("Questions gotten!"));
    }

    async getQuestions() {
        let url = `${this.API_URL}/questions`;
        let data = await fetch(url);
        let json = await data.json();
        return this.setState({ questions: json });
    }

    submit(title, desc, comments) {
        let last = this.state.questions[this.state.questions.length -1]
        const newQuestion = {
            id: last.id + 1,
            title: title,
            question: desc,
            comments: comments
        };
        this.setState({
            questions: [...this.state.questions, newQuestion]
        })
    }

    getQuestion(id) {
      return this.state.questions.find(q => q._id === id);
    }

    submitAnswer(answer, id){
        let state = this.state.questions;
        let element = state.find(x => x.id === parseInt(id));
        element.comments.unshift(answer);
    }

    render() {
        return (
            <>
                <nav>
                    <ul>
                        <Link to="/"><li>Home</li></Link>
                        <Link to="/"><li>Questions</li></Link>
                        <Link to="/ask"><li>Ask a question</li></Link>
                    </ul>
                </nav>

                <Router>
                  <AskQuestion path="/ask" submit={(title, desc, comments) => this.submit(title, desc, comments)} />
                  <Question path="/question/:id" getQuestion={(id) => this.getQuestion(id)}
                            submitAnswer={(answer, id) => this.submitAnswer(answer, id)} />
                  <Questions path="/" data={this.state.questions} />
                </Router>

            </>
        );
    }
}

export default App;