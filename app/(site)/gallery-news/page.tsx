import type { Metadata } from 'next'
import { GalleryGrid } from '@/components/gallery'
import { Block, NewsList, PageHeader, StepPills } from '@/components/ui'
import { getGallery, getNews, getSections } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Gallery & News',
  description: 'Photos from IPB Robotic Club competitions and activities, plus media coverage of the team.',
}

export default async function GalleryNews() {
  const [s, gallery, news] = await Promise.all([getSections('gallery-news'), getGallery(), getNews()])
  return (
    <>
      <PageHeader
        eyebrow="Media"
        title={s.intro?.title}
        body={s.intro?.body}
        aside={<StepPills items={[{ label: `Gallery · ${gallery.length} photos`, href: '#gallery' }, { label: `News · ${news.length} stories`, href: '#news' }]} />}
      />
      <Block id="gallery" section={s.gallery} eyebrow="Photos">
        <GalleryGrid items={gallery} />
      </Block>
      <Block id="news" section={s.news} eyebrow="Coverage" className="pt-0 md:pt-0">
        {news.length ? <NewsList news={news} /> : <p className="text-navy-600">Coverage links will appear here soon.</p>}
      </Block>
    </>
  )
}
