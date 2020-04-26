import { isClass, isEventProp, getEventName } from "./react-utils.js";

function createElement(element, props, ...children) {
  children = children.flat();
  let el;
  if (typeof element === "string") {
    el = handleHtmlComponent(element, props, children);
  } else if (isClass(element)) {
    el = handleClassComponent(element, props, children);
  } else if (typeof element === "function") {
    el = handleFunctionComponent(element, props, children);
  }
  return el;
}

window.classComponents = {};
let classComponentId = 0;

function handleClassComponent(clazz, props, children) {
  let el = classComponents[classComponentId];
  if (!el) {
    el = new clazz({ ...props, children });
    classComponents[classComponentId] = el;
  }
  classComponentId++;
  return el;
}

function handleFunctionComponent(fc, props, children) {
  const el = fc({ ...props, children });
  return el;
}

function handleHtmlComponent(type, props, children) {
  const el = document.createElement(type);
  children.forEach((child) => appendChild(el, child));
  addProps(el, props);
  return el;
}

function appendChild(root, child) {
  if (child.type === Component.REACT_CLASS) {
    root.append(child.render());
  } else {
    root.append(child);
  }
}

function addProps(el, props) {
  if (props === null) {
    return;
  }
  Object.entries(props).forEach(([propName, propVal]) => {
    if (propName === "className") {
      propName = "class";
    }
    if (isEventProp(propName)) {
      el.addEventListener(getEventName(propName), propVal);
    } else {
      el.setAttribute(propName, propVal);
    }
  });
}

class Component {
  static REACT_CLASS = "REACT_CLASS";

  constructor(props) {
    this.type = Component.REACT_CLASS;
    this.props = props;
  }

  setState(state) {
    if (Object.is(this.state, state)) {
      return;
    }
    this.state = { ...this.state, ...state };
    classComponentId = 1;
    reRender();
  }
}

let _container;
let _element;

function render(element, container) {
  _element = element;
  _container = container;
  if (element.type === Component.REACT_CLASS) {
    container.append(element.render());
  } else {
    container.append(element);
  }
}

function reRender() {
  while (_container.firstChild) {
    _container.removeChild(_container.lastChild);
  }
  render(_element, _container);
}

export const React = {
  createElement,
  Component,
};

export const ReactDOM = {
  render,
};
