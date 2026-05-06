# Azure GenAI Chatbot 🤖

A modern chatbot built with Azure OpenAI, featuring comprehensive Q&A responses about Shivbhumi Shikshan Mandal educational institution.

## 🚀 Features

- **Azure OpenAI Integration** - Powered by GPT models via Azure
- **Shivbhumi Shikshan Mandal Q&A** - 40+ responses about the educational institution
- **Spelling-Tolerant** - Handles common misspellings
- **Dynamic Responses** - Current time, contextual answers
- **Modern UI** - Clean, responsive chat interface
- **Auto-Reload** - Development with hot reloading

## 🏫 Shivbhumi Information

This chatbot provides detailed information about:
- Academic programs (State Board, CBSE, Junior College)
- Facilities and infrastructure
- Contact details and locations
- History and founder information
- Values and culture
- Admission and fee inquiries

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **AI**: Azure OpenAI (GPT-3.5-turbo)
- **Frontend**: HTML, CSS, JavaScript
- **Development**: Nodemon, Browser-Sync

## 📋 Prerequisites

- Node.js (v16+)
- Azure OpenAI account with API access
- Git

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akshay5899/azure-genai-chatbot.git
   cd azure-genai-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy and edit .env file
   cp .env.example .env
   # Add your Azure OpenAI credentials
   ```

4. **Run in development mode**
   ```bash
   npm run dev:full  # Server + auto-refresh
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
azure-genai-chatbot/
├── server.js              # Express server with Azure OpenAI
├── responses.json         # Q&A database
├── RESPONSES_README.md    # Response documentation
├── public/
│   ├── index.html        # Chat interface
│   ├── script.js         # Frontend logic
│   └── style.css         # Styling
├── package.json          # Dependencies & scripts
└── .env                  # Environment variables
```

## 🔧 Configuration

### Environment Variables (.env)
```env
AZURE_OPENAI_API_KEY=your_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=gpt-35-turbo
PORT=3000
```

### Adding New Responses

Edit `responses.json` to add new Q&A pairs:
```json
"new question": "new answer"
```

## 🎯 Available Commands

```bash
npm start          # Production server
npm run dev        # Development server (auto-restart)
npm run dev:full   # Development + browser auto-refresh
npm run browser-sync  # Browser auto-refresh only
```

## 🤖 Chatbot Capabilities

### Canned Responses
- Greetings: "hi", "hello", "how are you"
- Weather: "how is weather today"
- Identity: "what is your name", "who are you"
- Time: "what time is it" (dynamic)
- Courtesy: "thank you", "bye"

### Shivbhumi Q&A
- **Basic Info**: History, founder, establishment (1957)
- **Academics**: Programs, courses, board affiliations
- **Facilities**: Labs, transport, sports, infrastructure
- **Contact**: Address, phone, email, website
- **Culture**: Values, holistic development, NCC/NSS

### Spelling Tolerance
Handles common misspellings like:
- `shivbhumy` → Shivbhumi
- `shikshen` → Shikshan
- `mondal` → Mandal
- `nigadi` → Nigdi

## 📞 Contact

**Shivbhumi Shikshan Mandal**
- Website: https://shivbhumism.com/
- Phone: 020-27660376, 9881483762
- Email: shivbhuminigdi@gmail.com
- Address: Sector 21, Yamunanagar, Nigdi, Pune – 411044

## 📄 License

This project is open source. Feel free to use and modify.

## 🙏 Acknowledgments

- Shivbhumi Shikshan Mandal for educational excellence
- Azure OpenAI for AI capabilities
- Open source community for tools and libraries

---

**Built with ❤️ for educational purposes**