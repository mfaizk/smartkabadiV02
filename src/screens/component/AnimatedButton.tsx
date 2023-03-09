import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import {animated, useSpring} from '@react-spring/native';

function AnimatedButton({currentTheme, buttonText}) {
  const loadingState = useSelector((state: RootState) => state.loading);
  const AnimatedView = animated(View);

  const animatedStyle = useSpring({
    from: {
      backgroundColor: currentTheme.primary,
      padding: 15,
      borderRadius: 25,
      marginTop: 30,
      minWidth: 350,
    },
    to: {
      backgroundColor: loadingState.loading
        ? currentTheme.textLight
        : currentTheme.primary,
      padding: 15,
      borderRadius: 25,
      marginTop: 30,
      minWidth: loadingState.loading ? 30 : 350,
    },
  });
  const style = {
    buttonText: {
      color: currentTheme.text,
      textAlign: 'center',
      fontSize: 15,
    },
  };

  return (
    <>
      <AnimatedView style={animatedStyle}>
        {loadingState.loading ? (
          <>
            <ActivityIndicator size={25} color={currentTheme.primary} />
          </>
        ) : (
          <>
            <Text style={style.buttonText}>{buttonText}</Text>
          </>
        )}
      </AnimatedView>
    </>
  );
}

export default AnimatedButton;

// button: {

//   },
