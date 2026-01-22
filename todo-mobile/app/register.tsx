import { Link, router } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";
import { api } from "../lib/api";
import { setAuth } from "../lib/auth";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    const payload = {
      email: email.trim().toLowerCase(),
      password: password.trim(),
      name: name.trim() || undefined,
    };

    if (!payload.email || !payload.password) {
      Alert.alert("Fehler", "Bitte Email und Passwort eingeben.");
      return;
    }
    if (payload.password.length < 6) {
      Alert.alert("Fehler", "Passwort muss mindestens 6 Zeichen haben.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/auth/register", payload);

      // Token + User speichern (wie beim Login)
      await setAuth(data.token, data.user);

      // Nach erfolgreicher Registrierung direkt zur Home
      router.replace("/home");
    } catch (e: any) {
      const msg = e?.response?.data?.error?.message || "Registrierung fehlgeschlagen";
      Alert.alert("Fehler", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <View style={{ gap: 12 }}>
        <Text style={{ fontSize: 26, fontWeight: "800", textAlign: "center" }}>
          Registrierung
        </Text>

        <TextInput
          placeholder="Name (optional)"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
        />

        <TextInput
          placeholder="Passwort (min. 6 Zeichen)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
        />

        <Pressable
          onPress={handleRegister}
          disabled={loading}
          style={{
            borderRadius: 12,
            padding: 14,
            alignItems: "center",
            borderWidth: 1,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? <ActivityIndicator /> : <Text style={{ fontWeight: "900" }}>Registrieren</Text>}
        </Pressable>

        <Link href="/login" asChild>
          <Pressable style={{ padding: 8, alignItems: "center" }}>
            <Text style={{ color: "blue" }}>Schon einen Account? Login</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
