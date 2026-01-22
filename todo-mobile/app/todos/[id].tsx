import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
  Switch,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { api } from "../../lib/api";
import { getToken, clearAuth } from "../../lib/auth";
import { SafeAreaView } from "react-native-safe-area-context";


type Task = {
  _id: string;
  title: string;
  completed: boolean;
  dueDateTime?: string | null;
};

type Project = {
  _id: string;
  name: string;
  tasks?: Task[];
};

export default function TodosScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const projectId = id;

  const [projectName, setProjectName] = useState("");
  const [todos, setTodos] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [newTodoText, setNewTodoText] = useState("");
  const [creating, setCreating] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) {
        router.replace("/login");
        return;
      }
      if (!projectId) {
        router.replace("/home");
        return;
      }
      await loadProject();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function loadProject() {
    try {
      setLoading(true);
      const { data } = await api.get("/projects");
      const project: Project | undefined = (data.projects || []).find(
        (p: Project) => p._id === projectId
      );

      if (!project) {
        Alert.alert("Hinweis", "Projekt nicht gefunden.");
        router.replace("/home");
        return;
      }

      setProjectName(project.name);
      setTodos(project.tasks || []);
    } catch (e: any) {
      if (e?.response?.status === 401) {
        await clearAuth();
        router.replace("/login");
        return;
      }
      Alert.alert("Fehler", "Projekt konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTodo() {
    const title = newTodoText.trim();
    if (!title) {
      Alert.alert("Hinweis", "Bitte Aufgabe eingeben.");
      return;
    }

    try {
      setCreating(true);
      const { data } = await api.post(`/projects/${projectId}/tasks`, {
        title,
        dueDateTime: null, // optional später mit DatePicker
      });
      setTodos(data.project.tasks || []);
      setNewTodoText("");
    } catch {
      Alert.alert("Fehler", "Aufgabe konnte nicht hinzugefügt werden.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteTodo(taskId: string) {
    Alert.alert("Löschen?", "Aufgabe wirklich löschen?", [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Löschen",
        style: "destructive",
        onPress: async () => {
          try {
            const { data } = await api.delete(
              `/projects/${projectId}/tasks/${taskId}`
            );
            setTodos(data.project.tasks || []);
          } catch {
            Alert.alert("Fehler", "Aufgabe konnte nicht gelöscht werden.");
          }
        },
      },
    ]);
  }

  async function toggleTask(task: Task) {
    try {
      const { data } = await api.patch(
        `/projects/${projectId}/tasks/${task._id}`,
        { completed: !task.completed }
      );
      setTodos(data.project.tasks || []);
    } catch {
      Alert.alert("Fehler", "Status konnte nicht geändert werden.");
    }
  }

  const visibleTodos = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return todos;
    return todos.filter((t) => (t.title || "").toLowerCase().includes(term));
  }, [todos, searchTerm]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Lade ToDos...</Text>
      </View>
    );
  }

  return (
  <SafeAreaView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 12 }}>

      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Pressable
          onPress={() => router.replace("/home")}
          style={{ paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 10 }}
        >
          <Text style={{ fontWeight: "700" }}>← Home</Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "800" }} numberOfLines={1}>
            {projectName}
          </Text>
          <Text style={{ opacity: 0.7 }}>{todos.length} Aufgaben</Text>
        </View>
      </View>

      {/* Suche */}
      <TextInput
        placeholder="Aufgabe suchen..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      />

      {/* Add Task */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          placeholder="Neue Aufgabe..."
          value={newTodoText}
          onChangeText={setNewTodoText}
          style={{ flex: 1, borderWidth: 1, borderRadius: 12, padding: 12 }}
        />

        <Pressable
          onPress={handleAddTodo}
          disabled={creating}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderWidth: 1,
            borderRadius: 12,
            opacity: creating ? 0.6 : 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontWeight: "800" }}>{creating ? "..." : "+"}</Text>
        </Pressable>
      </View>

      {/* Liste */}
      {visibleTodos.length === 0 ? (
        <Text>Keine Aufgaben gefunden.</Text>
      ) : (
        <FlatList
          data={visibleTodos}
          keyExtractor={(item) => item._id}
          onRefresh={loadProject}
          refreshing={loading}
          renderItem={({ item }) => (
            <View
              style={{
                borderWidth: 1,
                borderRadius: 14,
                padding: 12,
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    textDecorationLine: item.completed ? "line-through" : "none",
                    opacity: item.completed ? 0.6 : 1,
                  }}
                >
                  {item.title}
                </Text>
              </View>

              <Switch value={!!item.completed} onValueChange={() => toggleTask(item)} />

              <Pressable
                onPress={() => handleDeleteTodo(item._id)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 10,
                }}
              >
                <Text>Löschen</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
