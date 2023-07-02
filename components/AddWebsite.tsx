import React, { useCallback, useMemo, useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BorderlessButton, RectButton } from "react-native-gesture-handler";
import { Platform, View, Text, useColorScheme, ActivityIndicator } from "react-native";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetTextInput, BottomSheetView, useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet';

import { useColors, useStyle } from "../hooks/useStyle"
import { shadowMd } from '../styles/shadows';
import TextInput from './TextInput';
import { useAxios } from '../hooks/useAxios';
import { addSite } from '../utils/websiteManager';

export default function AddWebsite({ onAdd }: { onAdd: (site: string) => void }) {
  const colorScheme = useColorScheme()
  const colors = useColors()
  const style = useStyle()
  const axios = useAxios()

  const inputRef = useRef(null)
  const [domain, setDomain] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleAddWebsite = useCallback(async () => {
    if (domain === '') {
      setError('Domain cannot be empty')
      return
    }

    setError(null)
    setLoading(true)

    try {
      await axios.get('/api/v1/stats/realtime/visitors', {
        params: {
          site_id: domain
        }
      })

      await addSite(domain)
      onAdd(domain)
    } catch (e: any) {
      if (e.response.status === 401) {
        setError('Invalid API key or site ID.')
      } else {
        setError('An unknown error occurred.')
      }
    }

    // TODO: Add website (async storage)

    setLoading(false)
  }, [domain])

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleModalChange = useCallback((index: number) => {
    if (index === -1) {
      setDomain('')
      setError(null)
    } else {
      // @ts-ignore
      inputRef.current?.focus()
    }
  }, []);

  return (
    <BottomSheetModalProvider>
      <BorderlessButton
        style={{
          height: 64,
          width: 64,
          borderRadius: 32,
          backgroundColor: colors.primary,
          position: 'absolute',
          bottom: 32,
          right: 32,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
          ...(
            colorScheme === 'light' ?
              style.shadowMd :
              {}
          ),
          shadowColor: colors.primary
        }}
        onPress={handlePresentModalPress}
      >
        <Ionicons
          name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'}
          size={40}
          color="white"
          style={{
            transform: [
              {
                translateX: 2,
              }
            ]
          }}
        />
      </BorderlessButton>

      <BottomSheetModal
        index={0}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        onChange={handleModalChange}
        ref={bottomSheetModalRef}
        style={{
          ...(
            colorScheme === 'light' ?
              shadowMd : {}
          ),
        }}
        containerStyle={{
          zIndex: 100,
        }}
        handleStyle={{
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          backgroundColor: colors.secondaryBackground,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.primary,
        }}
      >
        <BottomSheetView
          onLayout={handleContentLayout}
          style={{
            flex: 1,
            backgroundColor: colors.secondaryBackground,
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <Text style={style.title}>
            Add a Website
          </Text>

          <Text style={{
            color: colors.text,
            fontSize: 16,
            marginTop: 20,
            marginBottom: 10,
          }}>
            Website domain <Text style={{ opacity: .75 }}>(e.g. plausible.io)</Text>
          </Text>
          <TextInput
            as={BottomSheetTextInput}
            ref={inputRef}
            placeholder="plausible.io"
            value={domain}
            onChangeText={setDomain}
            invalid={error !== null}
            errorMessage={error as string}
          />

          <RectButton
            enabled={!loading}
            style={{
              ...style.primaryButton,
              marginVertical: 20
            }}
            onPress={handleAddWebsite}
          >
            {
              loading ?
                <ActivityIndicator color={"#fff"} />
                :
                <Text style={style.primaryButtonText}>
                  Add website
                </Text>
            }
          </RectButton>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  )
}