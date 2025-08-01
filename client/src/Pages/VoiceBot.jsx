// import { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { askFitnessQuestion } from '../services/api';
// import { toast } from 'react-toastify';
// import Navbartwo from '../Components/Navbartwo';
// const VoiceBot = () => {
//   const [question, setQuestion] = useState('');
//   const [answer, setAnswer] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isListening, setIsListening] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const recognitionRef = useRef(null);
//   const utteranceRef = useRef(null);
//   const navigate = useNavigate();

//   const startListening = () => {
//     if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.lang = 'en-US';
//       recognitionRef.current.continuous = true;
//       recognitionRef.current.interimResults = false;
//       recognitionRef.current.maxAlternatives = 1;

//       recognitionRef.current.onstart = () => {
//         setIsListening(true);
//         toast.info('Hey, I’m all ears! Ask me about fitness.');
//       };

//       recognitionRef.current.onaudiostart = () => {
//         if (isSpeaking) {
//           window.speechSynthesis.cancel(); // Stop speaking when user starts talking
//           setIsSpeaking(false);
//           console.log('Stopped speaking due to user audio input');
//         }
//       };

//       recognitionRef.current.onresult = (event) => {
//         const transcript = event.results[event.results.length - 1][0].transcript.trim();
//         console.log('Heard:', transcript);
//         setQuestion(transcript);
//         if (isSpeaking) {
//           window.speechSynthesis.cancel(); // Ensure speaking stops
//           setIsSpeaking(false);
//         }
//         recognitionRef.current.stop(); // Pause to process question
//         handleSubmit({ preventDefault: () => {} }, transcript);
//       };

//       recognitionRef.current.onerror = (event) => {
//         console.error('Speech recognition error:', event.error);
//         setError('Oops, something went wrong: ' + event.error);
//         toast.error('Oops, something went wrong: ' + event.error);
//         setIsListening(false);
//       };

//       recognitionRef.current.onend = () => {
//         if (isListening && !isSpeaking) {
//           console.log('Restarting speech recognition...');
//           try {
//             recognitionRef.current.start(); // Resume listening immediately
//           } catch (err) {
//             console.error('Failed to restart recognition:', err);
//             setIsListening(false);
//           }
//         } else {
//           setIsListening(false);
//         }
//       };

//       try {
//         recognitionRef.current.start();
//       } catch (err) {
//         console.error('Failed to start recognition:', err);
//         setError('Couldn’t start listening. Try again!');
//         toast.error('Couldn’t start listening. Try again!');
//       }
//     } else {
//       setError('Speech recognition isn’t supported in this browser. Try typing instead!');
//       toast.error('Speech recognition isn’t supported in this browser.');
//     }
//   };

//   const stopListening = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       recognitionRef.current = null;
//       setIsListening(false);
//       window.speechSynthesis.cancel();
//       setIsSpeaking(false);
//       toast.info('I’ve stopped listening. Click Start to chat again!');
//     }
//   };

//   const speakAnswer = (text) => {
//     if ('speechSynthesis' in window) {
//       utteranceRef.current = new SpeechSynthesisUtterance(text);
//       utteranceRef.current.rate = 1.1;
//       utteranceRef.current.pitch = 1;
//       utteranceRef.current.onstart = () => {
//         setIsSpeaking(true);
//         if (recognitionRef.current) recognitionRef.current.stop(); // Pause listening during speech
//       };
//       utteranceRef.current.onend = () => {
//         setIsSpeaking(false);
//         if (isListening && recognitionRef.current) {
//           console.log('Resuming listening after speaking...');
//           try {
//             recognitionRef.current.start(); // Resume listening
//           } catch (err) {
//             console.error('Failed to resume recognition:', err);
//             setIsListening(false);
//           }
//         }
//       };
//       window.speechSynthesis.speak(utteranceRef.current);
//     } else {
//       setError('Text-to-speech isn’t supported in this browser.');
//       toast.error('Text-to-speech isn’t supported in this browser.');
//     }
//   };

//   const handleSubmit = async (e, submittedQuestion = question) => {
//     e.preventDefault();
//     if (!submittedQuestion) {
//       setError('Please say or type a question!');
//       toast.error('Please say or type a question!');
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('Please log in to chat with me!');
//         toast.error('Please log in to chat with me!');
//         navigate('/login');
//         return;
//       }
//       const payload = { question: submittedQuestion.trim() };
//       console.log('Sending payload:', payload);
//       const response = await askFitnessQuestion(payload);
//       const friendlyAnswer = response.answer.startsWith('Hey') || response.answer.startsWith('Awesome')
//         ? response.answer
//         : `Hey, great question! ${response.answer}`;
//       setAnswer(friendlyAnswer);
//       speakAnswer(friendlyAnswer);
//       toast.success('Got an answer for you!');
//     } catch (err) {
//       console.error('Answer question error:', err);
//       const errorMsg = err.response?.data?.msg || 'Couldn’t get an answer. Try again!';
//       const errorAnswer = err.response?.data?.answer || errorMsg;
//       setError(errorMsg);
//       setAnswer(errorAnswer);
//       speakAnswer(errorAnswer);
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//       window.speechSynthesis.cancel();
//       recognitionRef.current = null;
//       utteranceRef.current = null;
//     };
//   }, []);

//   return (
//     <>
    
//     <Navbartwo />    
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white flex flex-col items-center pt-20">
//       <h1 className="text-4xl font-extrabold text-teal-400 mb-6">Your Fitness Buddy</h1>
//       <p className="text-gray-300 mb-4">Ask me anything about fitness, and I’ll respond like a friend!</p>
//       {loading && <p className="text-gray-300">Thinking...</p>}
//       {error && <p className="text-red-400 mb-4">{error}</p>}
//       <div className="w-full max-w-md">
//         <textarea
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           placeholder="Ask your fitness question (e.g., 'What are good exercises for weight gain with a dumbbell?')"
//           className="p-2 border border-gray-700 rounded bg-gray-900 text-white w-full h-24 mb-4"
//         />
//         <div className="flex space-x-4">
//           <button
//             type="button"
//             onClick={isListening ? stopListening : startListening}
//             className={`flex-1 px-6 py-3 bg-gradient-to-r ${
//               isListening ? 'from-red-500 to-pink-500' : 'from-teal-500 to-purple-500'
//             } text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300`}
//           >
//             {isListening ? 'Stop Listening' : 'Start Listening'}
//           </button>
//           <button
//             type="button"
//             onClick={handleSubmit}
//             disabled={loading || !question}
//             className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 disabled:opacity-50"
//           >
//             Ask
//           </button>
//         </div>
//       </div>
//       {answer && (
//         <div className="mt-6 p-4 bg-gray-800/40 backdrop-blur-lg rounded-lg shadow-lg w-full max-w-md">
//           <p className="text-xl font-semibold text-teal-400 mb-2">My Answer:</p>
//           <p className="text-gray-300">{answer}</p>
//           <button
//             onClick={() => speakAnswer(answer)}
//             className="mt-4 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
//             disabled={isSpeaking}
//           >
//             Read Aloud
//           </button>
//         </div>
//       )}
//     </div></>
//   );
// };

// export default VoiceBot;



import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { askFitnessQuestion } from '../services/api';
import { toast } from 'react-toastify';
import Navbartwo from '../Components/Navbartwo';

const VoiceBot = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);
  const navigate = useNavigate();

  const startListening = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        toast.info('Hey, I’m all ears! Ask me about fitness.', { autoClose: 3000 });
        console.log('Speech recognition started');
      };

      recognitionRef.current.onaudiostart = () => {
        if (isSpeaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
          console.log('Stopped speaking due to user audio input');
        }
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        console.log('Heard:', transcript);
        setQuestion(transcript);
        recognitionRef.current.stop(); // Pause to process question
        handleSubmit({ preventDefault: () => {} }, transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        const errorMsg = `Speech recognition error: ${event.error}`;
        setError(errorMsg);
        toast.error(errorMsg, { autoClose: 3000 });
        setIsListening(false);
        // Retry for transient errors
        if (['network', 'aborted'].includes(event.error)) {
          setTimeout(() => {
            if (!isSpeaking && !isListening) {
              console.log('Retrying speech recognition...');
              startListening();
            }
          }, 1000);
        }
      };

      recognitionRef.current.onend = () => {
        if (!isSpeaking) {
          console.log('Speech recognition ended, restarting...');
          try {
            recognitionRef.current.start();
            setIsListening(true);
          } catch (err) {
            console.error('Failed to restart recognition:', err);
            setIsListening(false);
            toast.error('Couldn’t restart listening. Please refresh the page.', { autoClose: 3000 });
          }
        } else {
          setIsListening(false);
        }
      };

      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start recognition:', err);
        setError('Couldn’t start listening. Try refreshing the page!');
        toast.error('Couldn’t start listening. Try refreshing the page!', { autoClose: 3000 });
      }
    } else {
      setError('Speech recognition isn’t supported in this browser. Try typing instead!');
      toast.error('Speech recognition isn’t supported in this browser.', { autoClose: 3000 });
    }
  };

  const speakAnswer = (text) => {
    if ('speechSynthesis' in window) {
      utteranceRef.current = new SpeechSynthesisUtterance(text);
      utteranceRef.current.rate = 1.1;
      utteranceRef.current.pitch = 1;
      utteranceRef.current.onstart = () => {
        setIsSpeaking(true);
        if (recognitionRef.current) recognitionRef.current.stop();
      };
      utteranceRef.current.onend = () => {
        setIsSpeaking(false);
        if (!isListening && recognitionRef.current) {
          console.log('Resuming listening after speaking...');
          try {
            recognitionRef.current.start();
            setIsListening(true);
          } catch (err) {
            console.error('Failed to resume recognition:', err);
            setIsListening(false);
            toast.error('Couldn’t resume listening. Please refresh the page.', { autoClose: 3000 });
          }
        }
      };
      window.speechSynthesis.speak(utteranceRef.current);
    } else {
      setError('Text-to-speech isn’t supported in this browser.');
      toast.error('Text-to-speech isn’t supported in this browser.', { autoClose: 3000 });
    }
  };

  const handleSubmit = async (e, submittedQuestion = question) => {
    e.preventDefault();
    if (!submittedQuestion) {
      setError('Please say or type a question!');
      toast.error('Please say or type a question!', { autoClose: 3000 });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to chat with me!');
        toast.error('Please log in to chat with me!', { autoClose: 3000 });
        navigate('/login');
        return;
      }
      const payload = { question: submittedQuestion.trim() };
      console.log('Sending payload:', payload);
      const response = await askFitnessQuestion(payload);
      const friendlyAnswer = response.answer.startsWith('Hey') || response.answer.startsWith('Awesome')
        ? response.answer
        : `Hey, great question! ${response.answer}`;
      setAnswer(friendlyAnswer);
      speakAnswer(friendlyAnswer);
      toast.success('Got an answer for you!', { autoClose: 3000 });
    } catch (err) {
      console.error('Answer question error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      const errorMsg = err.response?.data?.msg || 'Couldn’t get an answer. Try again!';
      const errorAnswer = err.response?.data?.answer || errorMsg;
      setError(errorMsg);
      setAnswer(errorAnswer);
      speakAnswer(errorAnswer);
      toast.error(errorMsg, { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startListening(); // Start listening on component mount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
      setIsListening(false);
      setIsSpeaking(false);
      console.log('Cleaned up speech recognition and synthesis');
    };
  }, []);

  return (
    <>
      <Navbartwo />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white flex flex-col items-center pt-20">
        <h1 className="text-4xl font-extrabold text-teal-400 mb-6">Your Fitness Buddy</h1>
        <p className="text-gray-300 mb-4">Ask me anything about fitness, and I’ll respond like a friend!</p>
        <div className="flex items-center mb-4">
          <div className={`w-4 h-4 rounded-full mr-2 ${isListening ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <p className="text-gray-300">{isListening ? 'Listening...' : 'Not listening'}</p>
        </div>
        {loading && <p className="text-gray-300">Thinking...</p>}
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <div className="w-full max-w-md">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your fitness question (e.g., 'What are good exercises for weight gain with a dumbbell?')"
            className="p-2 border border-gray-700 rounded bg-gray-900 text-white w-full h-24 mb-4"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !question}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 disabled:opacity-50"
          >
            Ask
          </button>
        </div>
        {answer && (
          <div className="mt-6 p-4 bg-gray-800/40 backdrop-blur-lg rounded-lg shadow-lg w-full max-w-md">
            <p className="text-xl font-semibold text-teal-400 mb-2">My Answer:</p>
            <p className="text-gray-300">{answer}</p>
            <button
              onClick={() => speakAnswer(answer)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
              disabled={isSpeaking}
            >
              Read Aloud
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default VoiceBot;