/** Pulsar injects this bridge; importing it at runtime would shadow the host. */
declare const Pulsar: typeof import('@supernovaio/sdk-exporters').Pulsar
