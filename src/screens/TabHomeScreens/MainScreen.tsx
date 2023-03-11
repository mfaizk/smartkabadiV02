import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import {themeState} from '../../redux/reducer/ThemeReducer';

const MainScreen = () => {
  const currentTheme = useSelector((state: RootState) => state.theme);
  // const dispatch = useDispatch();
  const styles = useMemo(() => createTheme(currentTheme), [currentTheme]);
  return (
    <View style={styles.mainContainer}>
      <Text>MainScreen</Text>
    </View>
  );
};

const createTheme = (currentTheme: themeState) => {
  const style = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: currentTheme.background,
    },
  });
  return style;
};

export default MainScreen;
