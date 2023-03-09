import React from 'react';
import {ActivityIndicator, View} from 'react-native';

const LoadingScreen = props => {
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator color={props.indicatorColor} size={50} />
    </View>
  );
};

export default LoadingScreen;
