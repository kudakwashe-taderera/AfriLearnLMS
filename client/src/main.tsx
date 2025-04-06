import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set document title
document.title = "AfriLearn - Learning Management System";

// Force light mode by removing any dark class on the document
// and ensuring light mode is explicitly set
document.documentElement.classList.remove('dark');
document.documentElement.classList.add('light');

// Create and render the app
createRoot(document.getElementById("root")!).render(<App />);
