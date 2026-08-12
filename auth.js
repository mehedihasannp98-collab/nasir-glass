// NASIR GLASS — AUTH LOGIC (index.html এর সাথে সংযুক্ত)
// ⚠️ লগইন সিস্টেম বন্ধ (Disabled) — অ্যাপ এখন সরাসরি খোলা যাবে, কোনো Login লাগবে না।
// আবার চালু করতে চাইলে নিচের ব্লক থেকে DISABLE_LOGIN = false করে দিন।

const DISABLE_LOGIN = true;

if (DISABLE_LOGIN) {
  // Login পেজে ঢুকলেও সরাসরি Dashboard-এ পাঠিয়ে দাও
  if (
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/"
  ) {
    window.location.href = "dashboard.html";
  }
} else {
  // ইতিমধ্যে Login করা থাকলে সরাসরি Dashboard-এ পাঠিয়ে দাও
  auth.onAuthStateChanged((user) => {
    if (user && window.location.pathname.endsWith("index.html")) {
      window.location.href = "dashboard.html";
    } else if (user && window.location.pathname === "/") {
      window.location.href = "dashboard.html";
    }
  });

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const errBox = document.getElementById("login-error");
      const btn = document.getElementById("login-btn");
      errBox.textContent = "";
      btn.disabled = true;
      btn.textContent = "অপেক্ষা করুন...";

      try {
        await auth.signInWithEmailAndPassword(email, password);
        window.location.href = "dashboard.html";
      } catch (err) {
        errBox.textContent = mapAuthError(err.code) + " [" + err.code + "]";
        console.error("Firebase Auth Error:", err.code, err.message);
        btn.disabled = false;
        btn.textContent = "প্রবেশ করুন (Login)";
      }
    });
  }
}

function mapAuthError(code) {
  switch (code) {
    case "auth/invalid-email": return "সঠিক Email দিন।";
    case "auth/user-not-found": return "এই Email-এ কোনো একাউন্ট নেই।";
    case "auth/wrong-password": return "Password ভুল হয়েছে।";
    case "auth/invalid-credential": return "Email অথবা Password ভুল।";
    case "auth/too-many-requests": return "অনেকবার ভুল Try করা হয়েছে। কিছুক্ষণ পর আবার Try করুন।";
    default: return "Login ব্যর্থ হয়েছে। আবার Try করুন।";
  }
}

// লগআউট (dashboard/other pages থেকে ব্যবহারের জন্য) — বাটনে
// data-action="logout" দিলেই কাজ করবে। DISABLE_LOGIN = true থাকলে এটা কিছু করবে না।
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-action='logout']")) {
    if (DISABLE_LOGIN) return;
    auth.signOut().then(() => (window.location.href = "index.html"));
  }
});

// PWA Service Worker রেজিস্ট্রেশন
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch((err) => {
      console.warn("Service worker registration failed:", err);
    });
  });
}
