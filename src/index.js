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

const TrackDetail = (props) => {
  return(
    <div>
      <p>{props.track.name}</p>
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

    let self = this;

    setTimeout(() => {
      mopidy.library.browse({"uri":"local:directory"}).then(function(data){
        self.setState({tracks: data})
      });
    }, 1000)
  }

  render() {
    return(
      <div>
        <Header />
        {
          this.state.tracks.map((track) => {
            return(
              <div key={track.uri}>
                <TrackDetail track={track} />
                <input placeholder="Enter a valid code"/>
                <button>Play</button>
              </div>
            )
          })
        }
        <Footer />
      </div>
    )
  }

}

ReactDOM.render(<App />, document.getElementById('root'));
