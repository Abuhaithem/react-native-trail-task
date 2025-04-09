import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  FlatList,
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
import ShimmerPlaceholders from './components/ShimmerPlaceholders';

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
  const [allFetchedInterests, setAllFetchedInterests] = useState<InterestDTO[]>(
    [],
  );
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
        setAllFetchedInterests(cache.get(query)!);
        setLoading(false);
        return;
      }

      const interestList = await getSearchInterests.fetch(query, 100);

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      cache.set(query, interestList);
      setAllFetchedInterests(interestList);

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

  useEffect(() => {
    const filtered = allFetchedInterests.filter(interest =>
      interest.name.toLowerCase().startsWith(query.toLowerCase()),
    );
    setInterests(filtered);
  }, [query, allFetchedInterests]);

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

  const renderTitle = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>✨ Interests</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderTitle()}

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
        // eslint-disable-next-line react-native/no-inline-styles
        <Animated.View style={{opacity: fadeAnim, flex: 1}}>
          {loading ? (
            <FlatList
              data={[...interests.slice(0, 1), ...Array(5).fill(undefined)]}
              renderItem={({item, index}) =>
                index === 0 && item ? (
                  <InterestCard
                    interest={item}
                    onPress={() => handleInterestPress(item.name)}
                    showPrefixAvatar
                  />
                ) : (
                  <ShimmerPlaceholders />
                )
              }
              keyExtractor={(item, index) =>
                item ? String(item.id) : `shimmer-${index}`
              }
              inverted
              contentContainerStyle={styles.listContent}
              ItemSeparatorComponent={renderSeparator}
              keyboardShouldPersistTaps="handled"
              ListFooterComponent={<View style={styles.footer} />}
            />
          ) : interests.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No interests found</Text>
            </View>
          ) : (
            <FlatList
              data={interests}
              renderItem={renderItem}
              keyExtractor={item => String(item.id)}
              inverted
              contentContainerStyle={styles.listContent}
              ItemSeparatorComponent={renderSeparator}
              keyboardShouldPersistTaps="handled"
              ListFooterComponent={<View style={styles.footer} />}
            />
          )}
        </Animated.View>
      )}

      {/* Input field at the bottom */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search interests..."
          placeholderTextColor="#666"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
      </View>
    </SafeAreaView>
  );
};

export default InterestSearchScreen;
