import React from 'react';
import ReactDOM from 'react-dom';

import Mopidy from 'mopidy';

const mopidy = new Mopidy({
  webSocketUrl: "ws://localhost:6680/mopidy/ws/",
  callingConvention: "by-position-or-by-name",
  console: true
});

console.log(mopidy);

const checkToken = (token) => {

  if(token.length !== 6) {
    return false;
  }

  let stripped = "";

  for(let i=0; i <token.length; i++) {
    let char = token.charAt(i);

    if (!isNaN(char)) {
      stripped += char;
    }
  }

  console.log(stripped)

  if (Number(stripped) % 3 === 0) {
    return true;
  } else {
    return false;
  }
}

const Header = () => {
  return(
    <div>
      <h1>Class Jukebox</h1>
      <p>Use a valid code to play a song you would like to hear.</p>
    </div>
  )
}

class TokenInput extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      token: "",
      valid: false,
      trackNumber: ""
    }
  }

  render() {
    return(
      <div>
        <label htmlFor="token">Token:</label>
        <input placeholder="Enter a valid code." value={this.state.token} onChange={(e) => {
          const status = checkToken(e.target.value);
          this.setState({token: e.target.value, valid: status});
        }}/>
        <p>
          {
            this.state.valid ? "Valid token" : "Invalid or no token"
          }
        </p>
        <label htmlFor="track">Track Number</label>
        <input placeholder="Enter a track number" value={this.state.trackNumber} onChange={(e) => {
          this.setState({trackNumber: Number(e.target.value)})
        }}/>
        <button onClick={(e) => {
          if(this.state.valid) {
            this.props.handlePlayRequest(this.state.trackNumber);
            this.setState({token: "", valid: false, trackNumber: ""})
          } else {
            alert("Enter a valid token before attempting to play a song.");
          }
        }}>Play</button>
      </div>
    )
  }
}

const Footer = () => {
  return(
    <div>
      <p>Created and maintained by Wes Basinger.  Contact wbasinger@villagetechschools.org with any issues.</p>
      <p>Powered by Mopidy.</p>
    </div>
  )
}


const TrackList = (props) => {

  if(props.tracks.length === 0) {
    return(
      <p>No tracks found.  Check connection to server and try refresing the page.</p>
    )
  } else {
    return(
      <table>
      <thead>
        <tr>
          <td>Track Number</td>
          <td>Title</td>
          <td>Number of Plays</td>
        </tr>
      </thead>
      <tbody>
        {

          props.tracks.map((track) => {

            return(
              <tr key={track.uri}>
                <td>{track.id}</td>
                <td>{track.name}</td>
                <td>Fill later</td>
              </tr>
            )
          })
        }
      </tbody>
      </table>
    )
  }
}


class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      tracks: []
    }

    this.playTrack = this.playTrack.bind(this);
  }

  componentDidMount() {

    let self = this;

      setTimeout(() => {

        try {
          mopidy.library.browse({"uri":"local:directory"}).then(function(data){

            let index = 1;

            data.forEach((track) => {
              track.id = index;
              index ++;
            })

            self.setState({tracks: data})

            mopidy.tracklist.getLength().then(
              (results) => {
                console.log("Tracklist length")
                console.log(results)
              })

          });
        } catch(TypeError) {
          console.log("Server could not connect.")
        }

      }, 1000)
  }

  playTrack(trackNumber) {

    const trackUri = this.state.tracks[trackNumber-1].uri

    mopidy.playback.getState().then((result) => {
      if(result === "stopped") {

        mopidy.tracklist.add({uri: trackUri});

        mopidy.playback.play({tlid: 1});

        mopidy.tracklist.clear()
      } else {

        alert("Please wait until the current song is completed.")

      }
    })

  }

  render() {
    return(
      <div>
        <Header />

        <TokenInput handlePlayRequest={this.playTrack} />

        <TrackList tracks={this.state.tracks} />

        <Footer />
      </div>
    )
  }

}

ReactDOM.render(<App />, document.getElementById('root'));
