import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props { section?: SectionPayload; blocks?: BlockPayload[]; page?: PageCore; }

export default function UnknownSection(_props: Props) {
    return null;
}
