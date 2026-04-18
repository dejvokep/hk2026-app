import useSWR, {BareFetcher, Key, SWRConfiguration} from "swr";
import useSWRImmutable from "swr/immutable";

export const ImmutableConfig = {revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false}

export default function useSWRFetch<T>(key: Key, config?: SWRConfiguration<T, Error, BareFetcher<T>>) {
    return useSWR<T, Error>("http://localhost:3000/api" + key, fetcher, config);
}

export function useSWRImmutableFetch<T>(key: Key, config?: SWRConfiguration<T, Error, BareFetcher<T>>) {
    return useSWRImmutable<T, Error>(key, fetcher, config);
}

export const fetcher = (...args: [RequestInfo | URL, RequestInit?]) => {
    return fetch(...args)
        .then(res => {
            if (!res.ok)
                throw new Error(`HTTP ${res.status}`, {cause: res.statusText});
            return res.json();
        });
}