(() => {
  require('babel-register')(
    {plugins: 'transform-react-jsx'}
  );
  const React = require('react');
  const ReactDOM = require('react-dom');
  const MainContent = require('./components/main');
  const root = document.getElementById('root');
  ReactDOM.render(React.createElement(MainContent), root);
})();
