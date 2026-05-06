# Chatbot Responses Configuration

This file contains all the canned responses for the chatbot. Responses are organized into two categories:

## 📝 Static Responses
Simple text responses for common questions:

```json
"responses": {
  "hi": "I'm fine",
  "hello": "I'm fine",
  "how are you": "I'm fine",
  "what is your name": "I'm an AI assistant chatbot",
  "thank you": "You're welcome!",
  "bye": "Goodbye! Have a great day!"
}
```

## ⚡ Dynamic Responses
Responses that require code execution:

```json
"dynamic_responses": {
  "what time is it": "current_time",
  "current time": "current_time"
}
```

## 🏫 Shivbhumi Shikshan Mandal Responses
Comprehensive Q&A about Shivbhumi Educational Institution:

- **Basic Info**: What is Shivbhumi, history, founder
- **Academics**: Programs, courses, board affiliations
- **Facilities**: Infrastructure, labs, transport, sports
- **Contact**: Address, phone, email, website
- **Values**: Indian culture, holistic development
- **Why Choose**: Academic excellence, modern facilities
- **Common Misspellings**: shivbhumy, shikshen, mondal, nigadi, poona
- **Admission & Fees**: Contact information for inquiries

## 🔤 Spelling Corrections & Variations
Added responses for common misspellings:
- `shivbhumy` → Shivbhumi
- `shikshen` → Shikshan
- `mondal`/`mandel` → Mandal
- `nigadi` → Nigdi
- `poona` → Pune (old name)
- Contact variations: "phone number", "contact details", "how to contact"

## 🔧 How to Add New Responses

### For Static Responses:
1. Add a new key-value pair to the `responses` object
2. Key should be the user's message (lowercase)
3. Value should be the bot's response

### For Dynamic Responses:
1. Add a new key-value pair to the `dynamic_responses` object
2. Key should be the user's message (lowercase)
3. Value should be a code identifier (like "current_time")
4. Update the server.js logic to handle the new dynamic response

### For Partial Matches:
- The system automatically checks for partial matches on longer phrases
- Words like "weather" will match in "how is the weather today"

## 📋 Current Response Categories:
- **Greetings**: hi, hello, hey, how are you
- **Weather**: how is weather today, weather
- **Identity**: what is your name, who are you
- **Courtesy**: thank you, thanks
- **Time**: what time is it, current time
- **Help**: help, how can you help
- **Farewell**: bye, goodbye
- **Shivbhumi Info**: Complete educational institution Q&A

## 🎯 Shivbhumi Questions Covered:
- Establishment and history
- Founder and awards
- Academic programs and courses
- Facilities and infrastructure
- Contact information
- Values and culture
- Why choose Shivbhumi
- Student life and activities