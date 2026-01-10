import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function Register() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Register</Text>

      <Link href="/login" asChild>
        <Pressable>
          <Text style={{ color: "blue" }}>Schon einen Account? Login</Text>
        </Pressable>
      </Link>
    </View>
  );
}
