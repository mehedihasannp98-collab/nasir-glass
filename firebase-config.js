// =====================================================================
// NASIR GLASS — FIREBASE CONFIG
// এই ফাইলে আপনার নিজের Firebase Project-এর Config বসাতে হবে।
// কোথায় পাবেন: Firebase Console → Project Settings → General →
// "Your apps" → Web app (</>) → SDK setup and configuration
// =====================================================================

// ধাপ ১: নিচের object-টি আপনার নিজের মান দিয়ে পরিবর্তন করুন
const firebaseConfig = {
  apiKey: "AIzaSyCsl34I27KYxF1Nz9BT8eJflhD_FGx1nHs",
  authDomain: "nasir-glass.firebaseapp.com",
  projectId: "nasir-glass",
  storageBucket: "nasir-glass.firebasestorage.app",
  messagingSenderId: "337995451694",
  appId: "1:337995451694:web:15ee93706c8917ed2f7ebf"
};

// ধাপ ২: Firebase App Initialize (Compat SDK ব্যবহার করা হয়েছে —
// এতে কোনো npm/build tool ছাড়াই সরাসরি Browser-এ কাজ করে)
firebase.initializeApp(firebaseConfig);

// সব Page থেকে ব্যবহারের জন্য গ্লোবাল রেফারেন্স
const auth = firebase.auth();
const db = firebase.firestore();

// Firestore Offline Persistence চালু — Internet না থাকলেও
// আগের Load করা Data দেখা যাবে এবং Local-এ Save হয়ে পরে Sync হবে।
db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
  console.warn("Offline persistence not enabled:", err.code);
});
