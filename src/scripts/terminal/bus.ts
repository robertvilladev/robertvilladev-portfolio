// Terminal events: `open`, `close`, `command:run` (detail: parsed { name, args, flags }).
// Part of the first-paint bundle, so other features can listen before the shell loads.
export const bus = new EventTarget();
