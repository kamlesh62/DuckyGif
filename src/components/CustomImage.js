import React, {useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import Share, {ShareSheet} from 'react-native-share';

const {width} = Dimensions.get('window');

const Wrapper = styled.View`
  width: ${width / 2}px;
  height: 100px;
  justify-content: center;
  align-items: center;
  margin: 1px;
`;

const CustomImage = ({uri, ...rest}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onShare = () => {
    Share.open({url: rest.image});
  };

  return (
    <TouchableOpacity
      onPress={() => {
        try {
          onShare();
        } catch (e) {
          console.log('error', e);
        }
      }}>
      <Wrapper>
        <FastImage
          style={{
            height: 100,
            width: width / 2,
          }}
          onLoad={() => {
            setLoading(false);
            setSuccess(true);
          }}
          onError={() => {
            setLoading(false);
          }}
          onLoadStart={() => {
            setLoading(true);
          }}
          onLoadEnd={() => {
            setLoading(false);
            setSuccess(true);
          }}
          source={{
            uri,
          }}
          resizeMode={FastImage.resizeMode.cover}
          {...rest}
        />
      </Wrapper>
    </TouchableOpacity>
  );
};

export default CustomImage;
