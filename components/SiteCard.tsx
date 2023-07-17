import { BorderlessButton } from "react-native-gesture-handler";
import Card from "./Card";
import { useRouter } from "expo-router";
import { View, Text, useWindowDimensions } from "react-native";
import { PulseIndicator } from "react-native-indicators";
import { LineChart, TLineChartData } from "react-native-wagmi-charts";
import { useColors, useStyle } from "../hooks/useStyle";
import Linear from '../utils/shape/linear'
import Ionicons from "@expo/vector-icons/Ionicons";

const GRAPH_HEIGHT = 120

interface SiteDataCompact {
  error?: boolean
  live: number
  last24h: number
  current: TLineChartData
  previous: TLineChartData
}

interface SiteCardProps {
  origin: string
  siteData: SiteDataCompact
}

export default function SiteCard({ origin, siteData }: SiteCardProps) {
  const router = useRouter();
  const windowDimensions = useWindowDimensions()
  const colors = useColors()
  const style = useStyle()

  if (!siteData) return null

  return (
    <Card
      as={siteData.error ? View : BorderlessButton}
      onPress={() => {
        if (siteData.error) return
        router.push(`/sites/${origin}`)
      }}
    >
      <View
        style={{
          paddingTop: 15,
          paddingHorizontal: 20,
          paddingBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
            <Text style={{
              color: colors.text,
              fontWeight: 'bold',
              fontSize: 18,
              marginBottom: 5,
            }}>
              {origin}
            </Text>

            {
              siteData.error ?
                <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }} >
                  <Ionicons name='alert-circle' size={18} color={colors.danger} />
                  <Text style={{ color: colors.danger }}>
                    Could not fetch site data
                  </Text>
                </View>
                : null
            }
          </View>

          <Text>
            <Text style={{ fontWeight: 'bold' }}>{siteData.last24h}</Text> visitors in last 24h
          </Text>
        </View>

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
                .format(siteData.live || 0)
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
      </View>

      <View style={{
        height: GRAPH_HEIGHT,
      }}>
        {
          siteData.current && siteData.previous ?
            <LineChart.Provider
              data={{
                one: siteData.current,
                two: siteData.previous,
              }}
              yRange={{
                min: 0,
                // this moves the graph line to the bottom of the graph if there are no visitors
                // otherwise, the graph line will be in the middle of the graph which looks weird
                max: Math.max(
                  siteData.current.reduce((curMax, point) => Math.max(curMax, point.value), 1),
                  siteData.previous.reduce((curMax, point) => Math.max(curMax, point.value), 1)
                )
              }}
            >
              <LineChart.Group>
                <LineChart
                  id="two"
                  height={GRAPH_HEIGHT}
                  width={windowDimensions.width - 20}
                  shape={Linear}
                >
                  <LineChart.Path
                    width={2}
                    color={'#888'}
                  />
                </LineChart>
                <LineChart
                  id="one"
                  height={GRAPH_HEIGHT}
                  width={windowDimensions.width - 20}
                  shape={Linear}
                >
                  <LineChart.Path
                    width={2}
                    color={colors.primary}
                  />
                </LineChart>
              </LineChart.Group>
            </LineChart.Provider>
            : null
        }
      </View>
    </Card>
  )
}