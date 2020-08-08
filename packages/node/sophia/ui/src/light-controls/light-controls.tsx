import React from 'react'
import { Button } from 'react-native-paper'

export const LightControls = () => {
  const turnOff = () => {
    fetch('https://dashboard.the-pegasus.net/api/services/light/turn_off', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJiM2JjNWU1NjIwNmI0NzNiYmYzOTAxMjI3OTQyZjY5NiIsImlhdCI6MTU5MDM4NjIyNiwiZXhwIjoxOTA1NzQ2MjI2fQ.paVsecvt0IdcM_SdXJdW4AoQRI_6CM_dUYuhmsQRVVQ',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity_id: 'light.nook_lamp',
      }),
    })
  }

  const turnOn = () => {
    fetch('https://dashboard.the-pegasus.net/api/services/light/turn_on', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJiM2JjNWU1NjIwNmI0NzNiYmYzOTAxMjI3OTQyZjY5NiIsImlhdCI6MTU5MDM4NjIyNiwiZXhwIjoxOTA1NzQ2MjI2fQ.paVsecvt0IdcM_SdXJdW4AoQRI_6CM_dUYuhmsQRVVQ',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity_id: 'light.nook_lamp',
      }),
    })
  }

  return (
    <>
      <Button
        onPress={turnOff}
      >
        Turn Lights Off
      </Button>
      <Button
        onPress={turnOn}
      >
        Turn Lights On
      </Button>
    </>
  )
}