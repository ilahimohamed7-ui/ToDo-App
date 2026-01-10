import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export async function setAuth(token: string, user: any) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getUser() {
  const u = await AsyncStorage.getItem(USER_KEY);
  return u ? JSON.parse(u) : null;
}

export async function clearAuth() {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
}
