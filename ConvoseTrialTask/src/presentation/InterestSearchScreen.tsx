import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  UIManager,
  Platform,
  TextInput,
} from 'react-native';
import {InterestDTO} from '../domain/models/InterestDTO';
import {GetSearchInterests} from '../domain/usecases/GetSearchInterests';
import {InterestRemoteDataSource} from '../data/searchDataSource';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types';
import styles from './styles/InterestSearchStyle.styles';
import InterestCard from './components/InterestCard';

// Enable Layout Animation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const cache = new Map<string, InterestDTO[]>();

type InterestSearchScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'InterestSearch'
>;

interface InterestSearchScreenProps {
  navigation: InterestSearchScreenNavigationProp;
}

export const InterestSearchScreen: React.FC<InterestSearchScreenProps> = ({
  navigation,
}) => {
  const [interests, setInterests] = useState<InterestDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const fadeAnim = useState(new Animated.Value(0))[0];

  const getSearchInterests = useMemo(
    () => new GetSearchInterests(new InterestRemoteDataSource()),
    [],
  );

  const fetchInterests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (cache.has(query)) {
        setInterests(cache.get(query)!);
        setLoading(false);
        return;
      }

      const interestList = await getSearchInterests.fetch(query, 15);

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setInterests(interestList);
      cache.set(query, interestList);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch {
      setError('Failed to load interests');
    } finally {
      setLoading(false);
    }
  }, [getSearchInterests, fadeAnim, query]);

  useEffect(() => {
    fetchInterests();
  }, [fetchInterests]);

  const handleInterestPress = useCallback(
    (interestId: string) => {
      navigation.navigate('InterestDetail', {interestId});
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({item}: {item: InterestDTO}) => (
      <InterestCard
        interest={item}
        onPress={() => handleInterestPress(item.name)}
        showPrefixAvatar
      />
    ),
    [handleInterestPress],
  );

  const renderSeparator = () => <View style={styles.separator} />;

  const renderListHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>✨ Interests</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search interests..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={fetchInterests}
        returnKeyType="search"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>{renderListHeader()}</View>
      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Animated.View style={{opacity: fadeAnim}}>
            <TouchableOpacity
              onPress={fetchInterests}
              style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      ) : (
        <Animated.View style={{opacity: fadeAnim, flex: 1}}>
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#0099cc" />
              <Text style={styles.loadingText}>Loading interests...</Text>
            </View>
          ) : interests.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No interests found</Text>
            </View>
          ) : (
            <FlatList
              data={interests}
              renderItem={renderItem}
              keyExtractor={item => String(item.id)}
              contentContainerStyle={styles.listContent}
              ItemSeparatorComponent={renderSeparator}
              ListHeaderComponent={null}
              ListFooterComponent={<View style={styles.footer} />}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default InterestSearchScreen;
