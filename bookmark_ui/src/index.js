import React, { StrictMode} from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut} from "@clerk/clerk-react";
import App from "./components/App";

// Import your Publishable Key
const PUBLISHABLE_KEY =process.env.REACT_APP_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/" appearance={{
    layout: {
      logoPlacement: "none", // Hide Clerk's default logo
      logoImageUrl: "/logo.png", // Optional: Add your custom logo
      socialButtonsPlacement: "bottom"
    },
    variables: {
      colorPrimary: "#007bff" // Customize primary color if needed
    },
    elements: {
      headerTitle: "Sign in to Bookmark Manager" // Change the title
    }
  }}>
      {/* Check if user is signed in */}
      <SignedIn>
        {/* Show the app only when the user is signed in */}
        <App />
      </SignedIn>

      <SignedOut>
        {/* Redirect users to sign in or sign up page if not signed in */}
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  </StrictMode>
);
