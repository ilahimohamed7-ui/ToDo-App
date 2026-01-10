import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { api } from "../lib/api";
import { clearAuth, getToken } from "../lib/auth";

type Task = {
  _id: string;
  title: string;
  completed: boolean;
  dueDateTime?: string | null;
};

type Project = {
  _id: string;
  name: string;
  createdAt?: string;
  tasks?: Task[];
};

export default function HomeScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // optional: Suche
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) {
        router.replace("/login");
        return;
      }
      await loadProjects();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      const { data } = await api.get("/projects");
      setProjects(data.projects || []);
    } catch (e: any) {
      if (e?.response?.status === 401) {
        await clearAuth();
        router.replace("/login");
        return;
      }
      Alert.alert("Fehler", "Projekte konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddProject() {
    const name = newProjectName.trim();
    if (!name) {
      Alert.alert("Hinweis", "Bitte Projektnamen eingeben.");
      return;
    }

    try {
      setCreating(true);
      const { data } = await api.post("/projects", { name });
      setProjects((prev) => [data.project, ...prev]);
      setNewProjectName("");
    } catch {
      Alert.alert("Fehler", "Projekt konnte nicht erstellt werden.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteProject(id: string) {
    Alert.alert("Projekt löschen?", "Willst du dieses Projekt wirklich löschen?", [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Löschen",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/projects/${id}`);
            setProjects((prev) => prev.filter((p) => p._id !== id));
          } catch {
            Alert.alert("Fehler", "Löschen fehlgeschlagen.");
          }
        },
      },
    ]);
  }

  function openProject(id: string) {
    router.push(`/todos/${id}`);
  }

  // optional: Suche (wie Web)
  const visibleProjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return projects;
    return projects.filter((p) => (p.name || "").toLowerCase().includes(term));
  }, [projects, searchTerm]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Lade Projekte...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>Simple ToDo</Text>

        <Pressable
          onPress={async () => {
            await clearAuth();
            router.replace("/login");
          }}
          style={{ paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 10 }}
        >
          <Text style={{ fontWeight: "600" }}>Logout</Text>
        </Pressable>
      </View>

      {/* Suche (optional) */}
      <TextInput
        placeholder="Projekt suchen..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      />

      {/* Projekt erstellen */}
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Neue ToDo-Liste:</Text>

        <TextInput
          placeholder="Name"
          value={newProjectName}
          onChangeText={setNewProjectName}
          style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
        />

        <Pressable
          onPress={handleAddProject}
          disabled={creating}
          style={{
            padding: 12,
            borderRadius: 12,
            alignItems: "center",
            borderWidth: 1,
            opacity: creating ? 0.6 : 1,
          }}
        >
          <Text style={{ fontWeight: "700" }}>{creating ? "Erstelle..." : "Erstellen"}</Text>
        </Pressable>
      </View>

      {/* Projektliste */}
      <View style={{ flex: 1, gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Deine Projekte:</Text>

        {visibleProjects.length === 0 ? (
          <Text>Keine Projekte gefunden.</Text>
        ) : (
          <FlatList
            data={visibleProjects}
            keyExtractor={(item) => item._id}
            onRefresh={loadProjects}
            refreshing={loading}
            renderItem={({ item }) => {
              const taskCount = item.tasks?.length || 0;

              return (
                <Pressable
                  onPress={() => openProject(item._id)}
                  style={{
                    borderWidth: 1,
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "700" }}>{item.name}</Text>
                  <Text style={{ marginTop: 4 }}>{taskCount} Aufgaben</Text>

                  <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                    <Pressable
                      onPress={() => handleDeleteProject(item._id)}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderWidth: 1,
                        borderRadius: 10,
                      }}
                    >
                      <Text>Löschen</Text>
                    </Pressable>

                    {/* Optional später: Teilen-Button */}
                  </View>
                </Pressable>
              );
            }}
          />
        )}
      </View>
    </View>
  );
}
