import React, {Component} from 'react';
import { Link } from "@reach/router";

class Questions extends Component {
    render() {
        let questions = this.props.data;
        const list = questions.map(d =>
            <li key={d._id}>
                <Link to={`/question/${d._id}`}>{d.title}</Link>
            </li>
        );

        return (
            <>
                <h3>All questions</h3>
                <ul>
                    {list}
                </ul>
            </>
        );
    }
}

export default Questions;

