import { useState } from "react";
import { router, Link } from "expo-router";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { api } from "../lib/api";
import { setAuth } from "../lib/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      const payload = {
        email: (email || "").trim().toLowerCase(),
        password: (password || "").trim(),
      };

      const { data } = await api.post("/auth/login", payload);

      await setAuth(data.token, data.user);

      router.replace("/home");
    } catch (e: any) {
      const msg = e?.response?.data?.error?.message || "Login fehlgeschlagen";
      Alert.alert("Login", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700", textAlign: "center" }}>
        Simple ToDo
      </Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
      />

      <TextInput
        placeholder="Passwort"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
      />

      <Pressable
        onPress={handleLogin}
        disabled={loading}
        style={{
          padding: 12,
          borderRadius: 10,
          alignItems: "center",
          borderWidth: 1,
          opacity: loading ? 0.6 : 1,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          {loading ? "Einloggen..." : "Login"}
        </Text>
      </Pressable>

      <Link href="/register" style={{ textAlign: "center", color: "blue" }}>
        Noch keinen Account? Registrieren
      </Link>
    </View>
  );
}
