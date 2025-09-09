import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../components/AppIcon';
import Image from '../components/AppImage';
import AIRecommendationService from '../utils/AIRecommendationService';

const AskCinemaxAI = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hi! I\'m CineMax AI. I can help you discover amazing movies based on what you\'ve watched, your mood, or specific concepts you\'re interested in. What would you like to explore today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiService] = useState(() => new AIRecommendationService());
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    {
      id: 1,
      text: "I have watched The Amazing Spider-Man and loved it",
      icon: "Heart",
      category: "Based on what I watched"
    },
    {
      id: 2,
      text: "Movies that have time travel concepts",
      icon: "Clock",
      category: "By concept"
    },
    {
      id: 3,
      text: "I'm in the mood for something dark and psychological",
      icon: "Brain",
      category: "By mood"
    },
    {
      id: 4,
      text: "Shows me movies like Christopher Nolan films",
      icon: "Film",
      category: "By director style"
    },
    {
      id: 5,
      text: "I want comedy movies that aren't too silly",
      icon: "Smile",
      category: "Specific genre"
    },
    {
      id: 6,
      text: "Movies with strong female protagonists",
      icon: "Users",
      category: "Character-driven"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText = null) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Process query with AI service
    setTimeout(() => {
      const result = aiService.processConversationalQuery(text);
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: result.text,
        timestamp: new Date(),
        movieRecommendations: result.movies.map(movie => ({
          id: movie.id,
          title: movie.title,
          year: movie.year,
          rating: movie.rating,
          genre: movie.genre,
          poster: movie.poster || `https://image.tmdb.org/t/p/w300/default.jpg`,
          reason: movie.recommendationReason || 'Based on your preferences'
        }))
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };


  const handlePromptClick = (prompt) => {
    handleSendMessage(prompt);
  };

  const MovieCard = ({ movie }) => (
    <div className="bg-card border rounded-lg p-4 hover:shadow-lg transition-all duration-200">
      <div className="flex space-x-4">
        <div className="flex-shrink-0">
          <Image
            src={movie.poster}
            alt={movie.title}
            className="w-16 h-24 object-cover rounded"
          />
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <h4 className="font-semibold text-foreground">{movie.title}</h4>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.genre}</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={12} className="text-yellow-500" />
                <span>{movie.rating}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{movie.reason}</p>
        </div>
      </div>
    </div>
  );

  const MessageBubble = ({ message }) => (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
        <div className={`flex items-center space-x-2 mb-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
          }`}>
            <Icon name={message.type === 'user' ? 'User' : 'Bot'} size={16} />
          </div>
          <span className="text-sm text-muted-foreground">
            {message.type === 'user' ? 'You' : 'CineMax AI'}
          </span>
        </div>
        
        <div className={`rounded-lg p-4 ${
          message.type === 'user' 
            ? 'bg-primary text-primary-foreground ml-10' 
            : 'bg-muted/50 text-foreground mr-10'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          
          {message.movieRecommendations && message.movieRecommendations.length > 0 && (
            <div className="mt-4 space-y-3">
              {message.movieRecommendations.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Ask CineMax AI - Intelligent Movie Recommendations</title>
        <meta name="description" content="Chat with CineMax AI to get personalized movie recommendations based on your preferences" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full">
              <Icon name="MessageSquare" size={32} className="text-primary" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Ask CineMax AI
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get personalized movie recommendations powered by artificial intelligence. 
            Tell me what you've watched, your mood, or any concept you're interested in!
          </p>
        </div>

        {/* Chat Interface */}
        <div className="bg-card border rounded-lg">
          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6" style={{ maxHeight: '500px' }}>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                    <Icon name="Bot" size={16} />
                  </div>
                  <div className="bg-muted/50 text-foreground rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="Loader2" size={16} className="animate-spin" />
                      <span className="text-sm">CineMax AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me about movies you've watched, genres you like, or concepts you're interested in..."
                className="flex-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputValue.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="Send" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Suggested Prompts */}
        {messages.length <= 1 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Try asking me:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => handlePromptClick(prompt.text)}
                  className="text-left p-4 bg-card border rounded-lg hover:bg-accent/5 hover:border-accent transition-all duration-200"
                  disabled={isLoading}
                >
                  <div className="flex items-start space-x-3">
                    <Icon name={prompt.icon} size={16} className="text-primary mt-1" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{prompt.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{prompt.category}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Features Info */}
        <div className="mt-8 text-center">
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Icon name="Sparkles" size={16} className="text-primary" />
              <span className="font-medium text-foreground">Powered by Advanced AI</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              CineMax AI analyzes movie plots, themes, directors, and user preferences to provide 
              highly personalized recommendations. The more specific you are, the better the suggestions!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskCinemaxAI;
