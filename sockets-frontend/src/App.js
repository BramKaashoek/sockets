import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import socketIo from 'socket.io-client'


const Counter = ({match}) => {
  const [counter, setCounter] = useState(undefined)

  useEffect(() => {
    const socket = socketIo('http://localhost:3100')
    const addCounter = async () => {
      const res = await fetch(`http://localhost:3100/counters/${match.params.id}`)
      const counter = await res.json()
      setCounter(counter)
      socket.on(counter.id, (counter) => {

        setCounter(counter)
      }
      )
    }
    addCounter()
  }, [match])

  return (
    <div className="App">
      <h1> counter {match.params.id}</h1>
      {counter && <h1>count {counter.count}</h1>}
    </div>
  );
}

function App() {
 return  (
 <Router>
   <Switch>
    <Route path={`/counter/:id`} component={Counter}/>
     <Route render={() => <h1>go to counter/:id to see a counter</h1>} />
   </Switch>
  </Router>
  )
}

export default App;


