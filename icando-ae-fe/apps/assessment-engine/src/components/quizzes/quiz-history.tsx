import { Button } from "@ui/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@ui/components/ui/dialog"
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { getQuizHistory } from "../../services/quiz.ts";
import React from "react";
import { Pagination } from "../pagination.tsx";

export function QuizHistory({ quizId, quizName, onClose }: { quizId: string, quizName:(string|null), onClose: () => void }) {
    const [searchParams] = useSearchParams();
    const pageParams = searchParams.get("page");
    const [page, setPage] = useState(pageParams ? parseInt(pageParams) : 1);

    const { data, isLoading } = useQuery({
        queryKey: ['quizhistory', page],
        queryFn: () => getQuizHistory({ id: quizId, page: page, limit: 10 }),
    });

    useEffect(() => {
        if (data) {
            if (data.meta.page != page) {
                setPage(data.meta.page);
            }
        }
    }, [data, page]);
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>History - {quizName ? quizName : "Untitled Quiz"}</DialogTitle>
                </DialogHeader>
                {data && data.data.length > 0 && data.data
                    .filter(history => history.lastPublishedAt !== null)
                    .map((history, index, array) => {
                        const idx = array.length - 1 - index;
                        const formattedDate = history.lastPublishedAt
                            ? new Date(history.lastPublishedAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric',
                                hour: '2-digit', minute: '2-digit', second: '2-digit'
                            })
                            : "Date not available";

                        return (
                            <React.Fragment key={index}>
                                <div className="flex space-x-2 items-center">
                                    <div className="grid flex-1 gap-2">
                                        <b>Version {idx}</b> - {formattedDate}
                                    </div>
                                    <Button type="submit" size="sm" className="px-3">
                                        <Link to={`/history/${history.id}`}>View</Link>
                                    </Button>
                                </div>
                            </React.Fragment>
                        );
                    })
                }

                {data && data.meta.totalItem === 0 ? (
                    null
                ) : (
                    !isLoading &&
                    data &&
                    data.meta.totalPage > 1 && (
                        <div className="flex w-full justify-end">
                            <Pagination
                                page={page}
                                totalPage={data?.meta.totalPage || 1}
                                setPage={setPage}
                                withSearchParams={true}
                            />
                        </div>
                    )
                )}

                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
