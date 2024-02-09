import { useEffect, useState } from 'react'; // Importing necessary hooks from React
import './App.css'; // Importing CSS file for styling
import { BsThreeDots } from 'react-icons/bs'; // Importing icon components
import { CiCirclePlus } from 'react-icons/ci';
import { RxDotFilled } from 'react-icons/rx';
import { IoSendSharp } from 'react-icons/io5';
import { apiConnector } from './apiconnector.js'; // Importing API connector function

function App() {
  // State variables for managing chat functionality
  const [openChat, setOpenChat] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  // useEffect hook to manage side effects
  useEffect(() => {
    // Update currentTitle if it's not set and both userInput and aiResponse are available
    if (!currentTitle && userInput && aiResponse) {
      setCurrentTitle(userInput);
    }
    // Update previousChats with user and AI responses
    if (currentTitle && userInput && aiResponse) {
      setPreviousChats(previousChats => (
        [...previousChats,
        {
          title: currentTitle,
          role: "user",
          content: userInput
        },
        {
          title: currentTitle,
          role: aiResponse.role,
          content: aiResponse.content
        },
        ]
      ));
    }
  }, [aiResponse, currentTitle]);

  // Function to clear user query
  const clearQuery = () => {
    setUserInput("");
    setCurrentTitle(null);
    setAiResponse(null);
  };

  // Function to fetch AI response based on user input
  const getUserPrompt = async (userPrompt) => {
    const res = await apiConnector("POST", "http://localhost:4000/getResponse", { userPrompt });
    setAiResponse(res.data.data);
  };

  // Filtering current chat based on currentTitle
  const currentChat = previousChats.filter((previousChat) => previousChat.title === currentTitle);

  // Unique titles for chats
  const uniqueTitles = Array.from(new Set(previousChats.map((previousChat) => previousChat.title)));

  return (
    <div className='w-11/12 mx-auto bg-[rgb(0,8,20)] h-screen'>
      <div className="relative">
        {/* Chat input interface */}
        <div className={`${openChat ? "block" : "hidden"} bg-[rgb(22,29,41)] text-[rgb(241,242,255)]  fixed w-[350px] h-[350px]  bottom-20  right-10 rounded-md transition-all duration-200 scroll-smooth py-1`}>
          <div className='flex relative flex-col h-full w-full'>
            {/* Display output */}
            <div className='h-[85%]  flex flex-col gap-4  overflow-y-scroll chat-display'>
              {!aiResponse && <div className='flex justify-center items-center h-full'>Welcome to AI Assistant Bot</div>}
              <ul>
                {
                  currentChat?.map((chat, index) => (
                    <li key={index} className={`${chat.role === "assistant" ? "bg-gray-300 bg-opacity-20" : "bg-transparent"} flex gap-6 items-center text-white text-xs p-2`}>
                      <p className='max-w-[10%]'>{chat.role}</p>
                      <p className='max-w-[90%]'>{chat.content}</p>
                    </li>
                  ))
                }
              </ul>
            </div>
            {/* User Input */}
            <div className='w-full h-[20%]  bottom-0 flex items-center relative  px-2 text-white'>
              <input value={userInput} onChange={(e) => setUserInput(e.target.value)} rows={1} placeholder='You can type here' className='outline-none resize-none py-2 bg-transparent rounded-md border border-gray-600 text-xs w-full px-1' />
              <div className='absolute right-3 text-sm flex gap-2'>
                <button className='group' type='submit' onClick={() => getUserPrompt(userInput)}>
                  <IoSendSharp size={20} />
                  <div className='bg-white hidden group-hover:inline absolute left-0  bottom-10 rounded-md w-14 py-2 px-2 text-center text-[rgb(22,29,41)] text-xs transition-all duration-200 '>Search</div>
                </button>
                <button className='group' type='reset' onClick={() => clearQuery()}>
                  <CiCirclePlus size={20} />
                  <div className='bg-white hidden group-hover:inline absolute left-0  bottom-10 rounded-md w-14 py-2 px-2 text-center text-[rgb(22,29,41)] text-xs transition-all duration-200 '>New chat</div>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Chat footer */}
        <div className='fixed bottom-0 w-16 right-4 rounded-md '>
          <button className='relative w-11/12   group' onClick={() => setOpenChat(!openChat)}>
            <svg className="" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="black" d="M32.0006 0C14.3273 0 0 14.3081 0 31.96C0 49.611 14.3273 63.9201 32.0006 63.9201C34.0607 63.9201 36.0737 63.7243 38.0247 63.3518L38.0238 63.3528C38.0238 63.3528 44.8979 61.8706 50.571 62.9143C53.1521 63.3907 57.0951 63.999 60.3472 63.6055C61.9802 63.4077 62.6322 61.4951 61.5352 60.2716C59.6692 58.1892 58.8592 53.1975 62.6392 41.1935C62.7892 40.6961 62.9282 40.1937 63.0542 39.6854C63.6693 37.2115 64.0013 34.6247 64.0013 31.96C64.0013 14.3081 49.674 0 32.0006 0Z" fill="orange"></path>
            </svg>
            {/* Dots */}
            <div className="text-white relative z-1000">
              <span className={`opacity-100 group-hover:opacity-0  absolute  bottom-[5%] left-0 duration-200 transition-all`}><BsThreeDots size={"2/3"} /></span>
              <span className={`${openChat ? "group-hover:opacity-100" : "opacity-0"} z-1000 opacity-0  duration-200 transition-all absolute translate-y-2 -top-10 `}><RxDotFilled size={"2/3"} /></span>
              {/* Smile on hover */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 12" className={`${openChat ? "opacity-0 hidden" : "group-hover:opacity-100"} opacity-0 absolute  -top-6 left-[10%] duration-200 transition-all  w-2/3`} >
                <path d="M17,12c-0.3,0-0.5,0-0.8,0C6.9,11.6,0.7,3.6,0.4,3.2c-0.7-0.9-0.5-2.1,0.4-2.8c0.9-0.7,2.1-0.5,2.8,0.4C3.7,0.9,9,7.7,16.4,8c4.8,0.2,9.5-2.3,14.1-7.3c0.7-0.8,2-0.9,2.8-0.1c0.8,0.7,0.9,2,0.1,2.8C28.3,9.1,22.7,12,17,12z" fill="white"></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
