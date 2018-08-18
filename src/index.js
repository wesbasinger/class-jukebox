import React from 'react';
import ReactDOM from 'react-dom';

const Mopidy = require('mopidy');

const mopidy = new Mopidy({
  webSocketUrl: "ws://192.168.1.65:6680/mopidy/ws/",
  callingConvention: "by-position-or-by-name"
});


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
      valid: false
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
                <td>Fill later</td>
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
          });
        } catch(TypeError) {
          console.log("Server could not connect.")
        }

      }, 1000)
  }

  render() {
    return(
      <div>
        <Header />

        <TokenInput />

        <TrackList tracks={this.state.tracks} />

        <Footer />
      </div>
    )
  }

}

ReactDOM.render(<App />, document.getElementById('root'));
