import {FC, ReactNode, useMemo} from "react";
import {SWRResponse} from "swr";
import {SWRInfiniteResponse} from "swr/infinite";
import {Button} from "@/components/ui/button";

type Props<T> = {
    Loading?: FC | null,
    Error?: FC<{error: Error}>,
    success: (data: T) => ReactNode
}

const DefaultError = ({error}: {error: Error}) => <p>{formatSWRError(error)}</p>
const DefaultLoading = () => <p className={"text-center text-ligr"}>Loading...</p>

export function SWRFacade<T>({res, Loading, Error, success}: {res: SWRResponse<T, Error>} & Props<T>) {
    if (res.error)
        return <ErrorHandler Renderer={Error} error={res.error}/>;
    if (!res.data)
        return <LoadingHandler Renderer={Loading}/>;
    return success(res.data);
}

export function SWRDFacade<T1, T2>({res1, res2, Loading, Error, success}: {res1: SWRResponse<T1, Error>, res2: SWRResponse<T2, Error>} & Props<[T1, T2]>) {
    if (res1.error)
        return <ErrorHandler Renderer={Error} error={res1.error}/>;
    if (res2.error)
        return <ErrorHandler Renderer={Error} error={res2.error}/>;
    if (!res1.data || !res2.data)
        return <LoadingHandler Renderer={Loading}/>;
    return success([res1.data, res2.data]);
}

export function SWRTFacade<T1, T2, T3>({res, Loading, Error, success}: {res: [SWRResponse<T1, Error>, SWRResponse<T2, Error>, SWRResponse<T3, Error>]} & Props<[T1, T2, T3]>) {
    if (res[0].error)
        return <ErrorHandler Renderer={Error} error={res[0].error}/>;
    if (res[1].error)
        return <ErrorHandler Renderer={Error} error={res[1].error}/>;
    if (res[2].error)
        return <ErrorHandler Renderer={Error} error={res[2].error}/>;
    if (res[0].isLoading || res[1].isLoading || res[2].isLoading || !res[0].data || !res[1].data || !res[2].data)
        return <LoadingHandler Renderer={Loading}/>;
    return success([res[0].data, res[1].data, res[2].data]);
}

type InfiniteProps<T> = {
    res: SWRInfiniteResponse<T[], Error>,
    firstSize?: number,
    pageSize?: number,
    customEnd?: ReactNode
} & Props<T[]>

export function SWRIFacade<T>({res, Loading, Error, success, firstSize, pageSize = 5, customEnd}: InfiniteProps<T>) {
    const flat = useMemo(() => res.data ? ([] as T[]).concat(...res.data) : [], [res.data])
    const empty = res.data?.at(0)?.length === 0, end = empty || (res.data && (res.data.at(-1)?.length || 0) < (res.data.length <= 1 ? (firstSize || pageSize) : pageSize));
    const loadingMore = res.size > 0 && res.data && typeof res.data.at(res.size - 1) === "undefined";

    if (res.error)
        return <ErrorHandler Renderer={Error} error={res.error}/>;
    if (res.isLoading || !res.data)
        return <LoadingHandler Renderer={Loading}/>;

    return <>
        {success(flat)}
        {(res.data.at(0)?.length || 0) > 0 && !(res.size === 1 && (end && !customEnd)) && <div className={"flex justify-center"}>
            {(end && customEnd) ? customEnd : <Button variant={"link"} className={"h-4 text-muted-foreground hover:text-foreground"} disabled={res.isLoading || loadingMore || end} onClick={() => res.setSize(res.size + 1)}>
                {end ? "End" : (res.isLoading || loadingMore) ? "Loading..." : "Load more"}
            </Button>}
        </div>}
    </>
}

function LoadingHandler({Renderer = DefaultLoading}: {Renderer?: FC | null}) {
    return Renderer === null ? null : <Renderer/>;
}

function ErrorHandler({Renderer = DefaultError, error}: {Renderer?: FC<{error: Error}>, error: Error}) {
    return <Renderer error={error}/>
}

export function formatSWRError(error: Error) {
    return `This did not work out (${error.message}).`
}