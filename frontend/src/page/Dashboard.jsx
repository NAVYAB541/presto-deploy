import React from 'react';
import axios from 'axios';

const Dashboard = function ({ token }) {

  const [store, setStore] = React.useState(null);

  const reallySetStore = (newStore) => {
    axios.put(
      'http://localhost:5005/store',
      {
        store: newStore,
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
      .then(() => {
        setStore(newStore);
      })
      .catch((error) => {
        alert(error.response.data.error);
      });
  }

  React.useEffect(() => {
    if (token) {
      axios.get('http://localhost:5005/store', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => {
          setStore(response.data.store);
        })
        .catch((error) => {
          alert(error.response.data.error);
        });
    }
  }, [token]);

  const newDeck = () => {
    const newStore = { ...store };
    if (!('decks' in newStore)) {
      newStore['decks'] = [];
    }
    newStore['decks'].push({
      title: 'Hayden sucks',
    })
    reallySetStore(newStore);
  }

  return <>
    ALL YOUR STUFF!<br />
    <button onClick={newDeck}>New Deck</button>
    {store ? JSON.stringify(store) : 'Loading...'};
  </>
}

export default Dashboard