const ai_icon = chrome.runtime.getURL("assets/ai-icon-16.png");

let lastVisitedPage = "";
function isPageChange() {
  // check if we are on the same page
  const currentPath = window.location.pathname;
  if (lastVisitedPage === currentPath) return false;
  lastVisitedPage = currentPath;
  return true;
}

function isProblemRoute() {
  const pathname = window.location.pathname;
  return (
    pathname.startsWith("/problems/") && pathname.length > "/problems/".length
  );
}

function observePageChange() {
  if (!isPageChange()) return;
  if (isProblemRoute) {
    addHelperButton();

  }
}
setInterval(observePageChange, 500);

function addHelperButton() {
  if (
    !window.location.pathname.startsWith("/problems/") ||
    document.getElementById("ai-helper-button")
  )
    return;
  const helperBtn = document.createElement("div");
  helperBtn.id = "ai-helper-button";
  helperBtn.classList.add(
    "relative",
    "inline-flex",
    "items-center",
    "justify-center",
    "text-caption",
    "px-3",
    "py-1",
    "gap-1",
    "rounded-full",
    "bg-fill-secondary",
    "cursor-pointer",
    "transition-colors",
    "hover:bg-fill-primary",
    "hover:text-text-primary",
    "text-sd-secondary-foreground",
    "hover:opacity-80"
  );

  const img = document.createElement("img");
  // document.getElementsByClassName("flexlayout__tab")[0].childNodes[0]
  //   .childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
  img.src = ai_icon;
  const text = document.createElement("p");
  text.textContent = "Use AI";

  helperBtn.append(img);
  helperBtn.append(text);

  const parentDiv = document.getElementsByClassName("flexlayout__tab")[0].childNodes[0].childNodes[0].childNodes[1];
  parentDiv.appendChild(helperBtn);

  helperBtn.addEventListener("click", function () {
    displayName(); // just a checker or experiment function
  });
}

function displayName() {
  const problemName = document
    .getElementsByClassName("flexlayout__tab")[0]
    .childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent.split(
      "."
    )[1]
    .trim();
  console.log(problemName);

  createChatUI(problemName);
}

function extractProblemDescription() {
  const descriptionContent = document.querySelector('.elfjS[data-track-load="description_content"]');
  const allParagraphs = descriptionContent.querySelectorAll('p');
  const extractedTexts = [];

  // Find the index of the p tag containing &nbsp;
  let nbspIndex = -1;
  for (let i = 0; i < allParagraphs.length; i++) {
    if (allParagraphs[i].innerHTML.includes('&nbsp;')) {
      nbspIndex = i;
      break;
    }
  }

  // If we found the &nbsp; p tag, collect all p tags before it
  if (nbspIndex > 0) {
    for (let i = 0; i < nbspIndex; i++) {
      extractedTexts.push(allParagraphs[i].textContent.trim());
    }
  }

  extractedTexts.forEach(para => {
    console.log(para, '\n');
  })
}


function createChatUI(problemName) {
  // Get the parent container
  const parentDiv = document.getElementsByClassName("flexlayout__tab")[0].childNodes[0].childNodes[0];

  // Remove existing chat UI if present
  const existingChat = document.getElementById("leetcode-ai-chat-container");
  if (existingChat) {
    existingChat.remove();
  }

  // Create main chat container
  const chatContainerWrapper = document.createElement("div");
  chatContainerWrapper.id = "leetcode-ai-chat-container";
  chatContainerWrapper.style.cssText = `
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    border-left: 1px solid #e5e7eb;
    background-color: white;
  `;

  // Create chat header
  const chatHeader = document.createElement("div");
  chatHeader.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color:rgb(238, 238, 238);
    border-bottom: 1px solidrgb(238, 238, 238);
  `;

  const headerTitle = document.createElement("div");
  headerTitle.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  `;

  const headerIcon = document.createElement("img");
  headerIcon.src = ai_icon;
  headerIcon.style.width = "20px";

  const headerText = document.createElement("span");
  headerText.textContent = "LeetCode AI Helper";

  headerTitle.appendChild(headerIcon);
  headerTitle.appendChild(headerText);

  const closeButton = document.createElement("button");
  closeButton.innerHTML = "×";
  closeButton.style.cssText = `
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6b7280;
  `;
  closeButton.addEventListener("click", function () {
    chatContainerWrapper.remove();
  });

  chatHeader.appendChild(headerTitle);
  chatHeader.appendChild(closeButton);

  const messagesContainer = document.createElement("div");
  messagesContainer.style.cssText = `
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    background-color: #f9fafb;
  `;

  // Add welcome message
  const welcomeMessage = document.createElement("div");
  welcomeMessage.style.cssText = `
    padding: 10px 14px;
    background-color:rgb(239, 239, 239);
    border-radius: 8px;
    margin-bottom: 12px;
    font-size: 14px;
  `;
  welcomeMessage.innerHTML = `I can help you with <strong>${problemName}</strong>. What would you like to know?`;
  messagesContainer.appendChild(welcomeMessage);

  // Create input area
  const inputArea = document.createElement("div");
  inputArea.style.cssText = `
    padding: 12px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 8px;
  `;

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.placeholder = "Ask about this problem...";
  textInput.style.cssText = `
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 14px;
    outline: none;
  `;

  const sendButton = document.createElement("button");
  sendButton.innerHTML = "Send";
  sendButton.style.cssText = `
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 14px;
  `;

  // Handle send message functionality
  function sendMessage() {
    const text = textInput.value.trim();
    if (!text) return;

    // Add user message to chat
    const userMessage = document.createElement("div");
    userMessage.style.cssText = `
      padding: 10px 14px;
      background-color:rgb(239, 239, 239);
      border-radius: 8px;
      margin-bottom: 12px;
      margin-left: 30px;
      font-size: 14px;
      text-align: right;
    `;
    userMessage.textContent = text;
    messagesContainer.appendChild(userMessage);

    // Clear input
    textInput.value = "";

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Here you would typically send the message to your backend or API
    // For now, let's add a placeholder response
    setTimeout(() => {
      const aiResponse = document.createElement("div");
      aiResponse.style.cssText = `
        padding: 10px 14px;
        background-color:rgb(237, 237, 237);
        border-radius: 8px;
        margin-bottom: 12px;
        margin-right: 30px;
        font-size: 14px;
      `;
      aiResponse.textContent = "I'm still being developed. Soon I'll be able to help you with coding problems like this one!";
      messagesContainer.appendChild(aiResponse);

      // Scroll to bottom again after response
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
  }

  sendButton.addEventListener("click", sendMessage);
  textInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  inputArea.appendChild(textInput);
  inputArea.appendChild(sendButton);

  // Assemble the chat UI
  chatContainerWrapper.appendChild(chatHeader);
  chatContainerWrapper.appendChild(messagesContainer);
  chatContainerWrapper.appendChild(inputArea);

  // Insert as the 3rd child of parentDiv
  // First, create a reference to check if we already have necessary children
  const childNodes = Array.from(parentDiv.children);

  if (childNodes.length >= 2) {
    // Insert after the 2nd child (as the 3rd child)
    parentDiv.insertBefore(chatContainerWrapper, childNodes[2]);
  } else {
    // Fallback - just append it
    parentDiv.appendChild(chatContainerWrapper);
  }

  // Focus input
  textInput.focus();
  extractProblemDescription();
}
