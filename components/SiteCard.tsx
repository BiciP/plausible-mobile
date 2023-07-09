import { BorderlessButton } from "react-native-gesture-handler";
import Card from "./Card";
import { useRouter } from "expo-router";
import { View, Text, useWindowDimensions } from "react-native";
import { PulseIndicator } from "react-native-indicators";
import { LineChart, TLineChartData } from "react-native-wagmi-charts";
import { useColors, useStyle } from "../hooks/useStyle";
import Linear from '../utils/shape/linear'

const GRAPH_HEIGHT = 120

interface SiteDataCompact {
  live: number
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
      as={BorderlessButton}
      onPress={() => {
        router.push(`/sites/${origin}`)
      }}
    >
      <View
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
          {origin}
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