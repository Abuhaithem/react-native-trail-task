import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View, Image} from 'react-native';
import {InterestDTO} from '../../domain/models/InterestDTO';

interface Props {
  interest: InterestDTO;
  onPress: () => void;
  showPrefixAvatar?: boolean;
}

const InterestCard: React.FC<Props> = ({
  interest,
  onPress,
  showPrefixAvatar = false,
}) => {
  const avatar = interest.avatar;
  const initial = interest.name.charAt(0).toUpperCase();
  const color = interest.color || '#ccc';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {showPrefixAvatar && (
        <View style={styles.avatarWrapper}>
          {avatar ? (
            <Image source={{uri: avatar}} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatarFallback, {backgroundColor: color}]}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          )}
        </View>
      )}
      <Text style={styles.text}>{interest.name}</Text>
    </TouchableOpacity>
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
  text: {
    fontSize: 16,
    color: '#0277bd',
  },
  avatarWrapper: {
    marginRight: 12,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default InterestCard;
