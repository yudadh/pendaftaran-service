import { RateLimiterMemory } from "rate-limiter-flexible";


export const mapboxLimiter = new RateLimiterMemory({
    points: 300,
    duration: 60,
    keyPrefix: 'mapbox'
})

export const delayMs = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}