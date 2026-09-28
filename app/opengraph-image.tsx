import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getSettings } from '@/lib/data'
import { mediaUrl } from '@/lib/media'

export const alt = 'IPB Robotic Club'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const settings = await getSettings()
  const logo = `data:image/png;base64,${(await readFile(join(process.cwd(), 'public/brand/logo.png'))).toString('base64')}`
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: 'linear-gradient(135deg, #31516B 0%, #0F1B24 100%)' }}>
        {settings.og && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl(settings.og.path)} alt="" width={1200} height={630} style={{ position: 'absolute', inset: 0, objectFit: 'cover', opacity: 0.45 }} />
        )}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 72, width: '100%' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" width={120} height={120} style={{ borderRadius: 999, background: 'white' }} />
          <div style={{ marginTop: 32, fontSize: 76, fontWeight: 800, color: 'white' }}>{settings.org_name}</div>
          <div style={{ marginTop: 12, fontSize: 34, color: 'white', opacity: 0.9 }}>{settings.tagline}</div>
          <div style={{ marginTop: 32, width: 120, height: 8, background: '#FE4B3E' }} />
        </div>
      </div>
    ),
    size,
  )
}
