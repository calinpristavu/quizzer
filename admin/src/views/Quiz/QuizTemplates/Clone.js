import {connect} from "react-redux";
import {createQuizTemplate} from "../../../redux/actions";
import Edit from "./Edit";

class Clone extends Edit {
  componentDidMount() {
    this.setState({quiz: Clone.resetCriticalFields(this.props.quiz)});
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.quiz !== this.state.quiz) {
      this.setState({quiz: Clone.resetCriticalFields(nextProps.quiz)});
    }
  }

  static resetCriticalFields = (quiz) => {
    quiz.Name = "(cloned - modify to your needs) " + quiz.Name;
    quiz.ID = null;
    quiz.QuizQuestions.forEach(qq => {
      qq.QuizID = null;
    });

    return quiz;
  };
}

export default connect(
  null,
  {createQuizTemplate}
)(Clone);
