
# 🚀 Full Stack AI Finance Platform

A modern **AI-powered finance management platform** built with cutting-edge technologies to help users track, analyze, and optimize their financial data intelligently.

---

## 🖼️ Preview

![App Screenshot](https://github.com/user-attachments/assets/af164246-a05b-418f-a8cf-7828b82443ae)

---

## ✨ Features

- 💰 **Smart Expense Tracking** – Manage income & expenses seamlessly  
- 🤖 **AI Insights** – Get intelligent financial suggestions using AI  
- 🔐 **Authentication** – Secure login & onboarding with Clerk  
- 📊 **Data Visualization** – Clean and interactive UI for financial data  
- ⚡ **Real-time Workflows** – Background jobs powered by Inngest  
- 🛡️ **Security Layer** – Rate limiting & protection with ArcJet  
- 📧 **Email Integration** – Notifications using Resend  
- 🎨 **Modern UI** – Built with Tailwind + Shadcn UI  

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, Tailwind CSS, Shadcn UI  
- **Backend:** Next.js API Routes, Prisma ORM  
- **Database:** Supabase (PostgreSQL)  
- **Auth:** Clerk  
- **AI:** Gemini API  
- **Jobs & Workflows:** Inngest  
- **Security:** ArcJet  
- **Emails:** Resend  

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
````

Install dependencies:

```bash
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add:

```env
DATABASE_URL=
DIRECT_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

GEMINI_API_KEY=

RESEND_API_KEY=

ARCJET_KEY=
```

---

## 🚀 Running the App

```bash
npm run dev
```

App will be running on:

```
http://localhost:3000
```

---

## 📁 Project Structure

```
/app        → Next.js app router
/components → Reusable UI components
/lib        → Utility functions & configs
/prisma     → Database schema
```

---

## 🔐 Important Notes

* Never commit your `.env` file
* Use `.env.local` for local development
* Add environment variables in Vercel before deployment

---

## 🌍 Deployment

You can easily deploy using:

* **Vercel** (Recommended)
* Supabase for database hosting

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a PR.

---

## ⭐ Support

If you like this project:

* ⭐ Star the repo
* 🐦 Share it on Twitter
* 🍴 Fork and build your own version

---

## 📬 Contact

Built with ❤️ by **Pranav Gawande**

```

