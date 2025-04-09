import React from 'react';
import {View, StyleSheet} from 'react-native';

const ShimmerPlaceholders = () => {
  return (
    <View style={styles.card}>
      <View style={styles.avatar} />
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#e1f5fe',
    borderRadius: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#cceeff',
    marginRight: 12,
  },
  line: {
    height: 16,
    width: 120,
    borderRadius: 8,
    backgroundColor: '#b3e5fc',
  },
});

export default ShimmerPlaceholders;
