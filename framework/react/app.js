import { React, ReactDOM } from "./react.js";

function Title(props) {
  return React.createElement("h1", null, props.text);
}

function Box(props) {
  return React.createElement("div", { className: "box" }, props.children);
}

class Counter extends React.Component {
  state = {
    n: 0
  }

  add = () => {
    this.setState({
      n: this.state.n + 1
    });
  }

  sub = () => {
    this.setState({
      n: this.state.n - 1
    });
  }

  render() {
    return (
      React.createElement("div", null,
        React.createElement("p", null, this.state.n),
        React.createElement("button", { onClick: this.add, className: "btn" }, "+"),
        React.createElement("button", { onClick: this.sub, className: "btn" }, "-")
      )
    )
  }
}

class App extends React.Component {
  state = {
    text: "This is a fake react app"
  };

  handleInputChange = (e) => {
    this.setState({
      text: e.target.value
    });
  }

  render() {
    return (
      React.createElement("div", null,
        React.createElement(Title, { text: this.state.text }),
        React.createElement("input", { onKeyup: this.handleInputChange, value: this.state.text }),
        React.createElement(Box, null,
          React.createElement("h2", null, "This is box"),
          React.createElement("p", null, "hahahhahahha, this is p!")
        ),
        React.createElement(Counter, { id: "1" }),
        React.createElement(Counter, { id: "2" })
      )
    );
  }
}

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById("root")
);
