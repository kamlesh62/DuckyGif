import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {getTrendingGifs, searchGifs} from '../api/giphy';
import CustomImage from '../components/CustomImage';
import {useThrottledCallback} from 'use-debounce';
import RNBootSplash from 'react-native-bootsplash';

const Page = styled.View`
  background-color: black;
`;

const Home = () => {
  const [gifs, setGifsData] = useState({
    data: [],
    pagination: {total_count: 0, count: 0, offset: 0},
  });
  const [requesting, setRequesting] = useState(false);
  const [loaginMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getMoreGifs = async (offset, api = 'trending', query = '') => {
    const getMoreApi = api === 'trending' ? getTrendingGifs : searchGifs;
    if (loaginMore) return;
    try {
      setLoadingMore(true);
      const {data, ...res} = await getMoreApi(offset || 0, query);
      setGifsData({data: [...gifs?.data, ...data], ...res});
    } catch (e) {
      console.log('Ther was an error');
    } finally {
      setLoadingMore(false);
    }
  };

  const searchGif = async (offset, query) => {
    if (loaginMore) return;
    try {
      setLoadingMore(true);
      const res = await searchGifs(offset || 0, query);
      setGifsData(res);
    } catch (e) {
      console.log('Ther was an error');
    } finally {
      setLoadingMore(false);
    }
  };

  const debounced = useThrottledCallback(
    // function
    searchGif,
    // delay in ms
    1000,
  );

  useEffect(() => {
    const getTrendingGif = async offset => {
      try {
        setRequesting(true);
        const res = await getTrendingGifs(offset || 0);
        setGifsData(res);
      } catch (e) {
        console.log('Ther was an error');
      } finally {
        setRequesting(false);
        RNBootSplash.hide({fade: true});
      }
    };

    getTrendingGif();
  }, []);

  const getTrendingGif = async offset => {
    try {
      setRequesting(true);
      const res = await getTrendingGifs(offset || 0);
      setGifsData(res);
    } catch (e) {
      console.log('Ther was an error');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <SafeAreaView>
      <Page>
        <TextInput
          value={searchQuery}
          onChangeText={async text => {
            setSearchQuery(text);
            if (text === '') {
              await getTrendingGif();
            } else {
              await debounced(gifs.pagination.offset + 1, text);
            }
          }}
          placeholder={'Search'}
          style={{backgroundColor: 'grey'}}
        />
        <FlatList
          data={gifs?.data}
          refreshing={requesting}
          numColumns={2}
          onEndReachedThreshold={0.9}
          keyExtractor={item => item.id}
          onEndReached={async () => {
            if (loaginMore) return;
            await getMoreGifs(gifs.pagination.offset + 1);
          }}
          ListFooterComponent={() =>
            loaginMore && <ActivityIndicator size={'large'} color={'red'} />
          }
          renderItem={({item, index}) => {
            return <CustomImage uri={item?.images?.preview_gif?.url} />;
          }}
        />
      </Page>
    </SafeAreaView>
  );
};

export default Home;
