"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, query, where, getDocs, addDoc, onSnapshot, orderBy } from "firebase/firestore";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 حفظ وتزامن المستخدم مع التخزين المحلي وقاعدة البيانات
  const setUser = async (userData) => {
    if (!userData) {
        localStorage.removeItem("masiyoon_user");
        setUserState(null);
        return;
    }

    setLoading(true);
    try {
        const userRef = doc(db, "masiyoon_prod_users", userData.phone);
        await setDoc(userRef, { ...userData, lastLogin: Date.now() }, { merge: true });
        
        localStorage.setItem("masiyoon_user", JSON.stringify(userData));
        setUserState(userData);
    } catch (e) {
        console.error("Auth Error:", e);
    } finally {
        setLoading(false);
    }
  };

  // 🔍 وظيفة البحث عن مستخدم برقم الجوال (الدخول التلقائي)
  const loginWithPhone = async (phone) => {
    setLoading(true);
    try {
        const userRef = doc(db, "masiyoon_prod_users", phone);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            const data = userSnap.data();
            localStorage.setItem("masiyoon_user", JSON.stringify(data));
            setUserState(data);
            return data;
        }
        return null;
    } catch (e) {
        return null;
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("masiyoon_user");
    if (saved) setUserState(JSON.parse(saved));
    
    const q = query(collection(db, "masiyoon_prod_tasks"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const addTask = async (taskData) => {
    await addDoc(collection(db, "masiyoon_prod_tasks"), { ...taskData, date: Date.now() });
  };

  const updateTask = async (taskId, updates) => {
    const taskRef = doc(db, "masiyoon_prod_tasks", taskId);
    await setDoc(taskRef, { ...updates, lastUpdated: Date.now() }, { merge: true });
  };

  // ملف الترجمات العربي
  const t = {
    allCategories: ["تكييف", "سباكة", "كهرباء", "نقاشة", "نجارة"],
    statusMap: { open: "قيد الانتظار", accepted: "تم القبول", completed: "مكتمل" }
  };

  return (
    <AppContext.Provider value={{ user, setUser, tasks, addTask, updateTask, loginWithPhone, loading, t }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
