import { BookOpen, HelpCircle, ImageIcon, Video } from 'lucide-react'
import type { TerrisEntity, TerrisMediaItem } from '@/data/types/terrisEntity'
import {
  INTERPRETIVE_RECONSTRUCTION_LABEL,
  RECONSTRUCTION_TRUST_BANNER_BODY,
  RECONSTRUCTION_TRUST_BANNER_TITLE,
} from '@/data/reconstruction/reconstructionRules'
import { partitionMedia } from '@/ui/mediaGalleryModel'

function InterpretiveVideoPlaceholderBlock({ item }: { item: TerrisMediaItem }) {
  const meta = item.interpretiveVideoMeta
  if (!meta) return null
  const thumb = item.thumbnailUrl ?? ''
  return (
    <article className="terris-recon-block terris-recon-block--video">
      <div className="terris-recon-block__media-wrap">
        {thumb ? (
          <img
            className="terris-recon-block__thumb"
            src={thumb}
            alt=""
            loading="lazy"
          />
        ) : (
          <div className="terris-recon-block__thumb terris-recon-block__thumb--empty" aria-hidden />
        )}
        <div className="terris-recon-block__video-overlay">
          <Video className="terris-recon-block__video-icon size-6" aria-hidden />
          <span className="terris-recon-block__video-status">
            {meta.generationStatus === 'placeholder'
              ? 'Clip not generated yet'
              : meta.generationStatus === 'ready'
                ? 'Ready to play'
                : `Status: ${meta.generationStatus}`}
          </span>
        </div>
      </div>
      <div className="terris-recon-block__header">
        <span className="terris-recon-block__badge">{INTERPRETIVE_RECONSTRUCTION_LABEL}</span>
        <h3 className="terris-recon-block__title">{item.title}</h3>
        <p className="terris-recon-block__caption">{item.caption}</p>
      </div>
      <dl className="terris-recon-block__sections">
        <div className="terris-recon-block__section">
          <dt className="terris-recon-block__dt">
            <BookOpen className="terris-recon-block__dt-icon size-4" aria-hidden />
            What this would show
          </dt>
          <dd className="terris-recon-block__dd">{meta.description}</dd>
        </div>
        <div className="terris-recon-block__section">
          <dt className="terris-recon-block__dt">Length (planned)</dt>
          <dd className="terris-recon-block__dd">
            {meta.targetDurationSeconds.min}–{meta.targetDurationSeconds.max} seconds · educational scene
          </dd>
        </div>
        {meta.whatIsUncertain ? (
          <div className="terris-recon-block__section">
            <dt className="terris-recon-block__dt">
              <HelpCircle className="terris-recon-block__dt-icon size-4" aria-hidden />
              What is uncertain
            </dt>
            <dd className="terris-recon-block__dd">{meta.whatIsUncertain}</dd>
          </div>
        ) : null}
      </dl>
      <p className="terris-recon-block__credit">{item.credit}</p>
    </article>
  )
}

function InterpretiveStillBlock({ item }: { item: TerrisMediaItem }) {
  const meta = item.reconstructionMeta
  const thumb = item.thumbnailUrl ?? item.url
  return (
    <article className="terris-recon-block terris-recon-block--still">
      <div className="terris-recon-block__media-wrap">
        <img
          className="terris-recon-block__hero-img"
          src={thumb}
          alt={item.title}
          loading="lazy"
        />
        <span className="terris-recon-block__float-badge">{INTERPRETIVE_RECONSTRUCTION_LABEL}</span>
      </div>
      <div className="terris-recon-block__header">
        <h3 className="terris-recon-block__title">{item.title}</h3>
        <p className="terris-recon-block__period">{meta?.historicalPeriod}</p>
        <p className="terris-recon-block__confidence">{meta?.confidenceLabel}</p>
      </div>
      <dl className="terris-recon-block__sections">
        <div className="terris-recon-block__section">
          <dt className="terris-recon-block__dt">
            <ImageIcon className="terris-recon-block__dt-icon size-4" aria-hidden />
            What this depicts
          </dt>
          <dd className="terris-recon-block__dd">{item.caption}</dd>
        </div>
        <div className="terris-recon-block__section">
          <dt className="terris-recon-block__dt">
            <BookOpen className="terris-recon-block__dt-icon size-4" aria-hidden />
            What it is based on
          </dt>
          <dd className="terris-recon-block__dd">{meta?.sourceBasis ?? '—'}</dd>
        </div>
        <div className="terris-recon-block__section">
          <dt className="terris-recon-block__dt">
            <HelpCircle className="terris-recon-block__dt-icon size-4" aria-hidden />
            What is uncertain
          </dt>
          <dd className="terris-recon-block__dd">
            {meta?.interpretationNotes ?? '—'}
          </dd>
        </div>
        {meta?.prompt ? (
          <div className="terris-recon-block__section terris-recon-block__section--prompt">
            <dt className="terris-recon-block__dt">Scene brief (for educators)</dt>
            <dd className="terris-recon-block__dd terris-recon-block__prompt">
              {meta.prompt}
            </dd>
          </div>
        ) : null}
      </dl>
      <p className="terris-recon-block__credit">
        {item.credit}
        {item.license ? ` · ${item.license}` : ''}
      </p>
    </article>
  )
}

function withFallbackMeta(item: TerrisMediaItem): TerrisMediaItem {
  if (item.reconstructionMeta) return item
  return {
    ...item,
    reconstructionMeta: {
      prompt: '',
      historicalPeriod: '—',
      confidenceLabel: 'Illustrative — metadata partial',
      interpretationNotes:
        'This entry may predate full reconstruction fields. Rely on caption, credit, and classroom discussion.',
      sourceBasis: item.caption ? `Caption: ${item.caption}` : 'See media caption and credit.',
    },
  }
}

function InterpretiveMediaBlock({ item }: { item: TerrisMediaItem }) {
  const isVideoPlaceholder =
    item.type === 'video' && item.isInterpretive && item.interpretiveVideoMeta && !item.url.trim()

  if (isVideoPlaceholder) {
    return <InterpretiveVideoPlaceholderBlock item={item} />
  }

  return <InterpretiveStillBlock item={withFallbackMeta(item)} />
}

export function InterpretiveReconstructionPanel({ entity }: { entity: TerrisEntity }) {
  const { interpretive } = partitionMedia(entity.media)
  return (
    <div className="terris-entity-recon-tab">
      <div className="terris-entity-recon-tab__banner" role="region" aria-label="Interpretive content notice">
        <div className="terris-entity-recon-tab__banner-icon-wrap" aria-hidden>
          <BookOpen className="terris-entity-recon-tab__banner-book size-5" />
        </div>
        <div>
          <p className="terris-entity-recon-tab__banner-title">{RECONSTRUCTION_TRUST_BANNER_TITLE}</p>
          <p className="terris-entity-recon-tab__banner-body">{RECONSTRUCTION_TRUST_BANNER_BODY}</p>
        </div>
      </div>
      <p className="terris-entity-recon-tab__lede">
        Documentary photos and archives appear under the Media tab first. Here you will find labeled illustrations
        and planned short clips—each with what it shows, what it draws from, and where to be careful.
      </p>
      {interpretive.length === 0 ? (
        <p className="terris-entity-panel__empty">
          No interpretive reconstructions are listed for this place yet.{' '}
          <span className="terris-entity-panel__empty-sub">
            When they appear, they will always be labeled and paired with source notes—not shown as documentary.
          </span>
        </p>
      ) : (
        <div className="terris-entity-recon-tab__list">
          {interpretive.map((m) => (
            <InterpretiveMediaBlock key={m.id} item={m} />
          ))}
        </div>
      )}
    </div>
  )
}
