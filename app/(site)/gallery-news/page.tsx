import type { Metadata } from 'next'
import { GalleryGrid } from '@/components/gallery'
import { Block, Markdown, NewsList, PageHeader, pillsFrom, StepPills } from '@/components/ui'
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
        eyebrow={s.intro?.eyebrow}
        title={s.intro?.title}
        body={s.intro?.body}
        aside={<StepPills items={pillsFrom(s.intro, { photos: gallery.length, news: news.length })} />}
      />
      <Block id="gallery" section={s.gallery}>
        <GalleryGrid items={gallery} />
      </Block>
      <Block id="news" section={s.news} className="pt-0 md:pt-0">
        {news.length ? <NewsList news={news} /> : <Markdown text={s['news-empty']?.body} className="text-navy-600" />}
      </Block>
    </>
  )
}
