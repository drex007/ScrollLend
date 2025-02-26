import { format } from "date-fns";
import { usePastActivities } from "../../hooks/useRecentActivities";

export const Activity = () => {
  const { activities, loadingPastActivities } = usePastActivities();
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Recent Activities
      </h2>

      {loadingPastActivities ? (
        <p className="text-gray-400">Loading activities...</p>
      ) : activities.length === 0 ? (
        <p className="text-gray-400">No recent activities found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full text-gray-300">
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Token</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-4 py-2">
                    {format(new Date(activity.date), "PPpp")}
                  </td>
                  <td className="px-4 py-2">{activity.action}</td>
                  <td className="px-4 py-2">{activity.tokenInfo.symbol}</td>
                  <td className="px-4 py-2">{activity.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
