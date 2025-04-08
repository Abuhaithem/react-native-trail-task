import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import InterestSearchScreen from './presentation/InterestSearchScreen'; // Ensure default export
import {RootStackParamList} from './types';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="InterestSearch"
        screenOptions={{headerShown: false}} // Hide header globally by default
      >
        <Stack.Screen name="InterestSearch" component={InterestSearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
