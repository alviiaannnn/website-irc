'use client'

import { useState } from 'react'
import type { Project, Team } from '@/lib/data'
import { ProjectCard } from './ui'

/** Segmented control, styled like the irc-mobile login tabs. */
export function Segmented({ label, options, value, onChange }: { label: string; options: { id: string; name: string }[]; value: string; onChange: (id: string) => void }) {
  return (
    <div role="group" aria-label={label} className="inline-flex max-w-full flex-wrap gap-1 rounded-xl bg-surface p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={`min-h-10 rounded-lg px-4 text-sm font-medium capitalize transition-colors ${value === o.id ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-600 hover:text-navy-900'}`}
        >
          {o.name}
        </button>
      ))}
    </div>
  )
}

export function ProjectGrid({ projects, teams }: { projects: Project[]; teams: Pick<Team, 'id' | 'name'>[] }) {
  const [team, setTeam] = useState('all')
  const shown = team === 'all' ? projects : projects.filter((p) => p.team?.id === team)
  return (
    <>
      <Segmented label="Filter projects by research team" options={[{ id: 'all', name: 'All' }, ...teams]} value={team} onChange={setTeam} />
      <p className="sr-only" aria-live="polite">{shown.length} projects shown</p>
      <div className="cards mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => <ProjectCard key={p.id} project={p} />)}
      </div>
    </>
  )
}
