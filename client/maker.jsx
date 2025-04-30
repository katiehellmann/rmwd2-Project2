const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleMessage = (e, onMessageAdded) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#messageTitle').value;
    const rating = e.target.querySelector('#messageAge').value;
    const content = e.target.querySelector('#messageContent').value;

    if (!title || !rating) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { title, rating, content }, onMessageAdded);
    return false;
};

const MessageForm = (props) => {
    return (
        <div class="bg-element/90 rounded w-f align-center m-8">
            <h3 class="text-center text-2xl">Make a new book review!</h3>
        <form id="messageForm"
            onSubmit={(e) => handleMessage(e, props.triggerReload)}
            title="messageForm"
            action="/maker"
            method="POST"
            classTitle="messageForm"
        >
            <div class="w-full p-2">
            <label htmlFor="title">Title: </label>
            <input class="w-full" id="messageTitle" type="text" title="title" placeholder="Review Title" />
            <br></br>
            <br></br>
            <label htmlFor="rating">Rating Out Of 10: </label>
            <input class="w-1/4" id="messageAge" type="number" min="0"  max="10" title="rating" />
            <br></br>
            <br></br>
            <label htmlFor="content">Review: </label>
            <textarea class="w-full h-1/4" id="messageContent" title="content" placeholder="Your honest review here!" />
            <br></br>
            <br></br>
            <input classTitle="makeMessageSubmit" type="submit" value="Submit Review" class="rounded align-right hover:bg-secondary p-2" />
            </div>
        </form>
        </div>
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
                <h3 classTitle="emptyMessage">No Reviews yet!</h3>
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
            <div class="bg-element/75 rounded p-4 m-2" key={message._id} classTitle="message">
                <h3 class="text-xl" classTitle="messageTitle">{message.title}</h3>
                <br></br>
                <h3 classTitle="messageAge">Rating Out Of 10: {message.rating}</h3>
                {message.content && <h4 classTitle="messageContent">Review: {message.content}</h4>}
                <button onClick={handleDelete} class="bg-accent rounded align-right hover:bg-element p-2" classTitle="deleteButton">Delete</button>
                
            </div>
        );
    });

    return (
        <div classTitle="messageList">
            <h1 class="text-2xl text-white">Your Reviews!</h1>
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