import type { BlockPayload, RenderContext } from '../../types/engine';

interface Props { block?: BlockPayload; context?: RenderContext; }

export default function UnknownBlock(_props: Props) {
    return null;
}
