export const rangeEnum: { [key: string]: string } = {
  'today': 'Today',
  '7days': 'Last 7 days',
  '30days': 'Last 30 days',
  'monthtodate': 'Month to date',
  'lastmonth': 'Last month',
  'yeartodate': 'Year to date',
  'last12months': 'Last 12 months',
  'alltime': 'All time',
}

export const rangeToPlausiblePeriod: { [key: string]: string } = {
  // 'today': 'day', // not supported by the API, I don't think
  '7days': '7d',
  '30days': '30d',
  // 'monthtodate': 'Month to date', // todo: handle this is graphs
  'lastmonth': 'month',
  // 'yeartodate': 'Year to date', // todo: handle this is graphs
  'last12months': '12mo',
  // 'alltime': 'All time', // todo: handle this API call (from when to when)
}

/*
<Picker.Item label="Today" value="today" />
          <Picker.Item label="Last 7 days" value="7days" />
          <Picker.Item label="Last 30 days" value="30days" />
          <Picker.Item label="Month to date" value="monthtodate" />
          <Picker.Item label="Last month" value="lastmonth" />
          <Picker.Item label="Year to date" value="yeartodate" />
          <Picker.Item label="Last 12 months" value="last12months" />
          <Picker.Item label="All time" value="alltime" />
*/