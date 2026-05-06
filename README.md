# Toolkit Hub

Toolkit Hub is a versatile, mobile-optimized web application designed to streamline your daily workflow. It features two powerful utilities: an **Authenticator Hub** for managing credentials and generating live TOTP (2FA) codes, and a **Data Formatter** for easily converting tabular data into readable text blocks.

## 🌟 Features

### 🛡️ Authenticator Hub
A secure, client-side tool to manage your login credentials and two-factor authentication codes in one place.
- **Bulk Account Parsing**: Paste multiple accounts in a simple, structured format (Email, Password, 2FA Secret), and the app automatically parses them into individual cards.
- **Live 2FA Generation**: Uses your TOTP secret key to generate live, real-time 2FA codes directly in your browser. No server communication is required for code generation.
- **Real-Time Countdown**: Visual progress bar and countdown timer showing when the current 2FA code will expire and refresh.
- **One-Click Copy**: Instantly copy your email, password, or the live 2FA code to your clipboard with a single tap.
- **Account Management**: View your accounts numbered sequentially and remove individual accounts from the list as needed.
- **Mobile First**: Large touch targets and a clean UI, perfect for copying details on your phone.

### 📄 Data Formatter
A handy utility to restructure tabular data copied from spreadsheet software like Microsoft Excel or Google Sheets.
- **Tab-to-Newline Conversion**: Paste tab-separated spreadsheet rows, and the formatter will separate each column value into its own line.
- **One-Click Copy**: Easily copy the newly formatted vertical text block to your clipboard.
- **Clear & Read**: Simple input and output text areas for fast data manipulation.

## 🚀 Getting Started

Since the Toolkit Hub is a client-side web application, you can run it entirely in your browser without any complex server setup.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/toolkit-hub.git
   cd toolkit-hub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🛠️ Built With

- **React** - UI framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **otpauth** - Client-side TOTP generation

## 🔒 Privacy & Security

**Toolkit Hub operates entirely in your browser.**
- Your sensitive data (passwords, 2FA secrets) is *never* sent to any server.
- The TOTP codes are generated locally on your device.
- All stored state is cleared when you refresh the page or hit "Clear All".

*Disclaimer: Be cautious when pasting sensitive credentials on shared or public devices. Make sure to clear your session when finished.*

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
