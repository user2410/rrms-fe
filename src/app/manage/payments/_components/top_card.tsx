import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import wait from "@/utils/wait-fn";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { CircleX, TrendingDown, TrendingUp } from "lucide-react";
import { Session } from "next-auth";
import { ReactNode } from "react";

type Data = {
  incomesThisMonth: number;
  incomesLastMonth: number;
  expensesThisMonth: number;
  expensesLastMonth: number;
  totalExpenses: number;
  totalIncomes: number;
};

export default function TopCard({
  sessionData,
}: {
  sessionData: Session;
}) {
  const query = useQuery<Data>({
    queryKey: ["manage", "payments", sessionData.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const incomes = (await backendAPI.get("/api/statistics/rentals/payments/incomes", {
        params: {
          // start time is the first day of the current month
          startTime: new Date(0),
          endTime: new Date(),
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || ([]);
      const payments = (await backendAPI.get("/api/statistics/payments", {
        params: {
          // start time is the first day of the current month
          startTime: new Date(0),
          endTime: new Date(),
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || ([]);
      return {
        incomesThisMonth: incomes.at(0)?.amount ?? 0,
        incomesLastMonth: incomes.at(1)?.amount ?? 0,
        expensesThisMonth: payments.at(0)?.amount ?? 0,
        expensesLastMonth: payments.at(1)?.amount ?? 0,
        totalExpenses: payments.reduce((acc: number, cur: any) => acc + cur.amount, 0),
        totalIncomes: incomes.reduce((acc: number, cur: any) => acc + cur.amount, 0),
      };
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  const ResultDisplay = ({
    query,
    item,
  } : {
    query: UseQueryResult<Data, unknown>;
    item: ReactNode;
  }) => (
    query.isLoading ? (
      <Spinner size={16} />
    ) : query.isError ? (
      <span className="space-x-1">
        <CircleX className="h-6 w-6 text-red-600 inline" />
        Đã có lỗi xảy ra
      </span>
    ) : (
      item
    )
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Khoản thu chi của bạn</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Thu nhập tháng này</h3>
          <ResultDisplay
            query={query}
            item={
              <AmountTrending
                current={query.data?.incomesThisMonth || 0}
                prev={query.data?.incomesLastMonth}
              />
            }
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Chi tiêu tháng này</h3>
          <span className="space-x-2">
          <ResultDisplay
            query={query}
            item={
              <AmountTrending
                current={query.data?.expensesThisMonth || 0}
                prev={query.data?.expensesLastMonth}
              />
            }
          />
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Lãi tháng này</h3>
          <span className="space-x-2">
          <ResultDisplay
            query={query}
            item={
              <AmountTrending
                current={query.data ? (query.data.expensesThisMonth - query.data.incomesThisMonth) : 0}
                prev={query.data ? (query.data.expensesLastMonth - query.data.incomesLastMonth) : 0}
              />
            }
          />
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Tổng chi tiêu <span className="text-sm font-light">(tính từ ngày {new Date(sessionData.user.user.createdAt).toLocaleDateString("vi-VN")})</span></h3>
          <ResultDisplay
            query={query}
            item={
              <p className="text-xl font-light inline">{query.data?.totalExpenses.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
            }
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Tổng thu nhập <span className="text-sm font-light">(tính từ ngày {new Date(sessionData.user.user.createdAt).toLocaleDateString("vi-VN")})</span></h3>
          <ResultDisplay
            query={query}
            item={
              <p className="text-xl font-light inline">{query.data?.totalIncomes.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
            }
          />
        </div>

      </CardContent>
    </Card>
  );
};

const AmountTrending = ({
  current,
  prev,
}: {
  current: number;
  prev?: number;
}) => {
  const change = !prev ? 0 : ((current - prev) / prev) * 100;
  return (
    <span className="space-x-2">
      <p className="text-xl font-light inline">{current.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
      {!!change && (
        change > 0 ? (
          <span className="text-green-600 space-x-1">
            <TrendingUp className="h-4 w-4 inline" />
            {change}% so với tháng trước
          </span>
        ) : (
          <span className="text-red-600 space-x-1">
            <TrendingDown className="h-4 w-4 inline" />
            {-change}% so với tháng trước
          </span>
        )
      )}
    </span>
  );
};
