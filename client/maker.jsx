const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleMessage = (e, onMessageAdded) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#messageTitle').value;
    const subtitle = e.target.querySelector('#messageAge').value;
    const content = e.target.querySelector('#messageContent').value;

    if (!title || !subtitle) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { title, subtitle, content }, onMessageAdded);
    return false;
};

const MessageForm = (props) => {
    return (
        <form id="messageForm"
            onSubmit={(e) => handleMessage(e, props.triggerReload)}
            title="messageForm"
            action="/maker"
            method="POST"
            classTitle="messageForm"
        >
            <label htmlFor="title">Title: </label>
            <input id="messageTitle" type="text" title="title" placeholder="Message Title" />

            <label htmlFor="subtitle">Subtitle: </label>
            <input id="messageAge" type="number" min="0" title="subtitle" />

            <label htmlFor="content">Favorite Food: </label>
            <input id="messageContent" type="text" title="content" placeholder="Message's Favorite Food" />


            <input classTitle="makeMessageSubmit" type="submit" value="Make Message" />
        </form>
    );
};

const MessageList = (props) => {
    const [messages, setMessages] = useState(props.messages);

    useEffect(() => {
        const loadMessagesFromServer = async () => {
            const response = await fetch('/getMessages');
            const data = await response.json();
            setMessages(data.messages);
        };
        loadMessagesFromServer();
    }, [props.reloadMessages]);

    if (messages.length === 0) {
        return (
            <div classTitle="messageList">
                <h3 classTitle="emptyMessage">No Messages yet!</h3>
            </div>
        );
    }

    const messageNodes = messages.map(message => {
        const handleDelete = async () => {
            await helper.sendDelete('/deleteMessage', { id: message._id }, () => { //deleting messages
                props.triggerReload();
            });
        };

        return (
            <div key={message._id} classTitle="message">
                <h3 classTitle="messageTitle">{message.title}</h3>
                <img src="/assets/img/messageFace.jpeg" alt="Message Face" classTitle="messageFace" />
                <h3 classTitle="messageAge">Subtitle: {message.subtitle}</h3>
                {message.content && <h4 classTitle="messageContent">Favorite Food: {message.content}</h4>}
                <button onClick={handleDelete} classTitle="deleteButton">Delete</button>
                
            </div>
        );
    });

    return (
        <div classTitle="messageList">
            {messageNodes}
        </div>
    );
};

const App = () => {
    const [reloadMessages, setReloadMessages] = useState(false);

    return (
        <div>
            <div id="makeMessage">
                <MessageForm triggerReload={() => setReloadMessages(!reloadMessages)} />
            </div>
            <div id="messages">
                <MessageList messages={[]} reloadMessages={reloadMessages} triggerReload={() => setReloadMessages(!reloadMessages)} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;