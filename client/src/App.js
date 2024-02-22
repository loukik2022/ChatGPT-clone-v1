import "./App.css";
import { useState, useEffect } from "react";

function App() {
  // The useEffect hook is used to call the getModels function once when the app loads
  useEffect(() => {
    getModels();
  }, []);

  // Declare state variables for input, models, current model, and chat log
  const [input, setInput] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: "How can I help you?",
    },
  ]);

  // function to clear the chat log
  const clearChatLog = () => {
    setChatLog([]);
  };

  // function to fetch the list of available models from the local server
  function getModels() {
    fetch("http://localhost:3080/models")
      .then((response) => response.json())
      .then((data) => setModels(data.models.data));
  }

  // Define a function to handle the form submission
  async function handleSubmit(e) {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Add the user's input to the chat log
    let chatLogNew = [...chatLog, { user: "me", message: `${input}` }];
    // Clear the input field
    setInput("");
    // Update the chat log state
    setChatLog(chatLogNew);

    // Map the chat log array to a string with newline separators
    const messages = chatLogNew.map((message) => message.message).join("\n");
    // Send a POST request to the local server with the chat log and the current model
    const response = await fetch("http://localhost:3080", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messages,
        currentModel: currentModel,
      }),
    });

    // Update the chat log with the response from the server
    const data = await response.json();
    setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}` }]);
  }

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="sidemenu-new-button" onClick={clearChatLog}>
          <span>+</span>
          New Chat
        </div>

        <div className="models">
          <div className="models-title">Models</div>
          <select onChange={(e) => 
            setCurrentModel(e.target.value)
          }>
            {models.map((model) => (
              <option id={model.id}>
                {model.id}
              </option>
            ))}
          </select>
        </div>
        
      </aside>
      
      <section className="chatbox">
          <div className="chat-log">
            {chatLog.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
          </div>

        <div className="chat-input">
          <form onSubmit={handleSubmit}>
            <input 
              rows = "1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="chat-input-textarea" 
              placeholder="Type a message" 
            ></input>
          </form>
        </div>
        
      </section>
    </div>
  );
}

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.user === "gpt" && "chatgpt"}`}>
      <div className="chat-message-center">
        <div className={`avatar ${message.user === "gpt" && "chatgpt"}`}>
          {message.user === "gpt" && (
            <svg
              transform="scale(0.8)"
              width={41}
              height={41}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              strokeWidth={1.5}
              className="h-6 w-6"
            >
              <path
                d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835A9.964 9.964 0 0 0 18.306.5a10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.516 3.35 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813ZM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496ZM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744ZM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.01L7.04 23.856a7.504 7.504 0 0 1-2.743-10.237Zm27.658 6.437-9.724-5.615 3.367-1.943a.121.121 0 0 1 .113-.01l8.052 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.65-1.132Zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763Zm-21.063 6.929-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225Zm1.829-3.943 4.33-2.501 4.332 2.5v5l-4.331 2.5-4.331-2.5V18Z"
                fill="currentColor"
              />
            </svg>
          )}
        </div>
        <div className="message">{message.message}</div>
      </div>
    </div>
  );
};


export default App;

// The provided code is a React component that represents a chat application. Here's a breakdown of how it works:

// 1. The code imports necessary dependencies, including React, useState, and useEffect from the 'react' package.
// 2. The `App` function is the main component that renders the chat application.
// 3. Within the `App` component, there are several state variables defined using the `useState` hook:
//    - `input`: Stores the user's input message.
//    - `models`: Stores an array of available models.
//    - `currentModel`: Stores the ID of the currently selected model.
//    - `chatLog`: Stores an array of chat messages between the user and the GPT model.
// 4. The `useEffect` hook is used to fetch the available models from the server when the component mounts (`[]` dependency array ensures it runs only once).
// 5. The `getEngines` function is called when the component mounts and makes a GET request to fetch the available models from the server.
// 6. The `handleSubmit` function is called when the user submits a message. It:
//    - Prevents the default form submission behavior.
//    - Constructs the chat log by appending the user's input message to the existing chat log.
//    - Joins all the messages in the chat log with newline characters.
//    - Sends a POST request to the server with the message and the current model ID.
//    - If the response is successful, the received message from the server is appended to the chat log using `setChatLog`.
// 7. The `clearChat` function is called when the user clicks the "New Chat" button. It clears the chat log by setting it to an empty array.
// 8. The render function returns JSX that represents the structure of the chat application:
//    - A div with the `App` class is the root element.
//    - Inside, there is an aside element for the side menu, containing a button for clearing the chat and a dropdown for selecting models.
//    - The main section contains the chat log and the input form.
//    - The chat log is rendered using the `map` function on the `chatLog` array, and each message is rendered using the `ChatMessage` component.
//    - The input form allows users to enter messages and submit them by clicking enter or the submit button.
//    - The `ChatMessage` component is responsible for rendering individual chat messages, with the user's messages styled differently from the GPT model's messages.

// Make sure you have the required dependencies installed (`react`, `react-dom`, etc.) and that the necessary CSS files (`App.css`) are imported properly for the styles to be applied correctly. Also, ensure that the server URL (`http://localhost:3080`) is correct and that the server is running and correctly responding to the API requests made by the client.