# Next.js Full-Stack Development Starter

A comprehensive, production-ready full-stack development starter built with modern technologies and best practices. This starter includes complete authentication system with **3-tier role management** (User, Merchant, Admin), beautiful UI components, and everything you need to kickstart your next project.

## 🚀 Features

- ✅ **Complete Authentication System** - Registration, Login, Password Reset, Email Verification
- ✅ **3-Tier Role Management** - User, Merchant, and Admin roles with different permissions
- ✅ **Modern UI/UX** - Beautiful, responsive design with dark mode support
- ✅ **Type Safety** - Full TypeScript implementation
- ✅ **Database Integration** - Sequelize ORM with MySQL support
- ✅ **Email System** - Nodemailer integration for transactional emails
- ✅ **Production Ready** - Security best practices and optimizations included

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://reactjs.org/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Mantine UI](https://mantine.dev/)** - Modern React components library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[React Query](https://tanstack.com/query)** - Data fetching and state management
- **[React Icons](https://react-icons.github.io/react-icons/)** - Icon library
- **[Lucide React](https://lucide.dev/)** - Beautiful icons

### Backend & Database
- **[Sequelize](https://sequelize.org/)** - Promise-based ORM for Node.js
- **[MySQL2](https://github.com/sidorares/node-mysql2)** - MySQL client
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Password hashing
- **[JSON Web Tokens](https://jwt.io/)** - Authentication tokens
- **[Nodemailer](https://nodemailer.com/)** - Email sending

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting (via Tailwind)
- **[PostCSS](https://postcss.org/)** - CSS processing
- **[Autoprefixer](https://autoprefixer.github.io/)** - CSS vendor prefixing

### Additional Libraries
- **[Axios](https://axios-http.com/)** - HTTP client
- **[React Toastify](https://fkhadra.github.io/react-toastify/)** - Toast notifications
- **[SweetAlert2](https://sweetalert2.github.io/)** - Beautiful alerts
- **[React Date Range](https://github.com/hypeserver/react-date-range)** - Date picker
- **[React Select](https://react-select.com/)** - Select component
- **[Zod](https://zod.dev/)** - Schema validation
- **[Date-fns](https://date-fns.org/)** - Date utility library

## 📋 Role-Based Access Control

### 👤 User Role
- Profile management
- Basic dashboard access
- Standard features
- Account settings

### 🏪 Merchant Role
- Business dashboard
- Store management
- Transaction tracking
- Analytics access

### ⚙️ Admin Role
- Full system control
- User management
- System settings
- Advanced analytics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL database
- npm/yarn/pnpm/bun

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/stacksagar/nextjs-sequelize-starter.git
cd nextjs-sequelize-starter
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Email (Optional - for email verification)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"

# Next.js
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Set up the database**
```bash
npm run init-db
# or
npm run check-db
```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (pages)/           # Page groups
│   │   │   ├── (authenticated)/  # Protected routes
│   │   │   │   ├── admin/     # Admin dashboard
│   │   │   │   ├── merchant/  # Merchant dashboard  
│   │   │   │   └── u/         # User dashboard
│   │   │   └── (public-pages)/ # Public routes
│   │   │       └── auth/      # Authentication pages
│   │   └── api/               # API routes
│   ├── components/            # Reusable components
│   │   ├── common/           # Common UI components
│   │   ├── forms/            # Form components
│   │   ├── header/           # Header component
│   │   ├── footer/           # Footer component
│   │   └── layouts/          # Layout components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── models/               # Sequelize models
│   ├── server/               # Server actions
│   ├── store/                # Global state management
│   └── utils/                # Helper utilities
├── public/                   # Static assets
└── docs/                    # Documentation
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run check-db     # Check database connection
npm run init-db      # Initialize database
npm run validate     # Validate environment variables
```

## 🎨 UI Features

- **Responsive Design** - Works on all devices
- **Dark Mode Support** - Toggle between light and dark themes
- **Modern Components** - Built with Mantine UI and Tailwind CSS
- **Smooth Animations** - Framer Motion integration
- **Toast Notifications** - User feedback system
- **Form Validation** - Zod schema validation

## 🔐 Security Features

- **Password Hashing** - bcryptjs implementation
- **JWT Authentication** - Secure token-based auth
- **Email Verification** - Account verification system
- **Role-based Access** - Permission-based routing
- **Input Validation** - Zod schema validation
- **SQL Injection Protection** - Sequelize ORM safety

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [Mantine](https://mantine.dev/) - React components library
- [Sequelize](https://sequelize.org/docs/v6/) - ORM documentation
- [TypeScript](https://www.typescriptlang.org/docs/) - TypeScript handbook

## 🚀 Deployment

### Vercel (Recommended)
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy!

### Other Platforms
- **Railway** - Easy database and app deployment
- **PlanetScale** - MySQL database hosting
- **Netlify** - Static site hosting
- **DigitalOcean** - VPS deployment

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you have any questions or need help, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue on GitHub

---

**Built with ❤️ using Next.js, TypeScript, Tailwind CSS, Sequelize, and Mantine UI**
