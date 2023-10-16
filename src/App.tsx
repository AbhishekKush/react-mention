import { useEffect, useState } from 'react';
import './App.css'
import MentionsInput from './mention/MentionsInput'

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from data.json
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        if (data ) {
          setUsers(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);


  const mentionsInputStyle = {
    // Your styles for MentionsInput
  };

  const mentionStyle = {
   
    // Your styles for Mention
  };

  return (
    <>
      <h2>React-Mention</h2>
      <MentionsInput
      placeholder="Mention"
      onChange={(data:string) => console.log("Data updating..", data)}
      data={users}
      mentionsInputStyle={mentionsInputStyle}
      mentionStyle={mentionStyle}
    />
    </>

  );
}

export default App
