import React from 'react';
import type { BlockPayload, RenderContext } from '../../types/engine';
import { getDemoLeadershipPhoto } from '../../admin/lang/demoMedia';
import { SITE_LANG } from '../lang/en';

const L = SITE_LANG.leadership;

interface Props { block: BlockPayload; context?: RenderContext; index?: number; }

interface PersonFields {
    full_name?:    string;
    title?:        string;
    department?:   string;
    bio_short?:    string;
    linkedin_url?: string;
    image_url?:    string;
}

export default function PersonCardBlock({ block, index = 0 }: Props) {
    const f = block.fields as PersonFields;
    const { full_name, title, department, bio_short, linkedin_url, image_url } = f ?? {};

    const photo = image_url ?? getDemoLeadershipPhoto(index).url;
    const initial = full_name?.[0] ?? '?';

    return (
        <div className="person-card">
            <div className="person-card__photo-wrap">
                <img
                    src={photo}
                    alt={full_name ?? 'Team member'}
                    className="person-card__photo"
                    loading="lazy"
                    onError={e => {
                        const img = e.currentTarget;
                        img.style.display = 'none';
                        const fb = img.nextElementSibling as HTMLElement | null;
                        if (fb) fb.style.display = 'flex';
                    }}
                />
                <div className="person-card__avatar" aria-hidden="true">
                    {initial}
                </div>
            </div>
            <div className="person-card__body">
                <h3 className="person-card__name">{full_name}</h3>
                {title && <p className="person-card__title">{title}</p>}
                {department && <p className="person-card__dept">{department}</p>}
                {bio_short && <p className="person-card__bio">{bio_short}</p>}
                {linkedin_url && (
                    <a
                        href={linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="person-card__linkedin"
                    >
                        {L.connectOnLinkedIn} →
                    </a>
                )}
            </div>
        </div>
    );
}
