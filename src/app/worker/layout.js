"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function WorkerLayout({ children }) {
  const { user } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // تخطي الحماية لصفحات التسجيل وبصمة الوجه نفسها لمنع التكرار (Infinite Loop)
    if (pathname === "/worker/login" || pathname === "/worker/login/face-check") {
      setIsReady(true);
      return;
    }

    // ١. التحقق من وجود حساب عامل مسجل (مستمر عبر localStorage)
    if (!user || user.role !== "worker") {
      router.push("/worker/login");
      return;
    }

    // ٢. التحقق من بصمة الوجه للجلسة الحالية (تم إيقافها مؤقتاً للمعاينة)
    // const isFaceVerified = window.sessionStorage.getItem("masiyoon_face_verified");
    // if (!isFaceVerified) {
    //   router.push("/worker/login/face-check");
    //   return;
    // }

    setIsReady(true);
  }, [user, pathname, router]);

  if (!isReady) {
    return (
      <div style={{ minHeight: "100vh", background: "#020617", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
         جاري التحقق من الهوية الحيوية...
      </div>
    );
  }

  return (
    <div className="worker-app-wrapper" style={{ minHeight: "100vh", background: "#020617" }}>
        {children}
    </div>
  );
}
