import React, { useCallback, useEffect, useState } from "react";
import { Link, Stack, useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet, Platform, useColorScheme, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, RectButton } from "react-native-gesture-handler";
import { LineChart } from 'react-native-wagmi-charts';
import * as haptics from 'expo-haptics';
import { DateTime } from "luxon";
import { PulseIndicator } from 'react-native-indicators';

import { useApiContext } from "../context/auth";
import { useColors, useStyle } from "../hooks/useStyle";
import AddWebsite from "../components/AddWebsite";
import { getSites } from "../utils/websiteManager";
import { useAxios } from "../hooks/useAxios";
import { useInterval } from "../hooks/useInterval";

const GRAPH_HEIGHT = 120

function invokeHaptic() {
  haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
}

export default function Index() {
  const { apiKey, setApiKey } = useApiContext()
  const colorScheme = useColorScheme()
  const windowDimensions = useWindowDimensions()
  const router = useRouter();
  const colors = useColors()
  const style = useStyle()
  const axios = useAxios()

  const [sites, setSites] = useState<string[]>([])
  const [siteData, setSiteData] = useState<{ [key: string]: any }>({})
  const [reloading, setReloading] = useState<boolean>(false)

  const fetchhSites = async () => {
    let siteData: { [key: string]: any } = {}

    for (const site of sites) {
      const res = await axios.get('/api/v1/stats/timeseries', {
        params: {
          site_id: site,
          period: '7d',
        }
      })

      const prev = await axios.get('/api/v1/stats/timeseries', {
        params: {
          site_id: site,
          period: '7d',
          date: DateTime.now().minus({ days: 7 }).toFormat('yyyy-MM-dd')
        }
      })

      const live = await axios.get('/api/v1/stats/realtime/visitors', {
        params: {
          site_id: site,
        }
      })

      siteData[site] = {
        live: live.data,
        current: res.data.results.map((result: any) => {
          return {
            timestamp: new Date(result.date).getTime(),
            value: result.visitors,
          }
        }),
        previous: prev.data.results.map((result: any) => {
          return {
            timestamp: new Date(result.date).getTime(),
            value: result.visitors,
          }
        })
      }
    }

    setSiteData(siteData)
  }

  const fetchLive = async () => {
    let newSiteData: { [key: string]: any } = JSON.parse(JSON.stringify(siteData))

    for (const site of sites) {
      const res = await axios.get('/api/v1/stats/realtime/visitors', {
        params: {
          site_id: site,
        }
      })

      console.log(`[LIVE] ${site}: ${res.data}`)
      if (newSiteData[site] == null) {
        newSiteData[site] = {
          live: res.data,
        }
      } else {
        newSiteData[site].live = res.data
      }
    }

    setSiteData(newSiteData)
  }

  useEffect(() => {
    if (!apiKey) return
    fetchhSites()
  }, [sites, apiKey])

  useInterval(() => {
    fetchLive()
  }, 1000 * 10)

  useEffect(() => {
    (async () => {
      const sites = await getSites()
      setSites(sites)
    })()
  }, [])

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={style.page}>
          <View style={{
            marginHorizontal: -20,
            flex: 1,
          }}>
            <FlatList
              onRefresh={() => {
                console.log('refresh')
              }}
              data={sites}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                flex: 1,
              }}
              renderItem={({ item }) => {
                return (
                  <View style={{
                    backgroundColor: colors.secondaryBackground,
                    borderRadius: 10,

                    ...(
                      colorScheme === 'light' ?
                        style.shadowMd
                        : null
                    ),
                  }}>
                    <RectButton
                      onPress={() => {
                        router.push(`/sites/${item}`)
                      }}
                      style={{
                        paddingTop: 20,
                        paddingHorizontal: 20,
                        paddingBottom: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text style={{
                        color: colors.text,
                        fontSize: 18,
                      }}>
                        {item}
                      </Text>

                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                        <Text style={{
                          color: colors.text,
                          fontWeight: 'bold',
                        }}>
                          {
                            new Intl
                              // for some reason, compact notation doesn't work
                              .NumberFormat('en', { notation: 'compact' })
                              .format(
                                siteData[item]?.live || 0
                              )
                          }
                        </Text>
                        <PulseIndicator
                          size={14}
                          style={{
                            marginLeft: 10,
                          }}
                          color={'green'}
                        />
                      </View>
                    </RectButton>

                    <View style={{
                      height: GRAPH_HEIGHT,
                    }}>
                      {
                        siteData[item]?.current && siteData[item]?.previous ?
                          <LineChart.Provider
                            data={{
                              one: siteData[item]?.current,
                              two: siteData[item]?.previous,
                            }}
                          >
                            <LineChart.Group>
                              <LineChart
                                id="two"
                                height={GRAPH_HEIGHT}
                                width={windowDimensions.width - 40}
                              >
                                <LineChart.Path color={'#888'} />
                              </LineChart>
                              <LineChart
                                id="one"
                                height={GRAPH_HEIGHT}
                                width={windowDimensions.width - 40}
                              >
                                <LineChart.Path color={colors.primary} />
                                <LineChart.CursorCrosshair
                                  onActivated={invokeHaptic}
                                  onEnded={invokeHaptic}
                                >
                                  <LineChart.Tooltip position="top" />
                                </LineChart.CursorCrosshair>
                              </LineChart>
                            </LineChart.Group>
                          </LineChart.Provider>
                          : null
                      }
                    </View>
                  </View>
                )
              }}
            />
          </View>

          <AddWebsite
            onAdd={(site) => { }}
          />
        </View>
      </SafeAreaView >
    </>
  )
}

const styles = StyleSheet.create({
  title: {
  }
})