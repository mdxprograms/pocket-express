# Express and PocketHost Server

This project is a web application using **Express.js**, **PocketBase**, and **Pug** for rendering views. It includes user authentication, session management, and secure routing for a dynamic web experience.

## Requirements

### **Environment Variables**
The application uses the following environment variables:

- **`PORT`**: The port number where the server runs (default is `3000`).
- **`SESSION_SECRET`**: A secret key for managing session encryption. Use a strong, random string.
- **`POCKETHOST_BASE_URL`**: The base URL of your PocketBase instance.

Create a `.env` file in the root of your project with the following structure:

```plaintext
# Server Configuration
PORT=3000

# Session Configuration
SESSION_SECRET=your_super_secret_key

# PocketBase Configuration
POCKETHOST_BASE_URL=https://your-pocketbase-instance.com
```

Ensure `.env` is listed in your `.gitignore` file to avoid committing sensitive information.

---

### **Dependencies**

Install the following packages using `npm`:

```bash
npm install express pocketbase dotenv express-session compression express-rate-limit pug winston
```

For development tools:

```bash
npm install -D nodemon concurrently tailwindcss postcss autoprefixer purgecss browser-sync
```

---

### **Folder Structure**

The project follows this structure:

```
/project-root
├── /public                 # Static assets (CSS, JS, images)
│   ├── /css                # Tailwind CSS output
│   ├── /js                 # Client-side scripts
│   └── ...
├── /views                 
│   ├── /layouts            # Base layouts for Pug views
│   ├── /user               # User-specific views (e.g., login)
│   └── ...
├── /routes                 # API routes
├── /middleware             # Middleware logic
├── .env                    # Environment variables
├── server.js               # Main server file
└── README.md               # Documentation
```

---

### **Scripts**

Add the following scripts to your `package.json`:

```json
"scripts": {
  "serve": "node server.js",
  "build:css": "tailwindcss -i ./public/css/tailwind.css -o ./public/css/styles.css",
  "watch:css": "tailwindcss -i ./public/css/tailwind.css -o ./public/css/styles.css --watch",
  "purge:css": "purgecss --css ./public/css/styles.css --content './views/**/*.pug' './public/js/**/*.js' -o ./public/css/styles.css",
  "build:all": "npm run build:css && npm run purge:css",
  "start": "concurrently \"npm run watch:css\" \"nodemon server.js\" \"browser-sync start --proxy 'http://localhost:3000' --files 'public/**/*.{js,css,html}' 'views/**/*.pug'\"",
  "dev": "npm start"
}
```

### **Running the Project**

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server with live reload:
   ```bash
   npm start
   ```

3. For production, build the CSS and serve:
   ```bash
   npm run build:all
   npm run serve
   ```

---

### **Features**

- **Authentication**: Login and session management using PocketBase.
- **Secure Routes**: Middleware-protected endpoints for authorized users.
- **Dynamic Views**: Server-side rendering with Pug.
- **Static Assets**: Tailwind CSS for styling, served from the `public` directory.

---

### **Contributing**

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Submit a pull request.

---

### **License**

MIT License. See `LICENSE` file for details.

