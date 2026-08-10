import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';
import SectionShell from '../ui/SectionShell';
import SectionHeader from '../ui/SectionHeader';
import { getTextField } from '../../utils/blockFields';

interface Props {
    section: SectionPayload;
    blocks:  BlockPayload[];
    page:    PageCore;
}

export default function LogoCloudSection({ blocks }: Props) {
    const label    = blocks.find(b => b.type === 'label');
    const headline = blocks.find(b => b.type === 'headline');
    const logos    = blocks.filter(b => b.type === 'media');

    return (
        <SectionShell className="section--logo-cloud">
            <SectionHeader
                label={label}
                headline={headline}
                align="center"
            />
            
            {logos.length > 0 && (
                <div className="logo-cloud">
                    <div className="logo-cloud__grid">
                        {logos.map(logo => {
                            const media = logo.media;
                            const url = media?.variants?.[0]?.url || getTextField(logo, 'url') || getTextField(logo, 'image_url');
                            const alt = media ? (media.is_decorative ? '' : media.alt_text) : (getTextField(logo, 'alt') || getTextField(logo, 'title'));
                            if (!url) return null;
                            return (
                                <div key={logo.id} className="logo-cloud__item">
                                    <img 
                                        src={url} 
                                        alt={alt} 
                                        className="logo-cloud__img" 
                                        loading="lazy"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </SectionShell>
    );
}
