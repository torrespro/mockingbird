import { Dispatch } from 'react'

import useGeneratorConfig from '@/lib/hooks/useGeneratorConfig'
import { Action, State } from '@/lib/state'

type OverviewStepProps = {
  state: State
  dispatch: Dispatch<Action>
}

export default function OverviewStep({ state, dispatch }: OverviewStepProps) {
  const { generator, config } = useGeneratorConfig()
  const infoItems = [
    ...(generator
      ? [
          {
            title: 'Events Per Seconds',
            value: config.eps,
          },
          {
            title: 'Limit',
            value: config.limit,
          },
        ]
      : []),
    ...(generator === 'Tinybird'
      ? [
          {
            title: 'Destination',
            value: 'Tinybird Events API',
          },
          {
            title: 'Data Source',
            value: config.datasource,
          },
        ]
      : generator === 'UpstashKafka'
      ? [
          {
            title: 'Destination',
            value: 'Upstash Kafka',
          },
          {
            title: 'Topic',
            value: config.topic,
          },
        ]
      : []),
  ] as const

  const onStartGenerationClick = () => {
    dispatch({
      type: 'startGenerating',
      payload: {
        generator,
        config,
        onMessage: ({ data }) =>
          dispatch({
            type: 'setSentMessages',
            payload: data,
          }),
        onError: e => console.error(e),
      },
    })
  }

  const onStopGenerationClick = () => {
    dispatch({ type: 'stopGenerating', payload: null })
  }

  return (
    <div id="overview-step">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-10 bg-white rounded-lg">
          <p className="text-sm">Total Events Sent</p>
          <h2 className="font-semibold text-[64px] leading-[72px]">
            {state.sentMessages.total}
          </h2>
        </div>

        <div className="p-10 bg-white rounded-lg">
          <p className="text-sm">Sent this session</p>
          <h2 className="font-semibold text-[64px] leading-[72px]">
            {state.sentMessages.session}
          </h2>
        </div>

        <div className="flex flex-wrap gap-10 p-10 bg-white rounded-lg lg:col-span-2">
          {infoItems.map(item => (
            <div key={item.title} className="flex flex-col gap-1">
              <p className="text-sm">{item.title}</p>

              <p className="text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-9" />

      <div className="flex justify-end">
        <button
          type="button"
          className="btn-base btn-primary"
          onClick={
            state.isGenerating ? onStopGenerationClick : onStartGenerationClick
          }
        >
          {state.isGenerating ? 'Stop' : 'Start'} Generating!
        </button>
      </div>
    </div>
  )
}
