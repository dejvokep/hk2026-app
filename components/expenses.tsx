import {ChartConfig, ChartContainer, ChartLegend, ChartLegendContent} from "@/components/ui/chart";
import {Pie, PieChart} from "recharts";
import {useMemo} from "react";

export type ExpensesType = {[k: string]: number};

const chartConfig = {
    share: {
        label: "Share"
    },
} satisfies ChartConfig

export default function Expenses({expenses}: {expenses: ExpensesType}) {

    const data = useMemo(() => {
        return Object.entries(expenses).map(([key, value], index) => ({
            name: key,
            share: value * 100,
            fill: `var(--chart-${(index % 5) + 1})`,
        }))
    }, [expenses]);

    return <div><ChartContainer config={chartConfig}>
        <PieChart>
            <Pie data={data}
                dataKey="share"
                nameKey="name"
                innerRadius={60}
                strokeWidth={20}
            />
        </PieChart>
    </ChartContainer>
        <div className={"flex gap-4 justify-center"}>
            {data.map(d => <div key={d.name} className={"flex items-center gap-x-1"}>
                <div className={"size-2"} style={{background: d.fill}}/>
                <p className={"capitalize"}>{d.name.toLowerCase()} ({d.share.toFixed(0)}%)</p>
            </div>)}
        </div>
    </div>
}