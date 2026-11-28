"use client";
import { useEffect, useRef, useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { normalizePrompt, promptId, memberError } from "./model.mjs";

// Same Firebase project + schema on both origins. Tokens stay in Firebase Auth.
export function useMember(config, loadFavorites = true) {
  const configured = Boolean(
    config.apiKey && config.authDomain && config.projectId && config.appId,
  );
  const [user, setUser] = useState(
    /** @type {import('firebase/auth').User | null} */ (null),
  );
  const [authReady, setAuthReady] = useState(false);
  const [favorites, setFavorites] = useState(/** @type {Array<any>} */ ([]));
  const [loadedUid, setLoadedUid] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const services = useRef(null);
  const currentUser = useRef(null);
  const pending = useRef(false);
  useEffect(() => {
    if (!configured) {
      setAuthReady(true);
      return;
    }
    let stopFavorites = () => {};
    let active = true;
    try {
      const app =
        getApps().find((app) => app.name === "codinglu-members") ||
        initializeApp(config, "codinglu-members");
      const auth = getAuth(app);
      const db = getFirestore(app);
      services.current = { auth, db };
      const stopAuth = onAuthStateChanged(
        auth,
        (nextUser) => {
          if (!active) return;
          stopFavorites();
          currentUser.current = nextUser;
          setUser(nextUser);
          setFavorites([]);
          setLoadedUid(null);
          setError("");
          setAuthReady(true);
          if (!nextUser || !loadFavorites) return;
          const uid = nextUser.uid;
          stopFavorites = onSnapshot(
            collection(db, "users", uid, "favorites"),
            (snapshot) => {
              if (!active || currentUser.current?.uid !== uid) return;
              setFavorites(
                snapshot.docs
                  .map((item) => ({ ...item.data(), id: item.id }))
                  .sort(
                    (a, b) =>
                      (b.createdAt?.toMillis?.() || 0) -
                      (a.createdAt?.toMillis?.() || 0),
                  ),
              );
              setLoadedUid(uid);
              setError("");
            },
            (failure) => {
              if (!active || currentUser.current?.uid !== uid) return;
              setFavorites([]);
              setLoadedUid(null);
              setError(memberError(failure));
            },
          );
        },
        (failure) => {
          setAuthReady(true);
          setError(memberError(failure));
        },
      );
      return () => {
        active = false;
        stopAuth();
        stopFavorites();
        services.current = null;
        currentUser.current = null;
      };
    } catch (failure) {
      setAuthReady(true);
      setError(memberError(failure));
    }
  }, [
    configured,
    loadFavorites,
    config.apiKey,
    config.authDomain,
    config.projectId,
    config.appId,
  ]);

  async function perform(operation) {
    if (pending.current) return false;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      await operation();
      return true;
    } catch (failure) {
      setError(memberError(failure));
      return false;
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  function session() {
    if (!services.current || !currentUser.current) throw new Error("請先登入");
    return { ...services.current, uid: currentUser.current.uid };
  }
  async function put(entry, uid, db) {
    const value = normalizePrompt(entry);
    const id = await promptId(value);
    if (currentUser.current?.uid !== uid) throw new Error("登入帳號已變更");
    const ref = doc(db, "users", uid, "favorites", id);
    await runTransaction(db, async (transaction) => {
      const existing = await transaction.get(ref);
      if (!existing.exists())
        transaction.set(ref, { ...value, createdAt: serverTimestamp() });
    });
  }
  return {
    user,
    configured,
    authReady,
    favorites,
    error,
    busy,
    cloudReady: Boolean(user && loadedUid === user.uid),
    login: () =>
      perform(async () => {
        if (!services.current) throw new Error("登入尚未啟用");
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        await signInWithPopup(services.current.auth, provider);
      }),
    logout: () =>
      perform(async () => {
        if (!services.current) return;
        await signOut(services.current.auth);
        currentUser.current = null;
        setUser(null);
        setFavorites([]);
        setLoadedUid(null);
      }),
    save: (entry) =>
      perform(async () => {
        const { uid, db } = session();
        await put(entry, uid, db);
      }),
    remove: (id) =>
      perform(async () => {
        const { uid, db } = session();
        if (!/^[a-f0-9]{64}$/.test(id)) throw new Error("收藏格式不正確");
        await deleteDoc(doc(db, "users", uid, "favorites", id));
      }),
    importPrompts: (entries) =>
      perform(async () => {
        const { uid, db } = session();
        // Sequential writes keep retries idempotent and stop if the account changes.
        for (const entry of entries) await put(entry, uid, db);
      }),
  };
}
