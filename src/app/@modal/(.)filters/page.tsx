'use client';
import { useFilter } from "@/components/FilterContext";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOptions } from "@/types/sort-options";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
    const router = useRouter();
    const { sortBy, setSortBy } = useFilter();
    const [_sortBy, _setSortBy] = useState<SortOptions | null>(null);
    return (
        <Modal>
            <div className="w-full bg-white p-4 sm:p-6 md:p-8 lg:p-12 rounded-lg mx-4">
                <div className="text-md text-slate-600 mb-4">
                    Price
                </div>
                <Select onValueChange={(value) => _setSortBy(value as SortOptions)}>
                    <SelectTrigger className="w-full" defaultValue={sortBy as string}>
                        <SelectValue placeholder={sortBy == SortOptions.PRICE_ASC ? "Low to Hight (Lowest First)" : "High to Low (Highest First)"} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={SortOptions.PRICE_ASC}>Low to Hight (Lowest First)</SelectItem>
                        <SelectItem value={SortOptions.PRICE_DESC}>High to Low (Highest First)</SelectItem>
                    </SelectContent>
                </Select>
                <div className="mt-4 text-md text-slate-600 mb-4 flex justify-center sm:justify-end gap-8 w-full">
                    <Button className="bg-[#FFFFFF] text-[#000000]"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={() => {
                            setSortBy(_sortBy);
                            router.back();
                        }}
                    >
                        Apply
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
export default Page;