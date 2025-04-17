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
import {Interest} from '../domain/entities/Interest';
import {GetSearchInterests} from '../domain/usecases/GetSearchInterests';
import {InterestRemoteDataSource} from '../data/datasource/searchDataSource';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types';
import styles from './styles/InterestSearchStyle.styles';
import InterestCard from './components/InterestCard';
import ShimmerPlaceholders from './components/ShimmerPlaceholders';
import {InterestRepositoryImpl} from '../data/repositories/InterestRepositoryImpl';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const cache = new Map<string, Interest[]>();

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
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const fadeAnim = useState(new Animated.Value(0))[0];

  const getSearchInterests = useMemo(() => {
    const remoteDataSource = new InterestRemoteDataSource();
    const repository = new InterestRepositoryImpl(remoteDataSource);
    return new GetSearchInterests(repository);
  }, []);

  const filteredInterests = useMemo(() => {
    return interests.filter(interest =>
      interest.name.toLowerCase().startsWith(query.toLowerCase()),
    );
  }, [query, interests]);

  const fetchInterests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (cache.has(query)) {
        setInterests(cache.get(query)!);
        return;
      }

      const interestList = await getSearchInterests.fetch(query, 10);

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      cache.set(query, interestList);
      setInterests(interestList);

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
    ({item}: {item: Interest}) => (
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
              data={[...filteredInterests, ...Array(5).fill(undefined)]}
              renderItem={({item}) =>
                item ? (
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
          ) : filteredInterests.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No interests found</Text>
            </View>
          ) : (
            <FlatList
              data={filteredInterests}
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
