(() => {
  // The fragment of the URL determines the next script to load (in the app directory).
  const [currentSrc, nextSrc] = document.currentScript.src.split('#');

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      script.onload = function() {resolve();};
      document.querySelector('head').appendChild(script);
    });
  }

  Promise.all([
    loadScript('https://unpkg.com/react@16.0.0/umd/react.development.js'),
    loadScript('https://unpkg.com/@babel/standalone@7.2.5/babel.min.js')
  ]).then(
    () => loadScript('https://unpkg.com/react-dom@16.0.0/umd/react-dom.development.js')
  ).then(() => {
    fetch(`app/${nextSrc}`)
      .then((r) => r.text())
      .then((script) => {
        const transformedCode = Babel.transform(script, { presets: ['es2017', 'react'] }).code;
        eval(transformedCode);
      });
  });
})();
