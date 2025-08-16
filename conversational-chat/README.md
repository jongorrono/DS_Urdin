# Jongo - Conversational Bot Interface

A responsive, interactive conversational bot interface designed for Jon's portfolio and AI assistant. Built with modern web technologies and featuring a sleek, futuristic design.

## 🎨 Design Features

- **Dark Blue Theme**: Modern gradient background with light blue and white accents
- **Responsive Design**: Optimized for 1366px × 768px resolution with mobile support
- **Glassmorphism Effects**: Subtle transparency and backdrop blur for modern aesthetics
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Interactive Elements**: Hoverable cards, animated buttons, and smooth scrolling

## 🚀 Functionality

### Chat Interface
- **Real-time Chat**: Interactive conversation with AI assistant
- **Typing Indicators**: Visual feedback showing when the bot is "thinking"
- **Message History**: Persistent conversation tracking
- **Contextual Responses**: Smart replies based on user input keywords

### Interactive Cards
- **Case Study**: Explore Jon's project portfolio and development process
- **Company Fit**: Learn how Jon aligns with company culture and values
- **About Jon**: Get a quick overview of Jon's background and expertise

### User Experience
- **Keyboard Navigation**: Full keyboard support with Tab navigation
- **Responsive Input**: Auto-focus and visual feedback on input fields
- **Smooth Scrolling**: Automatic scroll to latest messages
- **Loading States**: Visual feedback during message processing

## 🛠️ Technical Stack

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript ES6+**: Class-based architecture with async/await
- **Font Awesome**: Icon library for UI elements
- **Responsive Design**: Mobile-first approach with breakpoints

## 📱 Responsive Breakpoints

- **Desktop**: 1366px and above (primary design)
- **Tablet**: 768px and below
- **Mobile**: 480px and below

## 🎯 Key Features

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast design
- Focus management

### Performance
- Optimized animations
- Efficient DOM manipulation
- Minimal reflows
- Smooth scrolling

### User Interface
- Intuitive chat flow
- Visual feedback on interactions
- Consistent design language
- Modern glassmorphism effects

## 🚀 Getting Started

1. **Clone or Download** the project files
2. **Open** `index.html` in a modern web browser
3. **Start Chatting** by typing in the main input field
4. **Explore Topics** by clicking on the action cards
5. **Customize** responses by modifying the `script.js` file

## 📁 File Structure

```
conversational-chat/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality and chat logic
└── README.md           # Project documentation
```

## 🎨 Customization

### Colors and Theme
Modify the CSS variables in `styles.css` to change the color scheme:

```css
body {
    background: linear-gradient(135deg, #0f1419 0%, #1a2332 100%);
}
```

### Chat Responses
Update the response logic in `script.js` by modifying the `responses` object:

```javascript
const responses = {
    'saas': "Your custom SaaS response here...",
    // Add more responses...
};
```

### Card Actions
Customize the action cards by modifying the `handleCardAction` function:

```javascript
function handleCardAction(action) {
    // Your custom logic here
}
```

## 🌟 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 📝 Usage Examples

### Basic Chat
1. Type a message in the main input field
2. Press Enter or click the send button
3. View the bot's contextual response

### Exploring Topics
1. Click on any of the three action cards
2. The bot will automatically ask relevant questions
3. Engage in a focused conversation about that topic

### Keyboard Navigation
- **Tab**: Navigate between interactive elements
- **Enter**: Send messages
- **Escape**: Clear input fields

## 🔧 Development

### Adding New Features
1. **New Chat Commands**: Extend the `getContextualResponse` method
2. **Additional Cards**: Add new card elements and event handlers
3. **Enhanced Animations**: Modify CSS animations and transitions
4. **API Integration**: Replace mock responses with real API calls

### Styling Modifications
1. **Color Scheme**: Update CSS custom properties
2. **Layout Changes**: Modify CSS Grid and Flexbox properties
3. **Animations**: Adjust keyframes and transition timing
4. **Responsive Design**: Update media query breakpoints

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the conversational bot interface.

## 📞 Support

For questions or support, please refer to the project documentation or create an issue in the repository.

---

**Built with ❤️ for modern web experiences**
