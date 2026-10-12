import { useHuntColors } from '@/theme/colors';
import { RefreshControl } from 'react-native';

type RefreshableQuery = {
  isPending: boolean;
  isRefetching: boolean;
  refetch: () => Promise<unknown>;
};

export function useListRefresh(queries: RefreshableQuery[]) {
  const colors = useHuntColors();
  const refreshing = queries.some((query) => query.isRefetching && !query.isPending);

  return (
    <RefreshControl
      refreshing={refreshing}
      tintColor={colors.accent}
      colors={[colors.accent]}
      progressBackgroundColor={colors.card}
      onRefresh={() => {
        void Promise.all(queries.map((query) => query.refetch()));
      }}
    />
  );
}
