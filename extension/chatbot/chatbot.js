function initializeChatBot(problemName) {
  const messagesContainer = document.getElementById('chatbot-messages');
  const inputField = document.getElementById('chatbot-input');
  const sendButton = document.getElementById('chatbot-send');
  const closeButton = document.querySelector('.chatbot-close');
  const problemNameElement = document.querySelector('.problem-name');

  // Set the problem name
  problemNameElement.textContent = problemName;

  // Close the chat bot
  closeButton.addEventListener('click', function() {
    document.querySelector('.leetcode-helper-chatbot').style.display = 'none';
  });

  // Send message when button is clicked
  sendButton.addEventListener('click', sendMessage);

  // Send message when Enter is pressed
  inputField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  function sendMessage() {
    const message = inputField.value.trim();
    if (message) {
      // Add user message to chat
      addMessage(message, 'user');
      inputField.value = '';
      
      // Here you would typically call your AI API
      // For now, we'll simulate a response
      simulateBotResponse(message, problemName);
    }
  }

  function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageElement.textContent = text;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function simulateBotResponse(message, problemName) {
    // Simulate thinking delay
    setTimeout(() => {
      let response = "I'm your AI assistant. In a real implementation, I would analyze your question about ";
      response += `"${problemName}" and provide a helpful response. `;
      response += "You could connect me to an AI API like OpenAI to get real answers.";
      addMessage(response, 'bot');
    }, 1000);
  }
}