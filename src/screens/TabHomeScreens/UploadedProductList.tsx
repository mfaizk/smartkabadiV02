import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {themeState} from '../../redux/reducer/ThemeReducer';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';

const UploadedProductList = () => {
  const currentTheme = useSelector((state: RootState) => state.theme);
  const styles = useMemo(() => createStyle(currentTheme), [currentTheme]);
  return (
    <View>
      <Text>Uploaded Product list</Text>
    </View>
  );
};

export default UploadedProductList;

const createStyle = (currentTheme: themeState) => {
  const styles = StyleSheet.create({});
  return styles;
};
