// "Collection" tab — Pokédex-style grid of saved patterns. Tap a
// thumbnail to dive into the detail screen. v1 has no edit affordance
// here; the web editor handles recolor.

import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { listPatterns, type PatternResponse } from '../../src/api';
import PatternThumb from '../../src/PatternThumb';

export default function CollectionScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['patterns'],
    queryFn: () => listPatterns(),
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }
  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Couldn't reach the backend. Pull to retry.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data ?? []}
      keyExtractor={(p) => p.id}
      numColumns={2}
      contentContainerStyle={styles.grid}
      columnWrapperStyle={styles.row}
      onRefresh={refetch}
      refreshing={isRefetching}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            No patterns yet. Tap Hunt to capture your first one.
          </Text>
        </View>
      }
      renderItem={({ item }) => <Cell pattern={item} />}
    />
  );
}

function Cell({ pattern }: { pattern: PatternResponse }) {
  return (
    <Pressable
      style={styles.cell}
      onPress={() => router.push({ pathname: '/pattern/[id]', params: { id: pattern.id } })}
    >
      <PatternThumb
        pipeline={pattern.pipeline}
        layers={(pattern.layers ?? {}) as Record<string, string>}
        style={styles.thumb}
      />
      <Text style={styles.cellLabel} numberOfLines={1}>
        {pattern.name}
      </Text>
      {pattern.place_name ? (
        <Text style={styles.cellMeta} numberOfLines={1}>
          📍 {pattern.place_name}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { textAlign: 'center', opacity: 0.6, fontSize: 14 },
  errorText: { textAlign: 'center', color: '#a00', fontSize: 14 },
  grid: { padding: 8 },
  row: { gap: 8, marginBottom: 8 },
  cell: { flex: 1, gap: 4 },
  thumb: {
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cellLabel: { fontSize: 14, fontWeight: '600' },
  cellMeta: { fontSize: 11, opacity: 0.6 },
});
