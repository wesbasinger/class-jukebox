import React from 'react';
import ReactDOM from 'react-dom';

const Mopidy = require('mopidy');

const mopidy = new Mopidy({
  webSocketUrl: "ws://192.168.1.65:6680/mopidy/ws/",
  callingConvention: "by-position-or-by-name"
});

console.log(mopidy)

const Header = () => {
  return(
    <div>
      <h1>Class Jukebox</h1>
      <p>Use a valid code to play a song you would like to hear.</p>
    </div>
  )
}

const Footer = () => {
  return(
    <div>
      <p>Created and maintained by Wes Basinger.  Contact wbasinger@villagetechschools.org with any issues.</p>
      <p>Powered by Mopidy.</p>
    </div>
  )
}



class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      tracks: []
    }
  }

  componentDidMount() {

  }

  render() {
    return(
      <div>
        <Header />
          <div>Main content goes here.</div>
        <Footer />
      </div>
    )
  }

}

ReactDOM.render(<App />, document.getElementById('root'));
