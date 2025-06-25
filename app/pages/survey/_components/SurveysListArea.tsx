import { SurveyListItem } from "@/app/lib/type";
import SurveysListTable from "./SurveysListTable";

type Props = {
  data: SurveyListItem[];
};

const SurveysListArea = ({ data }: Props) => {
  return (
    <div className="my-8">
      <SurveysListTable data={data}/>
    </div>
  );
};

export default SurveysListArea;
