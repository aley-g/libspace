import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAneNZ_WaoZjuVv-GvorgbXNtuBY17dv_g",
  authDomain: "libspace-2c739.firebaseapp.com",
  projectId: "libspace-2c739",
  storageBucket: "libspace-2c739.firebasestorage.app",
  messagingSenderId: "331665766870",
  appId: "1:331665766870:web:17af50cf64e0b50a2b4c77"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
