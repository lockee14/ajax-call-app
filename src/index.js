import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Bar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0, // length of the loading bar
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    interval = setInterval(() => { // every 30ms extend the length of the loading bar until it reaches 100 then it goes back to 0
        if(this.props.loading) {
            let progress = this.state.progress >= 100 ? 0 : this.state.progress + 3;
            this.setState({
                progress: progress
            });
        }
    }, 30);

    render() { // return a loading bar
        return (
            <div style={{width:this.state.progress + '%'}} className="bar"></div>
        );
    }
}

function LoadingSpinner(props) { // return a loading spinner
    return (
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    );
}

function Comment(props) { // return a comment
    return (
        <div>
            <h3>Title: {props.com.title}</h3>
            <p>Content: {props.com.message}</p>
        </div>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, // loading status
            message: [], // data
            message_count: 10, // number of comments to display
        };
        this.handleScroll = this.handleScroll.bind(this);
    }
  
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll); // add à scroll eventListener

        // fetch data from a rest api
        let xmlhttp = new XMLHttpRequest(); 
        let url = "https://jsonplaceholder.typicode.com/posts";
        xmlhttp.open("GET", url , true);
        xmlhttp.setRequestHeader( "Accept", "application/json; charset=utf-8" );
        xmlhttp.onreadystatechange = (event) => {
          let DONE = event.DONE || 4;
          if (event.target.readyState === DONE) {
            setTimeout(() => { // the setTimeout is added to prolongate the loading status
                this.setState({
                    loading: false, // data fetched so it end the loading state
                    message: JSON.parse(xmlhttp.response)
                })
            }, 2000)
          }
        };
        xmlhttp.send(null);

        this.setState({
            loading: true // loading set to true to display loading indicator
        })
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll); // when the component is destroyed remove the scroll eventListener
    }

    render() {
        const comment = () => { // display the comments
            if(this.state.message.length === 0) return;
            const temp = [];
            const length = this.state.message_count >= this.state.message.length ? this.state.message.length : this.state.message_count;
            for(let i=0; i < length; i++) {
                let com = {
                    title: this.state.message[i].title,
                    message: this.state.message[i].body,
                }
                temp.push(
                    <Comment key={i} com={com}/>
                );
            }
            return temp;
        };

        if(this.state.loading) {
            return ( // return this template when the data are loading
                <div>
                    <Bar loading={this.state.loading}/>
                    <h1>Simple react app</h1>
                    <h4>Load mock comments from a rest api and display load bar/spinner during loading, scroll down to display more comments.</h4>  
                    <h2>Now loading Comments:</h2>
                    <LoadingSpinner/>
                </div>
            );
        } else {
            return ( // return this template when the data are loaded
                <div id='scrollable' onScroll={(e) => this.handleScroll(e)}>
                    <h1>Simple react app</h1>
                    <h4>Load mock comment from a rest api and display load bar/spinner during loading, scroll down to display more comments.</h4>  
                    <h2>Comments:</h2>
                    <div id='comments'>{comment()}</div>
                </div>
            );
        }
    }
  
    handleScroll(e) { // function that displays more comments as the user scroll down
        const elem = e.currentTarget;
        if ((elem.innerHeight + elem.pageYOffset + 200) >= document.body.offsetHeight && this.state.message_count <= this.state.message.length) {
            let temp = this.state.message_count;
            this.setState({
                message_count: temp + 10,
            })
        }
    }
  }

  // ========================================
  
ReactDOM.render(  
    <App />,
    document.getElementById('root')
);
  