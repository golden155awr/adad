import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, Sparkles, X } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const platformKnowledge = {
  'how do i issue a credential': 'To issue a credential, you need to:\n1. Be an authorized institution (request authorization from the admin)\n2. Go to the Institution Dashboard\n3. Fill in student details: name, wallet address, degree, institution name, and graduation year\n4. Upload the credential document (PDF, PNG, or JPG)\n5. Click "Issue Credential" and approve the transaction in MetaMask\n\nThe credential will be minted as a soulbound token on the Sepolia blockchain and sent to the student\'s wallet.',

  'how do students verify their credentials': 'Students can verify and share their credentials in several ways:\n1. View credentials in their Student Wallet\n2. Generate a QR code for instant verification\n3. Create time-limited share links with expiration dates\n4. Share credentials with specific universities or employers\n\nVerifiers can scan the QR code or use the share link to instantly verify the credential on the blockchain without contacting the institution.',

  'what is a soulbound token': 'A Soulbound Token (SBT) is a non-transferable NFT that represents achievements or credentials. Key features:\n\n- Cannot be transferred or sold\n- Permanently bound to the recipient\'s wallet\n- Proves ownership and authenticity\n- Can be revoked by the issuer if needed\n- Stored on blockchain for permanent verification\n\nThis makes them perfect for academic credentials since degrees should not be transferable between people.',

  'how do i revoke a credential': 'To revoke a credential:\n1. Go to Institution Dashboard\n2. Find the credential by token ID or student address\n3. Click "Revoke" button\n4. Confirm the revocation\n5. Approve the blockchain transaction in MetaMask\n\nOnce revoked, the credential will show as "REVOKED" in all verifications, and all active share links will be invalidated. This is irreversible.',

  'what is the verification process': 'The verification process is instant and decentralized:\n1. Verifier receives QR code or share link from student\n2. Scans/clicks to access verification portal\n3. System queries blockchain for credential data\n4. Displays: institution, degree, issue date, and revocation status\n5. Shows IPFS document link for proof\n6. Provides blockchain transaction proof\n\nNo need to contact the institution - everything is verified on-chain in seconds.',

  'how do i connect my wallet': 'To connect your MetaMask wallet:\n1. Install MetaMask browser extension if you haven\'t\n2. Create or import a wallet\n3. Click "Connect Wallet" button on the platform\n4. Approve the connection in MetaMask popup\n5. System will automatically switch to Sepolia Testnet\n\nYou need Sepolia ETH for transactions. Get free testnet ETH from Sepolia faucets.',

  'what are pricing plans': 'Pricing is based on user type:\n\nInstitutions:\n- Basic: $99.99/month (100 credentials)\n- Pro: $299.99/month (500 credentials)\n- Enterprise: $999.99/month (unlimited)\n\nEmployers:\n- Basic: $49.99/month (50 verifications)\n- Pro: $149.99/month (200 verifications)\n\nStudents: FREE with unlimited access\n\nUse promo code TRINETRA for free access during the trial period.',

  'how does blockchain security work': 'Our platform uses multiple layers of blockchain security:\n\n1. Ethereum Sepolia Testnet - decentralized blockchain\n2. Soulbound tokens - non-transferable credentials\n3. Smart contract access control - only authorized institutions can issue\n4. IPFS storage - decentralized document storage\n5. Cryptographic proofs - tamper-proof verification\n6. Audit trails - all actions logged on-chain\n\nOnce issued, credentials cannot be forged, altered, or deleted.',

  'what is ipfs': 'IPFS (InterPlanetary File System) is a decentralized file storage protocol:\n\n- Documents stored across distributed network\n- Content-addressable (files referenced by their hash)\n- Permanently accessible and immutable\n- No single point of failure\n- Integrated with blockchain for verification\n\nWe use IPFS via Pinata to store credential documents (PDFs, certificates) while keeping the blockchain lightweight.',

  'how do i get testnet eth': 'To get Sepolia testnet ETH:\n1. Copy your wallet address from MetaMask\n2. Visit a Sepolia faucet:\n   - https://sepoliafaucet.com\n   - https://faucet.sepolia.dev\n3. Paste your wallet address\n4. Request testnet ETH\n5. Wait a few minutes for confirmation\n\nTestnet ETH is free and only used for testing. It has no real-world value.'
};

const quickSuggestions = [
  'How do I issue a credential?',
  'How do students verify credentials?',
  'What is a soulbound token?',
  'How do I revoke a credential?',
  'What are the pricing plans?',
  'How does blockchain security work?'
];

export default function AIAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant for the Academic Credentials Platform. I can help you with questions about credential issuance, verification, blockchain technology, and platform features. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestMatch = (query: string): string => {
    const normalizedQuery = query.toLowerCase().trim();

    for (const [key, answer] of Object.entries(platformKnowledge)) {
      if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
        return answer;
      }
    }

    if (normalizedQuery.includes('credential') && normalizedQuery.includes('issue')) {
      return platformKnowledge['how do i issue a credential'];
    }
    if (normalizedQuery.includes('verify') || normalizedQuery.includes('verification')) {
      return platformKnowledge['how do students verify their credentials'];
    }
    if (normalizedQuery.includes('soulbound') || normalizedQuery.includes('sbt')) {
      return platformKnowledge['what is a soulbound token'];
    }
    if (normalizedQuery.includes('revoke') || normalizedQuery.includes('cancel')) {
      return platformKnowledge['how do i revoke a credential'];
    }
    if (normalizedQuery.includes('wallet') || normalizedQuery.includes('metamask')) {
      return platformKnowledge['how do i connect my wallet'];
    }
    if (normalizedQuery.includes('price') || normalizedQuery.includes('cost') || normalizedQuery.includes('plan')) {
      return platformKnowledge['what are pricing plans'];
    }
    if (normalizedQuery.includes('security') || normalizedQuery.includes('safe')) {
      return platformKnowledge['how does blockchain security work'];
    }
    if (normalizedQuery.includes('ipfs')) {
      return platformKnowledge['what is ipfs'];
    }
    if (normalizedQuery.includes('testnet') || normalizedQuery.includes('sepolia') || normalizedQuery.includes('eth')) {
      return platformKnowledge['how do i get testnet eth'];
    }

    return 'I\'m not sure about that specific question. I can help you with:\n\n- Issuing credentials\n- Verifying credentials\n- Understanding soulbound tokens\n- Revoking credentials\n- Wallet connection\n- Pricing plans\n- Blockchain security\n- IPFS and document storage\n- Getting testnet ETH\n\nPlease ask me about any of these topics!';
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const response = findBestMatch(input);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Chat cleared! How can I help you with the Academic Credentials Platform?',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-2xl border border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Assistant</h3>
            <p className="text-xs text-gray-400">Ask me anything about the platform</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          title="Clear chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-semibold text-green-400">AI Assistant</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              <p className="text-xs mt-2 opacity-60">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
                <span className="text-sm text-gray-300">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-4 pb-4">
          <p className="text-xs text-gray-400 mb-2">Quick suggestions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickSuggestions.slice(0, 4).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-left text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 p-2 rounded-lg transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 bg-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          AI responses are based on platform documentation
        </p>
      </div>
    </div>
  );
}
 