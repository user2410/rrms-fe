import Step3Basic from "./_components/step3_basic";
import Step3Policies from "./_components/step3_policies";
import Step3Price from "./_components/step3_price";

export default function Step3() {
  return (
    <div className="space-y-4">
      <Step3Basic/>
      <Step3Price/>
      <Step3Policies/>
    </div>
  );
}
