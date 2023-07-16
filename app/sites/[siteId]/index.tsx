import React, { useEffect, useMemo } from 'react'
import { View, Text, useColorScheme, Dimensions, Animated } from 'react-native'
import { Stack, useSearchParams } from 'expo-router'
import StatCard from '../../../components/StatCard'
import { SafeAreaInsetsContext, SafeAreaView } from 'react-native-safe-area-context'
import { useColors, useStyle } from '../../../hooks/useStyle'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler'
import { useAxios } from '../../../hooks/useAxios'
import { DateTime } from 'luxon'
import { LineChart, useLineChart, useLineChartPrice } from 'react-native-wagmi-charts'
import Linear from '../../../utils/shape/linear'
import StatSectionCard from '../../../components/StatSectionCard'
import { createIntlCache } from 'react-intl'
import { createIntl } from '@formatjs/intl'
import PagerView, { PagerViewOnPageScrollEventData } from 'react-native-pager-view';
import {
  SlidingDot,
} from 'react-native-animated-pagination-dots';

import getCountryFlag from 'country-flag-icons/unicode'

type ValueObject<T> = {
  value: T
}

interface PlausibleBreakdownStats {
  bounce_rate: number,
  events: number,
  pageviews: number,
  visitors: number,
  visit_duration: number,
  visits: number,
  [key: string]: any
}

interface SourcesBreakdown extends PlausibleBreakdownStats {
  source: string,
}

interface PagesBreakdown extends PlausibleBreakdownStats {
  page: string,
}

interface CountriesBreakdown extends PlausibleBreakdownStats {
  country: string,
}

interface DevicesBreakdown extends PlausibleBreakdownStats {
  device: string,
}

interface PlausibleAggregateStats {
  bounce_rate: ValueObject<number>,
  events: ValueObject<number>,
  pageviews: ValueObject<number>,
  visitors: ValueObject<number>,
  visit_duration: ValueObject<number>,
  visits: ValueObject<number>,
  views_per_visit: ValueObject<number>,
}

export type PlausibleMetrics = 'visitors' | 'visits' | 'pageviews' | 'views_per_visit' | 'bounce_rate' | 'visit_duration' | 'events'

const cache = createIntlCache()

const intl = createIntl(
  {
    locale: 'en',
  },
  cache
)

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export default function SiteDashboard() {
  const colorScheme = useColorScheme();
  const colors = useColors()
  const style = useStyle()
  const axios = useAxios()
  const insets = React.useContext(SafeAreaInsetsContext)

  const { siteId } = useSearchParams()

  const [loading, setLoading] = React.useState(false)
  const [activeStat, setActiveStat] = React.useState<PlausibleMetrics>('visitors')
  const [refreshing, setRefreshing] = React.useState(false)

  const [aggregate, setAggregate] = React.useState<PlausibleAggregateStats | null>(null)
  const [aggregatePrev, setAggregatePrev] = React.useState<PlausibleAggregateStats | null>(null)

  const [sourcesBreakdown, setSourcesBreakdown] = React.useState<any[]>([])
  const [pagesBreakdown, setPagesBreakdown] = React.useState<any[]>([])
  const [countriesBreakdown, setCountriesBreakdown] = React.useState<any[]>([])
  const [devicesBreakdown, setDevicesBreakdown] = React.useState<any[]>([])

  const [timeseries, setTimeseries] = React.useState<any[]>([{ value: 0, timestamp: 0 }])
  const [timeseriesPrev, setTimeseriesPrev] = React.useState<any[]>([{ value: 0, timestamp: 0 }])

  const ref = React.useRef<PagerView>(null);
  const width = Dimensions.get('window').width;
  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const inputRange = [0, 4];
  const scrollX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue
  ).interpolate({
    inputRange,
    outputRange: [0, 4 * width],
  });

  const refreshData = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  // Fetch aggregate stats, and timeseries data for the selected datapoint 
  const fetchData = async () => {
    try {
      setLoading(true)

      const current = await axios.get('/api/v1/stats/aggregate', {
        params: {
          site_id: siteId,
          period: '7d',
          metrics: ['visitors', 'visits', 'pageviews', 'views_per_visit', 'bounce_rate', 'visit_duration', 'events'].join(','),
        }
      })

      const prev = await axios.get('/api/v1/stats/aggregate', {
        params: {
          site_id: siteId,
          period: '7d',
          date: DateTime.now().minus({ days: 7 }).toFormat('yyyy-MM-dd'),
          metrics: ['visitors', 'visits', 'pageviews', 'views_per_visit', 'bounce_rate', 'visit_duration', 'events'].join(','),
        }
      })

      const sourcesBreakdownResp = await axios.get('/api/v1/stats/breakdown', {
        params: {
          site_id: siteId,
          period: '7d',
          metrics: ['visitors', 'visits', 'pageviews', 'bounce_rate', 'visit_duration', 'events'].join(','),
          property: 'visit:source'
        }
      })

      const pagesBreakdownResp = await axios.get('/api/v1/stats/breakdown', {
        params: {
          site_id: siteId,
          period: '7d',
          metrics: ['visitors', 'visits', 'pageviews', 'bounce_rate', 'visit_duration', 'events'].join(','),
          property: 'event:page'
        }
      })

      const countriesBreakdownResp = await axios.get('/api/v1/stats/breakdown', {
        params: {
          site_id: siteId,
          period: '7d',
          metrics: ['visitors', 'visits', 'pageviews', 'bounce_rate', 'visit_duration', 'events'].join(','),
          property: 'visit:country'
        }
      })

      const devicesBreakdownResp = await axios.get('/api/v1/stats/breakdown', {
        params: {
          site_id: siteId,
          period: '7d',
          metrics: ['visitors', 'visits', 'pageviews', 'bounce_rate', 'visit_duration', 'events'].join(','),
          property: 'visit:device'
        }
      })

      setAggregate(current.data.results)
      setAggregatePrev(prev.data.results)
      setSourcesBreakdown(sourcesBreakdownResp.data.results)
      setPagesBreakdown(pagesBreakdownResp.data.results)
      setCountriesBreakdown(countriesBreakdownResp.data.results)
      setDevicesBreakdown(devicesBreakdownResp.data.results)
    } catch (err: any) {
      console.log(err.response.data)
    } finally {
      setLoading(false)
    }
  }

  const fetchFocusedData = async () => {
    try {
      const current = await axios.get('/api/v1/stats/timeseries', {
        params: {
          site_id: siteId,
          period: '7d',
          metrics: [activeStat as string].join(','),
        }
      })

      const prev = await axios.get('/api/v1/stats/timeseries', {
        params: {
          site_id: siteId,
          period: '7d',
          date: DateTime.now().minus({ days: 7 }).toFormat('yyyy-MM-dd'),
          metrics: [activeStat as string].join(','),
        }
      })

      setTimeseries(current.data.results.map((result: any) => {
        return {
          timestamp: new Date(result.date).getTime(),
          value: result[activeStat as string] || 0,
        }
      }))
      setTimeseriesPrev(prev.data.results.map((result: any) => {
        return {
          timestamp: new Date(result.date).getTime(),
          value: result[activeStat as string] || 0,
        }
      }))
    } catch (err: any) {
      console.log(err.response.data)
    }
  }

  const maxValue = useMemo(() => {
    return Math.max(...timeseries.map(item => item.value), ...timeseriesPrev.map(item => item.value))
  }, [timeseries, timeseriesPrev])

  const gridStep = useMemo(() => {
    return Math.max(1, Math.ceil(maxValue / 5))
  }, [maxValue])

  const onPageScroll = React.useMemo(
    () =>
      Animated.event<PagerViewOnPageScrollEventData>(
        [
          {
            nativeEvent: {
              offset: scrollOffsetAnimatedValue,
              position: positionAnimatedValue,
            },
          },
        ],
        {
          useNativeDriver: false,
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (!siteId) return
    fetchData()
  }, [siteId])

  useEffect(() => {
    if (!siteId) return
    fetchFocusedData()
  }, [activeStat])

  if (!siteId) {
    return (
      <View>
        <Text>Missing site ID</Text>
      </View>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: siteId as string,
        }}
      />

      <View style={{ flex: 1 }}>
        <View
          // refreshControl={(
          //   <RefreshControl
          //     refreshing={refreshing}
          //     onRefresh={refreshData}
          //   />
          // )}
          style={{ ...style.page }}
        >
          <View style={{ height: (insets?.top || 0) + 30 }} />
          <View style={{ rowGap: 10 }}>
            <View style={{
              flexDirection: 'row',
              columnGap: 10,
            }}>
              {/* Page visitors */}
              <StatCard
                icon="people"
                title="Page visitors"
                value={aggregate?.visitors.value}
                previousValue={aggregatePrev?.visitors.value}

                active={activeStat === 'visitors'}
                onSetActive={() => setActiveStat('visitors')}
              />

              {/* Page views */}
              <StatCard
                icon="planet"
                title="Total visits"
                value={aggregate?.visits.value}
                previousValue={aggregatePrev?.visits.value}

                active={activeStat === 'visits'}
                onSetActive={() => setActiveStat('visits')}
              />
            </View>

            <View style={{
              flexDirection: 'row',
              columnGap: 10,
            }}>
              {/* Page views */}
              <StatCard
                icon="eye"
                title="Page views"
                value={aggregate?.pageviews.value}
                previousValue={aggregatePrev?.pageviews.value}

                active={activeStat === 'pageviews'}
                onSetActive={() => setActiveStat('pageviews')}
              />

              <StatCard
                icon="layers"
                title="Views per visit"
                value={aggregate?.views_per_visit.value}
                previousValue={aggregatePrev?.views_per_visit.value}

                active={activeStat === 'views_per_visit'}
                onSetActive={() => setActiveStat('views_per_visit')}
              />
            </View>

            <View style={{
              flexDirection: 'row',
              columnGap: 10,
            }}>
              {/* Bounce rate */}
              <StatCard
                icon="rocket"
                title="Bounce rate"
                value={aggregate?.bounce_rate.value}
                previousValue={aggregatePrev?.bounce_rate.value}

                active={activeStat === 'bounce_rate'}
                onSetActive={() => setActiveStat('bounce_rate')}

                invertChange
                valueType='percent'
              />

              {/* Average session duration */}
              <StatCard
                icon="timer-outline"
                title="Session duration"
                value={aggregate?.visit_duration.value}
                previousValue={aggregatePrev?.visit_duration.value}

                active={activeStat === 'visit_duration'}
                onSetActive={() => setActiveStat('visit_duration')}

                valueType='duration'
              />
            </View>
          </View>

          <View style={{ marginLeft: -10, paddingVertical: 20 }}>
            <LineChart.Provider
              data={{
                one: timeseries,
                two: timeseriesPrev,
              }}
            >
              <LineChart.Group>
                <LineChart
                  id="two"
                  height={200}
                  shape={Linear}
                >
                  <LineChart.Path
                    width={2}
                    color={'#888'}
                  />
                </LineChart>
                <LineChart
                  id="one"
                  height={200}
                  shape={Linear}
                >
                  <LineChart.Path
                    width={2}
                    color={colors.primary}
                  >
                    {
                      Array(Math.ceil((maxValue || 1) / gridStep + 1)).fill(0).map((_, i) => {
                        return (
                          <LineChart.HorizontalLine
                            key={i}
                            at={{ value: i * gridStep }}
                            color={colorScheme === 'light' ? '#ddd' : '#444'}
                          />
                        )
                      })
                    }
                  </LineChart.Path>
                  <LineChart.CursorCrosshair>
                    <LineChart.Tooltip
                      textStyle={{
                        color: "#fff"
                      }}
                      style={{
                        backgroundColor: colors.primary,
                        borderRadius: 4,
                      }}
                    />
                  </LineChart.CursorCrosshair>
                </LineChart>
              </LineChart.Group>
            </LineChart.Provider>
          </View>

          <View style={{
            justifyContent: 'center',
            alignSelf: 'center',
            height: 8,
            width: "100%",
            // backgroundColor: '#eee'
          }}>
            <SlidingDot
              containerStyle={{
                top: 0
              }}
              marginHorizontal={3}
              data={[{ key: 0 }, { key: 1 }, { key: 2 }, { key: 3 }]}
              //@ts-ignore
              scrollX={scrollX}
              dotSize={8}
              dotStyle={{
                backgroundColor: colors.primary,
              }}
            />
          </View>

          <AnimatedPagerView
            ref={ref}
            style={{ flex: 1 }}
            onPageScroll={onPageScroll}
            initialPage={0}
          >
            <StatSectionCard
              key={0}
              metric={activeStat}
              title="Top sources"
              items={sourcesBreakdown.map((item: SourcesBreakdown) => {
                return {
                  title: item.source,
                  value: item[activeStat as string],
                }
              })}
            />

            <StatSectionCard
              key={1}
              metric={activeStat}
              title="Top pages"
              items={pagesBreakdown.map((item: PagesBreakdown) => {
                return {
                  title: item.page,
                  value: item[activeStat as string],
                }
              }
              )}
            />

            <StatSectionCard
              key={2}
              metric={activeStat}
              title="Top countries"
              items={countriesBreakdown.map((item: CountriesBreakdown) => {
                return {
                  // @ts-ignore
                  icon: getCountryFlag(item.country),
                  title: intl.formatDisplayName(item.country, { type: 'region' }) || item.country,
                  value: item[activeStat as string],
                }
              }
              )}
            />

            <StatSectionCard
              key={3}
              metric={activeStat}
              title="Top devices"
              items={devicesBreakdown.map((item: DevicesBreakdown) => {
                return {
                  title: item.device,
                  value: item[activeStat as string],
                }
              }
              )}
            />
          </AnimatedPagerView>

          {/* <View style={{ height: (insets?.bottom || 0) + 20 }} /> */}
        </View>
      </View>
    </>
  )
}